"""Static acceptance checks for the browser gameplay prototype."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "public/index.html").read_text(encoding="utf-8")
JS = (ROOT / "public/game.js").read_text(encoding="utf-8")
CSS = (ROOT / "public/styles.css").read_text(encoding="utf-8")
SERVER = (ROOT / "main.py").read_text(encoding="utf-8")
MANIFEST = (ROOT / "public/manifest.webmanifest").read_text(encoding="utf-8")
SW = (ROOT / "public/sw.js").read_text(encoding="utf-8")


def require(text, pattern, label):
    assert re.search(pattern, text, flags=re.I | re.M), f"missing {label}: {pattern}"


class Phase1PrototypeTests(unittest.TestCase):
  def test_server_serves_prototype(self):
    require(SERVER, r"ThreadingHTTPServer", "HTTP server")
    require(SERVER, r'PORT.*5000', "port fallback")
    require(SERVER, r"public", "public root")


  def test_required_game_loop(self):
    for pattern, label in [
        (r"function beginRun", "run start"),
        (r"function update", "game update"),
        (r"function render", "render loop"),
        (r"function finishRun", "finish state"),
        (r"function setLane", "lane movement"),
        (r"function jump", "jump"),
        (r"function activateBoost", "boost"),
        (r"function damage", "damage"),
        (r"function createTraffic", "traffic"),
        (r"function createObstacles", "obstacles"),
        (r"AudioContext", "basic audio"),
        (r"cue\(kind\)", "audio cues"),
        (r"localStorage", "local persistence"),
        (r"calculateStars", "star calculation"),
        (r"trackEvent", "local telemetry"),
    ]:
      require(JS, pattern, label)


  def test_phase1_numbers_are_locked(self):
    for pattern, label in [
        (r"routeLength:\s*960", "route length"),
        (r"timeLimit:\s*90", "timer"),
        (r"laneSpacing:\s*2\.4", "lane spacing"),
        (r"laneChangeTime:\s*0\.22", "lane change duration"),
        (r"playerHp:\s*100", "player hp"),
        (r"pickupAt:\s*140", "pickup distance"),
        (r"targetTime:\s*75", "star target time"),
    ]:
      require(JS, pattern, label)


  def test_ui_and_input_surfaces_exist(self):
    for pattern, label in [
        (r'id="start-button"', "start button"),
        (r'id="restart-button"', "restart button"),
        (r'id="timer"', "timer HUD"),
        (r'id="distance"', "distance HUD"),
        (r'id="hp-meter"', "hp HUD"),
        (r'id="boost-meter"', "boost HUD"),
        (r'id="map-card"', "minimap"),
        (r'data-action="left"', "mobile left input"),
        (r'data-action="boost"', "mobile boost input"),
    ]:
      require(HTML, pattern, label)
    require(JS, r"touchstart", "touch input")
    require(JS, r"keydown", "keyboard input")
    require(CSS, r"@media \(max-width: 760px\)", "mobile layout")

  def test_installable_pwa_contract(self):
    for pattern, label in [
      (r'"display":\s*"standalone"', "standalone display"),
      (r'"start_url":\s*"/"', "PWA start URL"),
      (r"icon-192\.svg", "PWA icon"),
    ]:
      require(MANIFEST, pattern, label)
    for pattern, label in [
      (r"beforeinstallprompt", "browser install prompt"),
      (r"serviceWorker\.register\(\"/sw\.js\"\)", "service worker registration"),
      (r"APP TERINSTALL", "install confirmation"),
    ]:
      require(JS, pattern, label)
    require(SW, r"caches\.open", "offline app shell cache")


if __name__ == "__main__":
    unittest.main()