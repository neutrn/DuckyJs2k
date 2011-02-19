#!python

import time
import BaseHTTPServer
import os

HOST_NAME = '127.0.0.1'
PORT_NUMBER = 8080

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        if s.path.endswith('index.html'):
            s.send_response(200)
            s.send_header("Content-type", "text/html")
            s.end_headers()
            os.system("make")
            s.wfile.write(open('index.html', 'r').read())
        if s.path.endswith('i.png'):
            s.send_response(200)
            s.send_header("Content-type", "image.png")
            s.end_headers()
            s.wfile.write(open('i.png', 'rb').read())


if __name__ == '__main__':
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)