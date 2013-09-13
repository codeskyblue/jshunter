		_   __  _  _
		|  /  \ |  |            |
		|  \__  |__|      __  __|__ __  | ~
		|     \ |  | | | /  \   |  /__\ |/
	 \_ /  \_ / |  | \_/ |  |   \_ \__  |
 

Notice: Only support linux platform.

## Dependency
* python >= 2.6

## How to use
use `./hint.py --help` for more help

The simple usage is `./hint.py -r report.html test1.js test2.js

## Extract Regrex
for html, php ... Extract Regrex

	(r'<script type=[\'"]?text/javascript[\'"]?>.*?</script>', re.M|re.S)

Install:
    No need to make; make install; Just copy to some folder, that's all

How to use:
    see ./hint.py --help
    
FINISH:
    v8 engine add
    plugin support
    --plugin --config support
TODO:
    compress js ignore

2013-05-29
    add common.extention in hint.conf
    
2013-03-30
    fix js statics bug

2012-11-13
    v3.3 fix bug of ignore the last error, add --plugin --config, getfiles add maxdepth(default:1000), support plugin
2012-11-2
    v3.2 add exitcode if error not zero
    v3.1 change default config file


Last change: 2012-10-31
    Version is 3.0.
    This day is Oct 31, 2012. a day will write to history. 
        The speed has very much progress, from 20s -> 2s.
        I also update the jshint.js. the new version get more accurate bug find ability.

Last change: 2012-8-19
    This is a new version. So I think the version should be 2.0.
    
    I rewrite almost all the whole code, except the "generate html".
    In this version, you don't need to worry about the program will be hang there.
    Because I import a kthread lib. This is such a good thing, you can set a timeout to a thread.
    And I learn regex recently, and found it so powerful, so you can see a lot of regex in my code.
    In some config file, I also use regex, so if you want to use this tool, You should know a
    little knowledge about regex.

    Ok, I need to go. time now is 11:11.   my motto(love parkour, love life)

    If you have some good idea or got some problem, please contact to me, thanks.

Developer's complain:
    Hell know why python don't support try--except--finally.
    And the python library ConfigParser convert all the key to the lower case. (eg: adWeb -> adweb),
    who let you do this, I want the upper case char.

Author:
    sunshengxiang01@baidu.com, pankai01@baidu.com


## Change Log
1. 若指定的输出文件已经存在则拒绝检查，以防御源文件被覆盖的情况
2. 支持递归检查目录内的所有文件
3. 支持检查html文件中的js代码（提取<script>标签内的代码）
4. 修复了<script></script>在同一行时导致死循环的一个bug
5. 修复了isHidden函数判断上级目录..时引入的bug
6. 修复了相对路径的bug
7. 增加了必要的debug输出
8. 修改了目录结构，增加了conf目录和core/data/目录
9. 增加了分批处理扫描的功能
10. 修正了html文件格式乱码的问题（之前由于输出的代码文件行中有<或>，需要转义，否则会有乱码）
11. 增加了扫描进度
12. 改造了黑名单，定义了三种错误级别：error,warning,ignore其中ignore不输出
13. 代码中的函数拆分，更易于维护
14. 输出报告中增加了warning、error的个数和百分比
15. 修复了待检查文件列表为空未检测的情况
16. [1.2.0]增加了文件正则过滤功能
17. [1.2.0]增加用户自定义检查配置功能
18. 增加jre
19. remove jre

