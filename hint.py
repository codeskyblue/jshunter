#!/usr/bin/env python
# -*- encoding:utf-8 -*-

import platform
import re
import sys
version = platform.python_version()  # version test
if not re.match(r'2.[6-9].\d', version):
    print 'Need python version: 2.6.0 +, But current version: %s' %(version)
    sys.exit(1)

import os
import time
import tempfile
import getopt
import subprocess
import ConfigParser # I don't like it
import commands
import traceback
import json

import lib.config    # I write it myself
import lib.kthread


__version__ = '3.6'
# 3.5   remove statistic

# for cxfreeze use
if hasattr(sys, 'frozen'):
    __file__ = sys.executable

__dir__ = os.path.dirname(os.path.abspath(__file__))

#
# global variables
#
htmlMap = {} # no use now
exitcode = 0
config_file = os.path.join(__dir__, 'hint.conf')
plugin_dir  = os.path.join(__dir__, 'core/plugin')

def is64():
    ''' judge system platform is 64 or 32 '''
    return sys.maxint == 2**63-1

def dirname(path):
    ''' function dirname as linux command dirname: add 2012-8-18 '''
    dir = os.path.dirname(path)
    if dir == "": dir = '.'
    return dir

def colored(str, color = 'black'):
    ''' terminal color '''
    if   color == 'red':        return '\033[1;31m%s\033[1;m' % (str)
    elif color == 'green':      return '\033[1;32m%s\033[1;m' % (str) 
    elif color == 'yellow':     return '\033[1;33m%s\033[1;m' % (str) 
    elif color == 'blue':       return '\033[1;34m%s\033[1;m' % (str) 
    elif color == 'magenta':    return '\033[1;35m%s\033[1;m' % (str) 
    elif color == 'cyan':       return '\033[1;36m%s\033[1;m' % (str) 
    elif color == 'white':      return '\033[1;37m%s\033[1;m' % (str) 
    else:
        return str

def debug(*args):
    if os.getenv('DEBUG'):
        s = ''
        for i in args: s += ' ' + str(i)
        print >> sys.stderr, colored('[DEBUG]', 'cyan'), colored(s, 'green')

basename = os.path.basename
abspath  = os.path.abspath

tempfile.tempdir = os.path.join(dirname(sys.argv[0]), 'tmp')

conf = lib.config.config() #ConfigParser.ConfigParser()

def getBlackList(path):
    lst={}
    conf = ConfigParser.ConfigParser()
    conf.read(path)
    for item in conf.options('level'):
        lst[item]=conf.get('level',item)
    return lst

def printReport(rptstr):
    if rptstr=="":
        return
    array = rptstr.split('\n')
    for ln in array:
        items = ln.split("***")
        if items[1].find("Stopping") != -1:
            print items[1]
        else:
            print "文件：%s\t错误原因:%s\t错误位置:第%s行\t错误语句：%s"%(items[0],items[1],items[2],items[4])

def processItem(item,blacklst,hp):
    itm = item
    for key in hp.keys():
        if item[0]+os.sep+item[2] == hp[key]:  # if match filename/lineno, then do replace
            itm[0]=os.sep.join(key.split(os.sep)[:-1]) # file path
            itm[2]=key.split(os.sep)[-1] # origin lineno
    itm.append("error")
    for err in blacklst.keys():
        if itm[1].lower().find(err.lower()) != -1:
            itm[5] = blacklst[err] # true or false
            break
    return itm

def splitOutput(rptstr, blacklist, mp):
    '''
    parse jshint output
    '''
    if rptstr=="":
        return
    array = rptstr.split('\n')
    lst=[]
    parsecnt = 0;
    parsetotal=len(array)
    for ln in array:
        #print ln
        if ln.find("***") == -1:
            continue
        items = processItem(ln.split("***"),blacklist,mp)
        if items[1].find("Stopping") != -1:
            print items[1]
        else:
            lst.append(items)
        parsecnt = parsecnt + 1
    return (lst, parsecnt, parsetotal)

def getBody(lst):
    '''
    get the table body according to the result-list
    '''
    files={}
    error=0
    warning=0
    ignore=0;
    count=0
    for item in lst:
        count = count + 1
        if not files.has_key(item[0]):
            if item[5] == "ignore":
                ignore = ignore + 1
            elif item[5] == "error":
                error = error + 1
                files[item[0]] = getLine(item,count)
            else:
                files[item[0]] = getLine(item,count)
                warning = warning + 1
        else:
            if item[5] == "ignore":
                ignore = ignore + 1
            elif item[5] == "error":
                error = error + 1
                files[item[0]] = files[item[0]] + getLine(item,count)
            else:
                files[item[0]] = files[item[0]] + getLine(item,count)
                warning = warning + 1
    global exitcode
    exitcode = error
    return (files,ignore,warning,error)
    
