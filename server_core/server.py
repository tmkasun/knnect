#! /usr/bin/env python

import logging

import time
from tornado.ioloop import IOLoop
from tornado.options import options, define
from tornado.websocket import WebSocketHandler
from tornado.httpserver import HTTPServer
from tornado import web

from repo.KnnectHandler import KnnectHandler


# http://tornadogists.com/532067/
from repo.utils import startupAnimation


class StatusHandler(WebSocketHandler):
    connections = []

    def open(self, **data):
        print ("Opened new web socket connection")
        StatusHandler.connections.append(self)

    def on_close(self):
        print ("Closed new web socket connection")
        StatusHandler.connections.remove(self)

    def on_message(self, message):
        self.write_message(u"You said: " + message)

    def check_origin(self, origin):
        return True
        # def callback(self, count):
        #     self.write_message('{"inventoryCount":"%d"}' % count)


class Application(web.Application):
    def __init__(self):
        handlers = [
            (r'/ws/data', StatusHandler)
        ]
        web.Application.__init__(self, handlers)


logger = logging.getLogger(__name__)


# ===============================================================================
# Standard boilerplate to call the main() function to begin the program.
# ===============================================================================

def main():
    startupAnimation()
    define("tcp_port", default=9090, help="TCP port to listen on")
    define("ws_port", default=9080, help="Websocket port to listen on")
    options.parse_command_line()
    server = KnnectHandler(StatusHandler)
    server.listen(options.tcp_port)
    # server.start(0)  # Forks multiple sub-processes
    logger.info("Listening on TCP port %d", options.tcp_port)
    logger.info("Connections open for web sockets on port %d", options.ws_port)
    # IOLoop.current().start()

    app = Application()
    server = HTTPServer(app)
    server.listen(options.ws_port)
    IOLoop.instance().start()


if __name__ == "__main__":
    main()
