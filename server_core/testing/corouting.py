import asyncio
from collections import Coroutine
from dis import Bytecode


@asyncio.coroutine
def countdown(name, n):
    while n > 0:
        print('T-minus', n, '({})'.format(name))
        yield from asyncio.sleep(1)
        n -= 1

a = Bytecode(countdown)
for i in a:
    print(i)
Coroutine
assert False
loop = asyncio.get_event_loop()
tasks = [
    asyncio.ensure_future(countdown("A", 5)),
    asyncio.ensure_future(countdown("B", 10))
]
loop.run_until_complete(asyncio.wait(tasks))
print("closing")
loop.close()
