import datetime

def timer(func):
    def wrapper():
        now = datetime.datetime.now()
        func()
        print('Time elapsed: %s'%(str(datetime.datetime.now() - now)))
    return wrapper

@timer
def sumList(length):
    print 'test'
    return sum(range(length))

def main():
    print 'hi'
    sumList(10)
