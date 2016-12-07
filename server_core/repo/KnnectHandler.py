import logging
from tornado import gen
from tornado.iostream import StreamClosedError, IOStream
from tornado.tcpserver import TCPServer
import csv
import pynmea2
import geojson
from shapely.geometry import Point

# https://github.com/Knio/pynmea2
# https://www.safaribooksonline.com/library/view/introduction-to-tornado/9781449312787/ch05s03.html
# https://github.com/frewsxcv/python-geojson
# https://pypi.python.org/pypi/geojson
# 161205164435,,GPRMC,164435.9,A,0703.5964,N,07957.6741,E,0.0,220.00,051216,0.0,E,A*3E,F,imei:868443028828427,08,,F:3.76V,0,122,,413,01,2C08,F6FE


logger = logging.getLogger(__name__)


class KnnectHandler(TCPServer):

    def __init__(self, ws_handler):
        super(KnnectHandler, self).__init__()
        self.ws_connections = ws_handler

    @gen.coroutine
    def handle_stream(self, stream, address):
        while True:
            try:
                data = yield stream.read_until(b"\n")
                logger.info("Received bytes: %s", data)
                if not data.endswith(b"\n"):
                    data += b"\n"
                data_list = list(csv.reader([data])).pop()
                start = data_list.index('GPRMC')
                if start:
                    gprmc = ",".join(data_list[start:15])
                    data = pynmea2.parse()
                    g_point = geojson.Point((data.latitude,data.longitude))

            except StreamClosedError:
                logger.warning("Lost client at host %s", address[0])
                break
            except Exception as e:
                print(e)
