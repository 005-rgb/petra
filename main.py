"""Minimal static server for the RUSH RIDER: JAKARTA prototype."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse
import os


ROOT = Path(__file__).parent.resolve()
PUBLIC = ROOT / "public"
PORT = int(os.environ.get("PORT", "5000"))


class PrototypeHandler(SimpleHTTPRequestHandler):
    """Serve only the prototype's public directory with clean SPA fallback."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC), **kwargs)

    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        if path == "/":
            self.path = "/index.html"
        elif path == "/favicon.ico":
            self.path = "/favicon.svg"
        elif path not in {"/index.html", "/styles.css", "/game.js", "/favicon.ico", "/favicon.svg"}:
            self.send_error(404, "Not found")
            return
        return super().do_GET()

    def log_message(self, format, *args):
        # Keep workflow logs useful without printing every asset request.
        if self.path == "/":
            super().log_message(format, *args)


def main():
    if not PUBLIC.exists():
        raise SystemExit("public/ directory is missing")
    server = ThreadingHTTPServer(("0.0.0.0", PORT), PrototypeHandler)
    print(f"RUSH RIDER prototype listening on port {PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()