def generateHtml(rptstr,outfile,blacklst,mp):
    print "start parsing jshint output..."
    (lst,parsecnt,parsetotal) = splitOutput(rptstr,blacklst,mp)
    print "prepare main tpl..."
    tpl=""
    tplPath=os.sep.join(os.path.abspath(__file__).split(os.sep)[:-1])+os.sep+"core"+os.sep+"tpl"+os.sep+"toggle_tpl.html"
    if not os.path.exists(tplPath):
        raise Exception('%s file does not exists!'%(tplPath))

    tpl = open(tplPath).read()

    strStartTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
    tpl=tpl.replace("{$pnumber}",str(len(lst)))
    tpl=tpl.replace("{$timeData}",strStartTime)

    print "blacklist filtering..."
    (files,ignore,warning,error) = getBody(lst)
    if len(lst) == 0: lst = [1]
    tpl=tpl.replace("{$ignumber}","%s(%5.1f%%)"%(str(ignore),(float(ignore)/len(lst)*100)))
    tpl=tpl.replace("{$errnumber}","%s(%5.1f%%)"%(str(error),(float(error)/len(lst)*100)))
    tpl=tpl.replace("{$warnumber}","%s(%5.1f%%)"%(str(warning),(float(warning)/len(lst)*100)))
    print "prepare body"
    bodys=""
    for key in files:
        tblPath=os.sep.join(os.path.abspath(__file__).split(os.sep)[:-1])+os.sep+"core"+os.sep+"tpl"+os.sep+"htmlpart.html"
        if not os.path.exists(tblPath):
            raise Exception('%s file does not exists!'%(tblPath))
        f=open(tblPath,"r")
        body=''''''
        for ln in f:
            body += ln
        body = body.replace("{$title}",key)
        body = body.replace("{$fname}",key)
        f.close()
        body = body.replace("[---to be replaced 2---]",files[key])
        bodys = bodys + body
    if bodys=="":
        #raise Exception('no report generated')
        bodys = "no informatin maybe they are filtered"
    tpl=tpl.replace("[---to be replace 1---]",bodys)
    ts=str(int(time.time()))
    resf=open(outfile,"w")
    if resf is None:
        raise Exception('open %s error!' % (outfile))
    resf.write(tpl)
    resf.close()
    print "generate html file %s OK!"%(outfile)
    return ts

def getLine(item,no):
    #print item
    text = '''<tr><td width='10%%'>%s</td><td width='10%%'>%s</td><td width='20%%'>%s</td><td width='10%%'>%s</td><td width='50%%'>%s</td></tr>'''%(str(no),item[5],item[1],item[2],item[4].replace("<","&lt;").replace(">","&gt;"))
    return text

def genReport(status,output,blackpath,outfile,htmlMap):
    if output.find("open file") != -1:
        index = output.find("open file")
        print output[index-100: index + 200]
        raise Exception("File Not Found Error!")
    #print "[ERROR DETECTED BY JSHUNTER]"
    blacklist = getBlackList(blackpath)
    ts = generateHtml(output,outfile,blacklist,htmlMap)
    return ts

def getCustomerCheckFiles(paths):
    omitpath = os.path.dirname(__file__) + os.sep + "conf" + os.sep + "omitfiles.conf"
    ret = []
    for path in paths:
        path = path.rstrip(os.sep)
        path = os.path.abspath(path)
        if not os.path.isdir(path):
            omitfiles = getOmitedFiles(omitpath,os.sep.join(path.split(os.sep)[:-1])+os.sep)
            if ((os.path.getsize(path)==0) or (path in omitfiles)):
                continue
            ret.append(path)
        else:
            omitfiles = getOmitedFiles(omitpath,path)
            for root, dirs, files in os.walk(path):
                for f in files:
                    if (os.path.getsize(root + os.sep + f)==0) or ((root + os.sep + f) in omitfiles):
                        continue
                    else:
                        ret.append(root + os.sep + f)
    return ret
    

def doCustomerCheck(_path):
    confpath = os.path.join(dirname(__file__), "conf", "custcheck.conf")
    custpath = os.path.join(dirname(__file__), "core" , "customcheck")

    ops = getCustCheckOpt(confpath)
    fileToCheck = getCustomerCheckFiles(_path)
    sz = len(fileToCheck)
    if sz == 0:
        print "[WARNING]no file to be checked in doCustomerCheck"
        return ""
    custout = ''
    for item in ops:
        for i in range(0,sz):
            cmd = "sh %s %s"%(custpath + item,fileToCheck[i])
            #print cmd
            (status,output_tmp)=commands.getstatusoutput(cmd)
            for ln in output_tmp.split("\n"):
                if ln.find("***") != -1:
                    custout += (ln+"\n")
    
    return custout

