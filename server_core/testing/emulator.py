from tornado.gen import Return
from tornado.tcpclient import TCPClient
from tornado.ioloop import IOLoop
from tornado import gen
import csv


@gen.coroutine
def setup(reader):
    stream = yield TCPClient().connect('localhost', '9090')
    # Skipping the header row
    if not reader.next():
        Return(False)
    while True:
        data = reader.next()
        yield stream.write(b"{}".format(data[0]))
        yield gen.sleep(0.5)


def main():
    fd = open('/home/tmkasun/Documents/pvt/github/knnect/server_core/testing/sample.csv', 'r')
    reader = csv.reader(fd)
    setup(reader)
    IOLoop.current().start()


if __name__ == '__main__':
    main()
