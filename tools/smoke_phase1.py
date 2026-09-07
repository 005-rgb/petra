"""Start the prototype server and verify its public contract over HTTP."""

from http.client import HTTPConnection
from pathlib import Path
import subprocess
import sys
import time


ROOT = Path(__file__).resolve().parents[1]
PORT = 5099
process = subprocess.Popen(
    [sys.executable, "main.py"],
    cwd=ROOT,
    env={"PATH": __import__("os").environ.get("PATH", ""), "PORT": str(PORT)},
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
)


def fetch(path):
    connection = HTTPConnection("127.0.0.1", PORT, timeout=3)
    connection.request("GET", path)
    response = connection.getresponse()
    body = response.read()
    status = response.status
    content_type = response.getheader("Content-Type", "")
    connection.close()
    return status, content_type, body


try:
    deadline = time.time() + 5
    while time.time() < deadline:
        try:
            status, _, _ = fetch("/")
            if status == 200:
                break
        except OSError:
            time.sleep(0.05)
    else:
        raise AssertionError("server did not open its port")

    checks = {
        "/": ("text/html", b"RUSH RIDER"),
        "/styles.css": ("text/css", b"game-stage"),
        "/game.js": ("text/javascript", b"function beginRun"),
        "/favicon.svg": ("image/svg+xml", b"<svg"),
        "/favicon.ico": ("image/svg+xml", b"<svg"),
        "/manifest.webmanifest": ("", b'"short_name"'),
        "/sw.js": ("text/javascript", b"RUSH RIDER"),
        "/icon-192.svg": ("image/svg+xml", b"<svg"),
        "/icon-512.svg": ("image/svg+xml", b"<svg"),
    }
    for path, (expected_type, marker) in checks.items():
        status, content_type, body = fetch(path)
        assert status == 200, f"{path}: expected 200, got {status}"
        assert expected_type in content_type, f"{path}: unexpected content type {content_type}"
        assert marker in body, f"{path}: expected marker not found"

    status, _, _ = fetch("/not-a-route")
    assert status == 404, f"unknown route: expected 404, got {status}"
    print("PASS: Phase 1 HTTP smoke test completed.")
finally:
    process.terminate()
    try:
        process.wait(timeout=2)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()