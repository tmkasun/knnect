# import asyncio
# from collections import Coroutine
# from dis import Bytecode
#
#
# @asyncio.coroutine
# def countdown(name, n):
#     while n > 0:
#         print('T-minus', n, '({})'.format(name))
#         yield from asyncio.sleep(1)
#         n -= 1
#
# a = Bytecode(countdown)
# for i in a:
#     print(i)
# Coroutine
# assert False
# loop = asyncio.get_event_loop()
# tasks = [
#     asyncio.ensure_future(countdown("A", 5)),
#     asyncio.ensure_future(countdown("B", 10))
# ]
# loop.run_until_complete(asyncio.wait(tasks))
# print("closing")
# loop.close()

#
# class A(object):
#
#     def __init__(self):
#         name = "Kasun"
#
#     def meth1(self,arg1):
#         print("inside meth1")
#         try:
#             self.meth2("arg_to meth2")
#         except Exception as e:
#             print(e)
#
#     def meth2(self,data):
#         print("inside meth2")
#         raise Exception("Wollaa custome exception")
#
#
# b = A()
# b.meth1("asda")
from tornado.ioloop import IOLoop
from tornado.gen import coroutine
from motor.motor_tornado import MotorClient


@coroutine
def do_update(data):
    db = MotorClient().knnect
    result = yield db.testing.update_one({'i': data.id}, {'$set': {'lk_geo_feature': data}}, upsert=True)
    print(result)


IOLoop.current().run_sync(do_update)
