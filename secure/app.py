"""HTTP wrapper for the secure assistant. Python stdlib only.

Run:  python3 app.py          (defaults: 127.0.0.1:5002)
Env:  PORT, HOST, SAMPLE_DATA_DIR, AUDIT_LOG
"""
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import assistant

HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "5002"))


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_response(404)
            self.end_headers()
            return
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        result = assistant.chat(body.get("question", ""))
        payload = json.dumps(result).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self._cors()
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *args):
        pass  # keep the console clean


if __name__ == "__main__":
    print(f"SECURE backend listening on http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
