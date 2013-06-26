#!/usr/bin/env python
#
# Created:  2012-8-6
# By:       Sun Shengxiang
# Desc:
#        class conf is sth like ConfigParser, but can manage duplicate keys
#        return value as {"group": {"key": ['value1', value2']}}
#

import re

class config():
    """ read config file easily """
    def __init__(self, filename = None):
        self.__filename = ""
        self.__regp = re.compile(r'^\[(\w+)\]$')
        self.__reitem = re.compile(r'^(.*[^\s]+)\s*[:=]\s*(.*)')
        self.__sections = []
        self.__item = {}
        self.__cursec = ""
        if filename:  self.read(filename)

    def read(self, filename):
        """ set config file name """
        self.__filename = filename
        self.__sections = []
        self.__item = {}
        self.__cursec = ""

        for line in open(filename):
            line = re.sub(r'#.*', '', line)
            line = line.strip()
            if not line: continue
            
            gp = self.__regp.match(line)
            if gp: 
                gpname = gp.groups()[0]
                self.__sections.append(gpname)
                self.__cursec = gpname
            else:
                m = self.__reitem.match(line)
                if m: 
                    if self.__cursec not in self.__item:
                        self.__item[self.__cursec] = []
                    self.__item[self.__cursec].append(m.groups())
                else:
                    print "ERROR: ", line
                    
    def sections(self):
        """ return groups type: [] """
        return self.__sections
    def items(self, group = None):
        """ return items type: [("key", "value"), ] """
        if group == None: return self.__item
        if group not in self.__item: return []
        return self.__item[group]

    def test(self):
        c.read("t.cnf")
        print c.sections()
        for s in c.sections():
            print s
            print c.items(s)
            print self.__filename
        print c.items()


if __name__ == "__main__":
    a = config('./hint.conf')
    print a.items('omitdir')
    print a.items('omitfile')

