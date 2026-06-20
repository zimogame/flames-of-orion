#!/usr/bin/env python3
"""
Flames of Orion — Mech Builder Server
Serve file statici + API per salvare/caricare il garage come JSON su disco.

Avvio: python3 server.py
"""
import json
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 8765
BASE_DIR  = Path(__file__).parent
GARAGE_FILE = BASE_DIR / 'garage.json'


class FoiHandler(SimpleHTTPRequestHandler):

    # ── API: GET /api/garage ──────────────────────────────
    def do_GET(self):
        if self.path == '/api/garage':
            self._send_json(self._load_garage())
        else:
            super().do_GET()

    # ── API: POST /api/garage ─────────────────────────────
    def do_POST(self):
        if self.path == '/api/garage':
            length = int(self.headers.get('Content-Length', 0))
            body   = self.rfile.read(length)
            try:
                data = json.loads(body.decode('utf-8'))
                GARAGE_FILE.write_text(
                    json.dumps(data, ensure_ascii=False, indent=2),
                    encoding='utf-8'
                )
                self._send_json({'ok': True, 'units': len(data)})
                print(f"   💾  Garage salvato: {len(data)} unità → {GARAGE_FILE}")
            except Exception as exc:
                self.send_error(400, f'JSON non valido: {exc}')
        else:
            self.send_error(404, 'Endpoint non trovato')

    # ── CORS preflight ────────────────────────────────────
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    # ── helpers ───────────────────────────────────────────
    def _cors_headers(self):
        self.send_header('Access-Control-Allow-Origin',  '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_json(self, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type',   'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self._cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def _load_garage(self):
        try:
            if GARAGE_FILE.exists():
                return json.loads(GARAGE_FILE.read_text(encoding='utf-8'))
        except Exception as exc:
            print(f"   ⚠  Errore lettura garage.json: {exc}")
        return []

    def log_message(self, fmt, *args):
        print(f"   [HTTP] {self.address_string()} — {fmt % args}")


def main():
    os.chdir(BASE_DIR)          # serve i file dalla directory del server

    print()
    print("  🔥  FLAMES OF ORION — MECH BUILDER")
    print(f"  ────────────────────────────────────────")
    print(f"  Server attivo su  http://localhost:{PORT}")
    print(f"  File garage:      {GARAGE_FILE}")
    print(f"  Premi Ctrl+C per fermare")
    print()

    server = HTTPServer(('', PORT), FoiHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server fermato.")
        sys.exit(0)


if __name__ == '__main__':
    main()
