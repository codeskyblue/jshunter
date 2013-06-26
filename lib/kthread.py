'''
Title:          How to kill a thread in python
Refer url:      http://www.cnblogs.com/wujianlundao/articles/2424203.html
Modified by:    Ssx, 2012-8-18
Problem leaved: Can't handle idled program
'''
import threading, sys
import time

class KThread(threading.Thread):
    """
        A subclass of threading.Thread, with a kill() method.
        And also add a timeout parameter.
        eg:
            ktd = KThread(target = function, timeout = 1) # 1s
            ktd.start()
            ktd.kill()
    """
    def __init__(self, *args, **kwargs):
        timeout = kwargs.get('timeout')
        self.__endtime = timeout
        if timeout != None:
            self.__endtime += time.time()
            del(kwargs['timeout'])
            
        self.killed = False
        threading.Thread.__init__(self, *args, **kwargs)

    def start(self):
        """Start the thread."""
        self.__run_backup = self.run
        self.run = self.__run # Force the Thread to install our trace.
        threading.Thread.start(self)

    def __run(self):
        """ Hacked run function, which installs the trace."""
        sys.settrace(self.globaltrace)
        self.__run_backup()
        self.run = self.__run_backup

    def globaltrace(self, frame, why, arg):
        if why == 'call':
            return self.localtrace
        else:
            return None

    def localtrace(self, frame, why, arg):
        if why == 'line':
            if self.__endtime != None and self.__endtime <= time.time():
                print self.__endtime, time.time()
                raise SystemExit()
            if self.killed:
                raise SystemExit()
        return self.localtrace

    def kill(self):
        self.killed = True



