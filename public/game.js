(() => {
  "use strict";

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const stage = document.querySelector(".game-stage");
  const ui = {
    startOverlay: document.getElementById("start-overlay"),
    resultOverlay: document.getElementById("result-overlay"),
    startButton: document.getElementById("start-button"),
    restartButton: document.getElementById("restart-button"),
    pauseButton: document.getElementById("pause-button"),
    missionCard: document.getElementById("mission-card"),
    hud: document.getElementById("hud"),
    mobileControls: document.getElementById("mobile-controls"),
    mapCard: document.getElementById("map-card"),
    timer: document.getElementById("timer"),
    distance: document.getElementById("distance"),
    orderDistance: document.getElementById("order-distance"),
    hp: document.getElementById("hp"),
    hpMeter: document.getElementById("hp-meter"),
    boostMeter: document.getElementById("boost-meter"),
    mapDistance: document.getElementById("map-distance"),
    mapProgress: document.getElementById("map-progress"),
    mapPlayer: document.getElementById("map-player"),
    toast: document.getElementById("status-toast"),
    comboBadge: document.getElementById("combo-badge"),
    combo: document.getElementById("combo"),
    resultIcon: document.getElementById("result-icon"),
    resultKicker: document.getElementById("result-kicker"),
    resultTitle: document.getElementById("result-title"),
    resultCopy: document.getElementById("result-copy"),
    resultTime: document.getElementById("result-time"),
    resultNearMiss: document.getElementById("result-near-miss"),
    resultReward: document.getElementById("result-reward"),
  };

  const CONFIG = {
    routeLength: 960,
    pickupAt: 140,
    timeLimit: 90,
    baseSpeed: 14,
    boostSpeed: 21,
    laneSpacing: 2.4,
    laneChangeTime: 0.22,
    laneChangeCooldown: 0.18,
    jumpDuration: 0.62,
    playerHp: 100,
    colors: {
      ink: "#ecf2e8",
      muted: "#93a59d",
      teal: "#43d4c2",
      yellow: "#f6c453",
      coral: "#ff765f",
    },
  };

  const segments = [
    { start: 0, end: 60, zone: "start" },
    { start: 60, end: 140, zone: "pickup" },
    { start: 140, end: 220, zone: "traffic" },
    { start: 220, end: 300, zone: "cone" },
    { start: 300, end: 380, zone: "jump" },
    { start: 380, end: 460, zone: "boost" },
    { start: 460, end: 540, zone: "shortcut" },
    { start: 540, end: 640, zone: "intersection" },
    { start: 640, end: 740, zone: "combo" },
    { start: 740, end: 840, zone: "traffic" },
    { start: 840, end: 900, zone: "recovery" },
    { start: 900, end: 960, zone: "destination" },
  ];

  const world = {
    state: "menu",
    lastTime: 0,
    elapsed: 0,
    distance: 0,
    hp: CONFIG.playerHp,
    boost: 0,
    combo: 1,
    nearMisses: 0,
    reward: 0,
    lane: 0,
    lanePosition: 0,
    laneTarget: 0,
    laneCooldown: 0,
    jumpTime: 0,
    speedBrake: 0,
    boostHeld: false,
    hasPickedUp: false,
    shortcutUsed: false,
    traffic: [],
    obstacles: [],
    particles: [],
    toastTimer: 0,
    toastText: "",
    shake: 0,
    seed: 1227,
  };

  let viewport = { width: 0, height: 0, dpr: 1 };
  let touchStart = null;
  const audio = {
    context: null,
    engine: null,
    engineGain: null,
    init() {
      if (this.context) {
        this.context.resume();
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.context.resume();
    },
    start() {
      this.init();
      if (!this.context || this.engine) return;
      this.engine = this.context.createOscillator();
      this.engineGain = this.context.createGain();
      this.engine.type = "sawtooth";
      this.engine.frequency.value = 112;
      this.engineGain.gain.value = 0.018;
      this.engine.connect(this.engineGain).connect(this.context.destination);
      this.engine.start();
    },
    stop() {
      if (!this.engine) return;
      try { this.engine.stop(); } catch (_) { /* already stopped */ }
      this.engine.disconnect();
      this.engineGain.disconnect();
      this.engine = null;
      this.engineGain = null;
    },
    update(speed, boostActive) {
      if (!this.engine || !this.context) return;
      const target = 100 + speed * 4 + (boostActive ? 60 : 0);
      this.engine.frequency.setTargetAtTime(target, this.context.currentTime, 0.06);
    },
    cue(kind) {
      this.init();
      if (!this.context) return;
      const recipes = {
        start: [440, 0.14, "sine", 0.06],
        jump: [660, 0.1, "triangle", 0.045],
        horn: [185, 0.18, "square", 0.04],
        boost: [820, 0.2, "sawtooth", 0.045],
        pickup: [540, 0.16, "sine", 0.05],
        nearMiss: [960, 0.12, "triangle", 0.04],
        impact: [92, 0.22, "sawtooth", 0.06],
        success: [660, 0.14, "sine", 0.06],
        fail: [130, 0.28, "triangle", 0.05],
      };
      const [frequency, duration, type, volume] = recipes[kind] || recipes.start;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const now = this.context.currentTime;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    },
  };

  function resize() {
    const rect = stage.getBoundingClientRect();
    viewport.width = rect.width;
    viewport.height = rect.height;
    viewport.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * viewport.dpr);
    canvas.height = Math.round(rect.height * viewport.dpr);
    ctx.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
  }

  function seededRandom() {
    world.seed = (world.seed * 1664525 + 1013904223) >>> 0;
    return world.seed / 4294967296;
  }

  function resetWorld() {
    Object.assign(world, {
      state: "ready",
      lastTime: 0,
      elapsed: 0,
      distance: 0,
      hp: CONFIG.playerHp,
      boost: 0,
      combo: 1,
      nearMisses: 0,
      reward: 0,
      lane: 0,
      lanePosition: 0,
      laneTarget: 0,
      laneCooldown: 0,
      jumpTime: 0,
      speedBrake: 0,
      boostHeld: false,
      hasPickedUp: false,
      shortcutUsed: false,
      traffic: [],
      obstacles: [],
      particles: [],
      toastTimer: 0,
      toastText: "",
      shake: 0,
      seed: 1227,
    });
    createTraffic();
    createObstacles();
    updateUI();
  }

  function createTraffic() {
    const placements = [
      [178, -1, "scooter"], [205, 1, "sedan"], [265, 0, "sedan"],
      [318, 1, "scooter"], [418, -1, "sedan"], [505, 1, "scooter"],
      [568, -1, "bus"], [602, 1, "sedan"], [683, 0, "scooter"],
      [726, -1, "sedan"], [786, 1, "scooter"], [818, 0, "sedan"],
    ];
    world.traffic = placements.map(([distance, lane, type], index) => ({
      id: index, distance, lane, type, speed: type === "bus" ? 8.5 : 10 + seededRandom() * 3,
      phase: seededRandom() * Math.PI * 2, passed: false, changing: false,
    }));
  }

  function createObstacles() {
    world.obstacles = [
      { distance: 248, lane: -1, type: "cone", hit: false },
      { distance: 336, lane: 0, type: "bump", hit: false },
      { distance: 434, lane: 1, type: "cone", hit: false },
      { distance: 618, lane: 0, type: "cone", hit: false },
      { distance: 696, lane: 1, type: "bump", hit: false },
      { distance: 765, lane: -1, type: "cone", hit: false },
    ];
  }

  function beginRun() {
    resetWorld();
    world.state = "running";
    audio.start();
    audio.cue("start");
    ui.startOverlay.hidden = true;
    ui.resultOverlay.hidden = true;
    ui.missionCard.hidden = false;
    ui.hud.hidden = false;
    ui.mapCard.hidden = false;
    ui.mobileControls.hidden = false;
    ui.pauseButton.hidden = false;
    showToast("ORDER ACCEPTED");
    requestAnimationFrame(loop);
  }

  function finishRun(success, reason) {
    world.state = success ? "success" : "fail";
    world.boostHeld = false;
    audio.stop();
    audio.cue(success ? "success" : "fail");
    ui.mobileControls.hidden = true;
    ui.pauseButton.hidden = true;
    ui.resultOverlay.hidden = false;
    ui.resultIcon.textContent = success ? "✓" : "×";
    ui.resultIcon.style.color = success ? "var(--teal)" : "var(--coral)";
    ui.resultIcon.style.borderColor = success ? "var(--teal)" : "var(--coral)";
    ui.resultKicker.textContent = success ? "DELIVERY COMPLETE" : "RIDE ENDED";
    ui.resultTitle.textContent = success ? "Order sampai." : reason || "Terlambat di jalan.";
    ui.resultCopy.textContent = success
      ? "Jakarta hari ini belum bisa mengalahkanmu."
      : "Atur napas. Baca jalurnya. Coba lagi.";
    ui.resultTime.textContent = formatTime(world.elapsed);
    ui.resultNearMiss.textContent = String(world.nearMisses);
    ui.resultReward.textContent = success ? `Rp${world.reward.toLocaleString("id-ID")}` : "Rp0";
    if (success) {
      const saved = Number(localStorage.getItem("rushRiderCash") || 0) + world.reward;
      localStorage.setItem("rushRiderCash", String(saved));
    }
  }

  function setLane(direction) {
    if (world.state !== "running" || world.laneCooldown > 0) return;
    const next = Math.max(-1, Math.min(1, world.laneTarget + direction));
    if (next === world.laneTarget) return;
    world.laneTarget = next;
    world.laneCooldown = CONFIG.laneChangeCooldown;
  }

  function jump() {
    if (world.state === "running" && world.jumpTime <= 0) {
      world.jumpTime = CONFIG.jumpDuration;
      audio.cue("jump");
      showToast("JUMP");
    }
  }

  function activateBoost() {
    if (world.state !== "running" || world.boost < 15) return;
    world.boostHeld = true;
    audio.cue("boost");
  }

  function horn() {
    if (world.state === "running") {
      audio.cue("horn");
      showToast("HORN!");
      burstPlayer("#f6c453", 4);
    }
  }

  function update(dt) {
    if (world.state !== "running") return;
    world.elapsed += dt;
    world.laneCooldown = Math.max(0, world.laneCooldown - dt);
    world.lanePosition += (world.laneTarget - world.lanePosition) * Math.min(1, dt / CONFIG.laneChangeTime);
    world.jumpTime = Math.max(0, world.jumpTime - dt);
    world.speedBrake = Math.max(0, world.speedBrake - dt * 2.3);
    world.shake = Math.max(0, world.shake - dt * 2.5);

    const boostActive = world.boostHeld && world.boost > 0;
    const speed = Math.max(4, (boostActive ? CONFIG.boostSpeed : CONFIG.baseSpeed) - world.speedBrake * 5);
    audio.update(speed, boostActive);
    world.distance += speed * dt;
    if (boostActive) world.boost = Math.max(0, world.boost - dt * 27);
    else world.boost = Math.min(100, world.boost + dt * 2.2);

    if (!world.hasPickedUp && world.distance >= CONFIG.pickupAt) {
      world.hasPickedUp = true;
      showToast("PICKUP BERHASIL");
      audio.cue("pickup");
      world.reward = 10000;
    }
    if (!world.shortcutUsed && world.distance >= 468 && world.laneTarget === -1) {
      world.shortcutUsed = true;
      world.distance += 42;
      world.boost = Math.min(100, world.boost + 28);
      world.reward += 500;
      audio.cue("boost");
      burstPlayer("#43d4c2", 16);
      showToast("SHORTCUT +Rp500");
    }

    updateTraffic(dt, speed);
    updateObstacles();
    updateParticles(dt);

    if (world.elapsed >= CONFIG.timeLimit) finishRun(false, "Waktu habis.");
    if (world.distance >= CONFIG.routeLength && world.hasPickedUp) finishRun(true);
    if (world.toastTimer > 0) world.toastTimer -= dt;
    updateUI();
  }

  function updateTraffic(dt, playerSpeed) {
    world.traffic.forEach((car) => {
      car.distance += car.speed * dt;
      if (car.distance < world.distance - 90) {
        car.distance = world.distance + 130 + seededRandom() * 80;
        car.lane = Math.round(seededRandom() * 2) - 1;
        car.passed = false;
      }
      car.changing = Math.sin(world.elapsed * 1.4 + car.phase) > 0.87;
      const relative = car.distance - world.distance;
      const sameLane = Math.abs(car.lane - world.lanePosition) < 0.34;
      if (relative > -1.5 && relative < 3 && sameLane && !car.passed) {
        car.passed = true;
        if (world.jumpTime > 0) {
          world.nearMisses += 1;
          world.combo = Math.min(8, world.combo + 1);
          world.boost = Math.min(100, world.boost + 18);
          world.reward += 100 * world.combo;
          audio.cue("nearMiss");
          burstPlayer("#f6c453", 8);
          showToast(`NEAR MISS +${100 * world.combo}`);
        } else {
          damage(15, "TRAFFIC IMPACT");
        }
      }
    });
  }

  function updateObstacles() {
    world.obstacles.forEach((obstacle) => {
      const relative = obstacle.distance - world.distance;
      const sameLane = Math.abs(obstacle.lane - world.lanePosition) < 0.32;
      if (!obstacle.hit && relative > -1.2 && relative < 1.8 && sameLane) {
        obstacle.hit = true;
        if (world.jumpTime > 0 && obstacle.type === "bump") {
          world.nearMisses += 1;
          world.combo = Math.min(8, world.combo + 1);
          world.reward += 200;
          world.boost = Math.min(100, world.boost + 10);
          audio.cue("nearMiss");
          showToast("PERFECT JUMP +200");
          burstPlayer("#f6c453", 8);
        } else {
          damage(obstacle.type === "bump" ? 10 : 5, obstacle.type === "bump" ? "ROUGH LANDING" : "CONE HIT");
        }
      }
    });
  }

  function damage(amount, label) {
    world.hp = Math.max(0, world.hp - amount);
    world.combo = 1;
    world.shake = 1;
    world.speedBrake = 0.45;
    audio.cue("impact");
    burstPlayer("#ff765f", 10);
    showToast(`${label} -${amount} HP`);
    if (world.hp <= 0) finishRun(false, "Motor terlalu rusak.");
  }

  function updateParticles(dt) {
    world.particles = world.particles.filter((p) => {
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 30 * dt;
      return p.life > 0;
    });
  }

  function burstPlayer(color, count) {
    const x = playerScreen().x; const y = playerScreen().y + 12;
    for (let i = 0; i < count; i += 1) {
      world.particles.push({ x, y, vx: (seededRandom() - .5) * 100, vy: -seededRandom() * 80, life: .3 + seededRandom() * .35, max: .65, color });
    }
  }

  function playerScreen() {
    const road = roadGeometry();
    return { x: road.center + world.lanePosition * road.laneWidth, y: viewport.height * .72 - (world.jumpTime > 0 ? 18 : 0) };
  }

  function roadGeometry() {
    const w = viewport.width; const h = viewport.height;
    const horizon = h * .34;
    const bottomWidth = Math.min(w * .78, 860);
    const topWidth = bottomWidth * .22;
    const bottomY = h * 1.06;
    const center = w * .55;
    return {
      horizon, bottomY, center,
      topLeft: center - topWidth / 2, topRight: center + topWidth / 2,
      bottomLeft: center - bottomWidth / 2, bottomRight: center + bottomWidth / 2,
      laneWidth: bottomWidth / 3,
    };
  }

  function render() {
    const w = viewport.width; const h = viewport.height;
    ctx.clearRect(0, 0, w, h);
    const shakeX = world.shake > 0 ? (seededRandom() - .5) * world.shake * 10 : 0;
    const shakeY = world.shake > 0 ? (seededRandom() - .5) * world.shake * 5 : 0;
    ctx.save(); ctx.translate(shakeX, shakeY);
    drawSky(w, h);
    drawCity(w, h);
    drawRoad();
    drawRoadDetails();
    drawWorldObjects();
    drawPlayer();
    drawParticles();
    ctx.restore();
  }

  function drawSky(w, h) {
    const gradient = ctx.createLinearGradient(0, 0, 0, h * .5);
    gradient.addColorStop(0, "#102b38"); gradient.addColorStop(.54, "#bd795d"); gradient.addColorStop(1, "#f4bd6c");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = .75; ctx.fillStyle = "#ffd581"; ctx.beginPath(); ctx.arc(w * .76, h * .21, Math.min(w,h) * .09, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }

  function drawCity(w, h) {
    const horizon = h * .34;
    ctx.fillStyle = "#263b3e"; ctx.fillRect(0, horizon - 2, w, h * .12);
    const blocks = [
      [0, 90, 90, 115, "#183235"], [100, 68, 70, 137, "#214449"], [181, 110, 105, 95, "#183033"],
      [w - 245, 85, 100, 120, "#264548"], [w - 125, 55, 125, 150, "#172c34"],
    ];
    blocks.forEach(([x, y, bw, bh, color]) => {
      ctx.fillStyle = color; ctx.fillRect(x, horizon - bh + 4, bw, bh);
      ctx.fillStyle = "rgba(246,196,83,.2)";
      for (let yy = horizon - bh + 18; yy < horizon - 10; yy += 20) {
        for (let xx = x + 10; xx < x + bw - 8; xx += 18) ctx.fillRect(xx, yy, 5, 4);
      }
    });
    ctx.fillStyle = "#314d4a"; ctx.fillRect(0, horizon + 18, w, 24);
    ctx.fillStyle = "#0f292e"; ctx.fillRect(0, horizon + 42, w, 12);
  }

  function drawRoad() {
    const r = roadGeometry();
    ctx.fillStyle = "#123338"; ctx.fillRect(0, r.horizon, viewport.width, viewport.height - r.horizon);
    ctx.beginPath(); ctx.moveTo(r.topLeft, r.horizon); ctx.lineTo(r.topRight, r.horizon); ctx.lineTo(r.bottomRight, r.bottomY); ctx.lineTo(r.bottomLeft, r.bottomY); ctx.closePath();
    ctx.fillStyle = "#39464a"; ctx.fill();
    ctx.strokeStyle = "rgba(246,196,83,.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r.topLeft, r.horizon); ctx.lineTo(r.bottomLeft, r.bottomY); ctx.moveTo(r.topRight, r.horizon); ctx.lineTo(r.bottomRight, r.bottomY); ctx.stroke();
    for (let lane = 1; lane < 3; lane += 1) {
      const tx = r.topLeft + (r.topRight - r.topLeft) * lane / 3;
      const bx = r.bottomLeft + (r.bottomRight - r.bottomLeft) * lane / 3;
      ctx.setLineDash([16, 19]); ctx.strokeStyle = "rgba(236,242,232,.25)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(tx, r.horizon); ctx.lineTo(bx, r.bottomY); ctx.stroke(); ctx.setLineDash([]);
    }
  }

  function drawRoadDetails() {
    const r = roadGeometry(); const segment = currentSegment();
    ctx.fillStyle = "rgba(246,196,83,.66)"; ctx.font = "500 10px 'DM Mono', monospace";
    const label = segment ? segment.zone.toUpperCase() : "JAKARTA";
    ctx.fillText(`// ${label}`, 28, viewport.height - 33);
    const worldMark = Math.floor(world.distance / 20) * 20;
    for (let i = 0; i < 8; i += 1) {
      const y = r.horizon + (i / 8) ** 1.7 * (r.bottomY - r.horizon);
      const t = (y - r.horizon) / (r.bottomY - r.horizon);
      const left = r.topLeft + (r.bottomLeft - r.topLeft) * t;
      const right = r.topRight + (r.bottomRight - r.topRight) * t;
      ctx.fillStyle = i % 2 ? "rgba(246,196,83,.22)" : "rgba(67,212,194,.15)";
      ctx.fillRect(left - 22 * t - 6, y, 7 + 12 * t, 2 + 4 * t);
      ctx.fillRect(right + 16 * t, y, 7 + 12 * t, 2 + 4 * t);
      if (i === 2) {
        ctx.fillStyle = "rgba(236,242,232,.45)"; ctx.font = `${9 + 7 * t}px 'DM Mono', monospace`;
        ctx.fillText(`${worldMark}M`, left + 15, y - 5);
      }
    }
  }

  function project(distance, lane) {
    const r = roadGeometry();
    const relative = distance - world.distance;
    const depth = Math.max(0.02, Math.min(1.1, 1 - relative / 150));
    const t = Math.min(1, Math.max(0, depth));
    const y = r.horizon + Math.pow(t, 1.45) * (r.bottomY - r.horizon);
    const left = r.topLeft + (r.bottomLeft - r.topLeft) * t;
    const right = r.topRight + (r.bottomRight - r.topRight) * t;
    return { x: left + (right - left) * (lane + 1.5) / 3, y, scale: .22 + t * .88 };
  }

  function drawWorldObjects() {
    world.traffic.forEach((car) => {
      const pos = project(car.distance, car.lane);
      if (pos.y < roadGeometry().horizon - 20 || pos.y > viewport.height + 30) return;
      drawVehicle(pos.x, pos.y, pos.scale, car.type, car.changing);
    });
    world.obstacles.forEach((obstacle) => {
      if (obstacle.hit) return;
      const pos = project(obstacle.distance, obstacle.lane);
      if (pos.y < roadGeometry().horizon - 20 || pos.y > viewport.height + 20) return;
      drawObstacle(pos.x, pos.y, pos.scale, obstacle.type);
    });
    if (!world.hasPickedUp && world.distance < CONFIG.pickupAt + 55) drawMarker(CONFIG.pickupAt, -1, "PICKUP", "#f6c453");
    if (world.hasPickedUp) drawMarker(CONFIG.routeLength, 1, "DESTINATION", "#ff765f");
    if (!world.shortcutUsed && world.distance > 425 && world.distance < 525) drawShortcut();
  }

  function drawVehicle(x, y, scale, type, changing) {
    const s = Math.max(8, 20 * scale);
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(0, 4 * scale, s * .85, s * .25, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = type === "bus" ? "#d26049" : type === "sedan" ? "#d3a14a" : "#e56d56";
    ctx.beginPath(); ctx.roundRect(-s * .6, -s, s * 1.2, s * 1.28, s * .18); ctx.fill();
    ctx.fillStyle = "#172d34"; ctx.fillRect(-s * .42, -s * .73, s * .84, s * .34);
    ctx.fillStyle = "#f6c453"; ctx.fillRect(-s * .52, s * .05, s * .22, s * .12); ctx.fillRect(s * .3, s * .05, s * .22, s * .12);
    if (changing) { ctx.strokeStyle = "#f6c453"; ctx.lineWidth = Math.max(1, 2 * scale); ctx.beginPath(); ctx.arc(0, -s * .3, s * .95, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }

  function drawObstacle(x, y, scale, type) {
    const s = Math.max(6, 13 * scale);
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,.26)"; ctx.beginPath(); ctx.ellipse(0, 3, s, s * .24, 0, 0, Math.PI * 2); ctx.fill();
    if (type === "bump") {
      ctx.fillStyle = "#f6c453"; ctx.fillRect(-s * 1.3, -s * .22, s * 2.6, s * .36);
      ctx.strokeStyle = "#26353a"; ctx.lineWidth = Math.max(1, 2 * scale);
      for (let i = -1; i < 2; i += 1) { ctx.beginPath(); ctx.moveTo(i * s, -s * .22); ctx.lineTo((i + .5) * s, s * .14); ctx.stroke(); }
    } else {
      ctx.fillStyle = "#ff765f"; ctx.beginPath(); ctx.moveTo(0, -s * 1.2); ctx.lineTo(s * .7, s * .42); ctx.lineTo(-s * .7, s * .42); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#f6c453"; ctx.fillRect(-s * .42, -s * .18, s * .84, s * .16);
    }
    ctx.restore();
  }

  function drawMarker(distance, lane, label, color) {
    const pos = project(distance, lane);
    if (pos.y < roadGeometry().horizon || pos.y > viewport.height + 30) return;
    const s = Math.max(12, 25 * pos.scale);
    ctx.save(); ctx.translate(pos.x, pos.y - s * 1.6);
    ctx.globalAlpha = .75; ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, s * 1.2); ctx.lineTo(0, -s * .8); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -s * .8); ctx.lineTo(s * .8, -s * .42); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = color; ctx.font = `700 ${Math.max(8, 10 * pos.scale)}px 'DM Mono', monospace`; ctx.fillText(label, s, -s * .4);
    ctx.restore();
  }

  function drawShortcut() {
    const pos = project(470, -1);
    if (pos.y < roadGeometry().horizon || pos.y > viewport.height) return;
    ctx.save(); ctx.translate(pos.x - 28, pos.y - 35);
    ctx.fillStyle = "rgba(67,212,194,.18)"; ctx.beginPath(); ctx.roundRect(-35, -15, 96, 28, 6); ctx.fill();
    ctx.fillStyle = "#43d4c2"; ctx.font = "700 9px 'DM Mono', monospace"; ctx.fillText("JALUR CEPAT ↖", -25, 2); ctx.restore();
  }

  function drawPlayer() {
    const pos = playerScreen(); const s = Math.max(14, Math.min(viewport.width, viewport.height) * .035);
    ctx.save(); ctx.translate(pos.x, pos.y);
    const lean = (world.laneTarget - world.lanePosition) * .18;
    ctx.rotate(lean);
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(0, 12, s * .76, s * .27, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#111b1f"; ctx.beginPath(); ctx.ellipse(0, -1, s * .22, s * .74, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#43d4c2"; ctx.beginPath(); ctx.roundRect(-s * .4, -s * .52, s * .8, s * 1.05, s * .2); ctx.fill();
    ctx.fillStyle = "#f6c453"; ctx.beginPath(); ctx.arc(0, -s * .75, s * .3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff765f"; ctx.fillRect(-s * .36, s * .31, s * .72, s * .1);
    if (world.boostHeld && world.boost > 0) {
      ctx.fillStyle = "#f6c453"; ctx.beginPath(); ctx.moveTo(-s * .18, s * .55); ctx.lineTo(0, s * (1.25 + seededRandom() * .35)); ctx.lineTo(s * .18, s * .55); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function drawParticles() {
    world.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2 + p.life * 3, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function currentSegment() {
    return segments.find((segment) => world.distance >= segment.start && world.distance < segment.end);
  }

  function formatTime(seconds) {
    const remaining = Math.max(0, Math.ceil(CONFIG.timeLimit - seconds));
    return `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  }

  function updateUI() {
    const progress = Math.min(1, world.distance / CONFIG.routeLength);
    ui.timer.textContent = formatTime(world.elapsed);
    ui.distance.textContent = `${Math.floor(world.distance)} M`;
    ui.hp.textContent = `${Math.ceil(world.hp)}%`;
    ui.hpMeter.style.width = `${world.hp}%`;
    ui.boostMeter.style.width = `${world.boost}%`;
    ui.mapDistance.textContent = `${Math.floor(world.distance)} / ${CONFIG.routeLength} M`;
    ui.mapProgress.style.width = `${progress * 100}%`;
    ui.mapPlayer.style.left = `${progress * 100}%`;
    ui.combo.textContent = `x${world.combo}`;
    ui.comboBadge.hidden = world.combo <= 1;
    ui.timer.style.color = (CONFIG.timeLimit - world.elapsed < 20) ? "var(--coral)" : "var(--yellow)";
  }

  function showToast(text) {
    world.toastText = text; world.toastTimer = 1.35;
    ui.toast.textContent = text; ui.toast.classList.remove("show");
    requestAnimationFrame(() => ui.toast.classList.add("show"));
    setTimeout(() => { if (world.toastTimer <= 0) ui.toast.classList.remove("show"); }, 1400);
  }

  function loop(timestamp) {
    if (world.state === "running") {
      const dt = Math.min(.05, world.lastTime ? (timestamp - world.lastTime) / 1000 : 0);
      world.lastTime = timestamp;
      update(dt);
      render();
      requestAnimationFrame(loop);
    } else {
      render();
    }
  }

  function togglePause() {
    if (world.state === "running") {
      world.state = "paused"; audio.stop(); ui.pauseButton.classList.add("paused"); showToast("PAUSED");
    } else if (world.state === "paused") {
      world.state = "running"; audio.start(); world.lastTime = performance.now(); ui.pauseButton.classList.remove("paused"); requestAnimationFrame(loop);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setLane(-1);
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setLane(1);
    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") jump();
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") world.speedBrake = .45;
    if (event.key === " ") activateBoost();
    if (event.key.toLowerCase() === "h") horn();
    if (event.key === "Escape") togglePause();
  });
  window.addEventListener("keyup", (event) => { if (event.key === " ") world.boostHeld = false; });
  canvas.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0]; touchStart = { x: touch.clientX, y: touch.clientY, time: performance.now() };
  }, { passive: true });
  canvas.addEventListener("touchend", (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0]; const dx = touch.clientX - touchStart.x; const dy = touch.clientY - touchStart.y;
    const duration = performance.now() - touchStart.time; touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 28 && duration < 300) { horn(); return; }
    if (Math.abs(dx) > Math.abs(dy)) setLane(dx > 0 ? 1 : -1); else if (dy < 0) jump(); else world.speedBrake = .45;
  }, { passive: true });
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("pointerdown", () => {
      const action = button.dataset.action;
      if (action === "left") setLane(-1); if (action === "right") setLane(1);
      if (action === "jump") jump(); if (action === "horn") horn(); if (action === "boost") activateBoost();
    });
    button.addEventListener("pointerup", () => { if (button.dataset.action === "boost") world.boostHeld = false; });
    button.addEventListener("pointerleave", () => { if (button.dataset.action === "boost") world.boostHeld = false; });
  });
  ui.startButton.addEventListener("click", beginRun);
  ui.restartButton.addEventListener("click", beginRun);
  ui.pauseButton.addEventListener("click", togglePause);

  resize();
  resetWorld();
  ui.missionCard.hidden = true;
  ui.hud.hidden = true;
  ui.mapCard.hidden = true;
  render();
})();