import logging
from pymongo.results import InsertOneResult
from tornado import gen
from tornado.iostream import StreamClosedError, IOStream
from tornado.tcpserver import TCPServer
import csv
import pynmea2
import geojson  # Docs https://pypi.python.org/pypi/geojson
from shapely.geometry import Point
import motor
from motor.motor_tornado import MotorClient
from tornado.web import RequestHandler

# https://github.com/Knio/pynmea2
# https://www.safaribooksonline.com/library/view/introduction-to-tornado/9781449312787/ch05s03.html
# https://github.com/frewsxcv/python-geojson
# https://pypi.python.org/pypi/geojson
# 161205164435,,GPRMC,164435.9,A,0703.5964,N,07957.6741,E,0.0,220.00,051216,0.0,E,A*3E,F,imei:868443028828427,08,,F:3.76V,0,122,,413,01,2C08,F6FE

from datetime import datetime

logger = logging.getLogger(__name__)

handlers = []


class KnnectHandler(TCPServer):
    def __init__(self, ws_handler):
        super(KnnectHandler, self).__init__()
        self.ws_handler = ws_handler
        self.db = MotorClient().knnect

    @gen.coroutine
    def handle_stream(self, stream, address):
        first = True
        while True:
            try:
                # interGeoJson = handler_in.process()
                # for handler in handlers:
                #     yield handler(interGeoJson)
                data = yield stream.read_until(b"\n")
                if not data.endswith(b"\n"):
                    data += b"\n"
                logger.info("Received bytes: %s", data)
                self.save(data)
                g_feature = self._tk103_parser(data)
                self.notify_clients(g_feature)
                if first:
                    g_feature['properties']['state'] = 'ONLINE'
                    self.update_lk_status(g_feature)
                    first = False
            except StreamClosedError:
                # Post connection state
                logger.warning("Lost client at host %s", address[0])
                g_feature['properties']['state'] = 'OFFLINE'
                self.notify_clients(g_feature)
                self.update_lk_status(g_feature)
                break
            except Exception as e:
                print(e)

    @gen.coroutine
    def save(self, data):
        result = yield self.db.messages.insert_one({'raw': data})
        logger.info("Saved with id = {}".format(result.inserted_id))

    def notify_clients(self, message):
        [client.write_message(message) for client in self.ws_handler.connections]

    @gen.coroutine
    def update_lk_status(self, data):
        coords = next(geojson.utils.coords(data))
        g_point = geojson.Point(coords)
        result = yield self.db.lk_state.update_one({'o_id': data.id}, {'$set': {'lk_geo_json': g_point, 'lk_state':
            data['properties']['state']}}, upsert=True)
        logger.info("Update LK_Status with id = {}".format(result.raw_result))

    # @gen.coroutine
    # def _read_line(self, stream):
    #     data = yield stream.read_until(b"\n")
    #     if not data.endswith(b"\n"):
    #         data += b"\n"
    #     logger.info("Received bytes: %s", data)
    #     return data

    def _tk103_parser(self, data):
        data_list = list(csv.reader([data.decode("utf-8")])).pop()
        start = data_list.index('GPRMC')
        if start:
            gprmc = ",".join(data_list[start:15])
            data = pynmea2.parse(gprmc)
            g_point = geojson.Point((data.longitude, data.latitude))
            imei = data_list[16].split(':')[1]
            g_properties = {
                'heading': data.true_course,
                'speed': data.spd_over_grnd,
                'state': "NORMAL"
            }
            g_feature = geojson.Feature(geometry=g_point, id=imei, properties=g_properties)
            # self.ws_handler.connections[3].write_message(g_point)
        return g_feature