def getCustCheckOpt(path):
    _opt=[]
    conf = ConfigParser.ConfigParser()
    conf.read(path)
    for item in conf.options('command'):
        if conf.get('command',item) == "true":
            _opt.append(item)
    return _opt

# ssx add at 2012-8-18
def usage():
    print '''\
Usage:     
    hint.py [-r][--report=report.html] file1, file2, dir1, dir2 ...
    hint.py [-h][--help][-v][--version]

Options:
    -r, --report=report.html:   generate an html report. 
                                If you don't set this option, result will be send to stdout
    -h, --help                  show help message
    -v, --version               show version info
    -c, --config=hint.conf      specify config file
    -p, --plugin=plugin_dir     specify plugin dir

Example:
    ./hint.py -r report.html test/
    ./hint.py test/sample.js

Authors:
    sunshengxiang01@baidu.com pankai01@baidu.com''' 

def error(msg):
    print '[Error]', msg
    sys.exit(1)

def usage_and_exit(exitcode):
    usage()
    sys.exit(exitcode)

def dirname(path):
    dir = os.path.dirname(path)
    if dir == "": dir = '.'
    return dir

def getfiles(path, allowext = [], fileomit = [], diromit = [], maxdepth = 1000): 
    '''
       eg:
            allowext = ['.html', '.js']
            fileomit = [r'svn.*', r'.*god']
        program will change item in fileomit to 
            item = '^' + item + '$'
        maxdepth    an integer none negtive, set maxdepth=0 means no search dir
    '''
    files = []
    if os.path.isfile(path):
        try:
            ext = os.path.splitext(path)[1]
            if ext in allowext:
                ok = True
                for regex in fileomit:
                    regex = '^' + regex + '$'
                    if re.match(regex, basename(path)):
                        ok = False
                        break
                if ok: files.append(path)
        except:
            pass
    elif os.path.isdir(path) and maxdepth > 0:
        ok = True
        for regex in diromit:
            if re.match(regex, basename(path)):
                ok = False
                break
        if ok:
            try:
                for item in os.listdir(path):
                    itemsrc = os.path.join(path, item)
                    files += getfiles(itemsrc, allowext, fileomit, diromit, maxdepth - 1)
            except:
                pass
    return files
    
def execjshint(filename, options = {}):
    ''' make a sub process, call shell to exec('v8-shell -jar ....') '''
    print >> sys.stderr, 'Process file: %s' % filename
    if os.path.getsize(filename) == 0:
        return ''
    absname = abspath(filename)

    curdir  = os.getcwd()
    hintdir = __dir__ 

    # generate main.js file for v8
    tmpfd = tempfile.NamedTemporaryFile(mode='w+', prefix=basename(filename)+'.main.', suffix='.js')
    tmpfd.write('var filename = "%s";\n' % absname)
    tmpfd.write('var content  = read(filename);\n')

    # get plugins from hint.conf     default: enable
    plugins = getfiles(plugin_dir, ['.js'], maxdepth = 1)
    for k, v in conf.items('plugin'):
        k = abspath(os.path.join(plugin_dir, k))
        if v == 'false' and abspath(k) in plugins:
            plugins.remove(k)

    debug('plugins', str(plugins))
    for p in plugins:
        tmpfd.write(open(p).read() + '\n')

    # options
    tmpfd.write('var options = ' + json.dumps(options) + ';\n')


    content = open(os.path.join(hintdir, 'core/template_main.js')).read()
    tmpfd.write(content)
    tmpfd.flush()
    debug('main tempfile', tmpfd.name)
    debug('main.js content:\n', open(tmpfd.name).read())

    # choose v8
    if is64():
        cmd_prefix = 'core/v8-shell-64 %s' % tmpfd.name
    else:
        cmd_prefix = 'core/v8-shell-32 %s' % tmpfd.name

    os.chdir(hintdir)
    status,output = commands.getstatusoutput(cmd_prefix) 
    os.chdir(curdir)        # restore dir

    output = output.rstrip() + '\n' # the last line may not end with \n
    return output
    
def runjshint(filename, filter, options = {}):
    ''' 
    return checked result
    filter  [], a list of string, if error message contains that, then suppress the output.
    '''
    name, ext = os.path.splitext(filename)

    hintdump = []
    if ext != '.js':
        content = open(filename).read()
        ind = 0
        js_regex    = re.compile(r'<script type=[\'"]?text/javascript[\'"]?>.*?</script>', re.M|re.S)
        strip_regex = re.compile(r'(<script.*?>)(.*)</script>', re.M|re.S)

        jslist = js_regex.findall(content)

        for jsitem in jslist:
            ind += content[ind:].find(jsitem) #ind: index
            col = content[:ind].rfind('\n') # script start column (index from 0)
            if col == -1: col = ind
            row = content[:ind].count('\n') # script start row   (index from 0)
            ind += len(jsitem)

            tmpfd = tempfile.NamedTemporaryFile(mode='w+', prefix=basename(filename)+'.')
            # this way will cause the ind not correct
            #prefixlbl, jspart = re.match(r'(<script.*?>)(.*)</script>', jsitem).groups()
            prefixlbl, jspart = strip_regex.match(jsitem).groups()
            tmpfd.write(jspart)
            tmpfd.flush()

            output = execjshint(tmpfd.name, options)
            tmpfd.close()

            for item in re.findall(r'.*\n', output):
                item = item.rstrip()
                ret = item.split('***', 4)
                if len(ret) != 5: continue  # just make sure
                (fname, msg, errline, errind, cont) = ret
                errline = int(errline) + row
                fname = abspath(filename)
                hintdump.append((fname, msg, str(errline), errind, cont))
    else:
        output = execjshint(filename, options) 
        debug('OUTPUT-->', output)
        for item in re.findall(r'.*\n', output): #output.split('\n'): 
            item = item.rstrip()
            ret = item.split('***', 4)
            if len(ret) != 5: continue
            hintdump.append(ret)

    # filter by level in hint.conf
    result = ''
    for item in hintdump:
        ok = True
        error_msg = item[1]
        for s in level_ignore:
            if error_msg.find(s) != -1: # ret[1]: error message
                debug('filter', error_msg, '----', s)
                ok = False
                continue
        if ok:
            debug(item, len(item))
            result += '%s***%s***%s***%s***%s\n' % tuple(item)
    return result


if __name__ == "__main__":
    repfile = None # report file
    
    # health check
    # parse command input
    if len(sys.argv) < 2:
        usage_and_exit(2)
    try:
        opts, args = getopt.getopt(sys.argv[1:], 'hr:vc:p:', ['help', 'report=', 'version', 'config=', 'plugin='])
        for k, v in opts:
            if   k == '--help' or k == '-h':
                usage_and_exit(0)
            elif k == '--report' or k == '-r':
                repfile = v
            elif k == '--version' or k == '-v':
                print 'Version: {0}'.format(__version__)
                sys.exit(0)
            elif k == '--plugin' or k == '-p':
                plugin_dir = v
            elif k == '--config' or k == '-c':
                config_file = v
    except getopt.GetoptError:
        usage_and_exit(1)

    #
    # health check
    #
    if not os.path.isdir(plugin_dir):
        error('plugin directory: %s not exists' %(plugin_dir))
    if not os.path.isfile(config_file):
        error('config file path: %s must be a file' %(config_file))

    confile = os.path.join(config_file) # configuration file
    conf.read(confile)
    

    #
    # prepare configuration file
    #
    options = {}
    options['predef'] = {}
    for k, v in conf.items('hint_option'): 
        if v.isdigit():
            options[k] = int(v)
        else:
            options[k] = (v == 'true')
    for k, v in conf.items('hint_predef'): options['predef'][k] = (v == 'true')
    #open(option_path, 'w').write('var options = ' + json.dumps(options) + ';')

    fileomit        = [k for k, v in conf.items('omitfile') if v == 'true']
    diromit         = [k for k, v in conf.items('omitdir') if v == 'true']
    level_ignore    = [k for k, v in conf.items('level') if v == 'ignore'] # error level (ignore, warning, error)

    # get extention from config
    extention       = [v for k, v in conf.items('common') if k == 'extention' ]
    if not extention:
        extention = ['.html', '.htm', '.js']
    else:
        extention = [ '.'+k for k in extention[0].split(',') if k.strip() != ""  ]
    debug("extention allow:", extention)

    hintoutput = ""
    file_count = 0
    for path in args:
        files = getfiles(path, extention, fileomit, diromit)
        file_count = len(files) # for record
        sys.stderr.write('filecount = %d\n' %len(files))

        # main part
        for file in files:
            debug("running -> ", file)
            output = runjshint(file, level_ignore, options)
            output = output.rstrip() + '\n' # make sure output have \n
            if repfile == None:
                print output,
            else:
                hintoutput += output
        # end of main part

    # generate report
    if repfile != None:
        if hintoutput:
            print "[FILE TO REPORT ]%s"%(repfile) 
            ts = genReport(0, hintoutput, confile, repfile, htmlMap)
        else:
            print "[WARNING]%s"%("no error detected")
    
    print >> sys.stderr, "Error number:", exitcode
    sys.exit(min(125, exitcode))



