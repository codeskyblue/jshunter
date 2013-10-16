		_   __  _  _
		|  /  \ |  |            |
		|  \__  |__|      __  __|__ __  | ~
		|     \ |  | | | /  \   |  /__\ |/
	 \_ /  \_ / |  | \_/ |  |   \_ \__  |
 

Notice: Only support linux platform.

## Dependency
* python >= 2.6

## Why need jshunter
js是门优秀的语言。只是因为一些不好的特性，使得他的名声不是太好。
*另外js不是java，我过去也弄混过。*

java这门语言也确实搞过一些的web小应用，不过现在已经很难见到。只留下js这一门语言。
也足以证明这门语法无比灵活的语言，生命力有多强了。

js因为他太灵活了，所以也太容易出错了。js的开发者也很无奈，因为每一项新的feature加入了进去，
不管这feature是好是坏，只要有人用，你就不能把他给删了。

所以js有那么多的问题，也是可以理解的。
新入门js的可能不太清楚这些坑，大多书上也没提，还大张旗鼓的把那些烂代码copy来copy去。

我举几个简单的例子：

	'' == '0' // false
	0 == ''   // true
	false == undefined // false
	false == null	   // false
	null == undefined  // true

怎么样，晕了吧。js里的==符号就是一个设计失败。建议的是全部使用===和!==代替。

其他的不列举了.....  有本书写的很好**JavaScript语言精髓**，警告了你那些特性你不应该尝试。

好在还有[jslint](http://www.jslint.com/)这种静态代码检查的工具可以用。

有网页版的jslint，不过控制台上办公的码仔们，还是希望有个控制台的东西。所以就有了这款jshunter。

程序用python开发，使用了一个编译后的v8-shell。

## How to use
use `./hint.py --help` for more help

The simple usage is `./hint.py -r report.html test1.js test2.js

## Test if it can work.

	$ ./hint.py  test/sample.js 
	filecount = 1
	Process file: test/sample.js
	/home/shxsun/goproj/src/github.com/shxsun/jshunter/test/sample.js***'a' was used before it was defined.***13***7***var a = 1;
	/home/shxsun/goproj/src/github.com/shxsun/jshunter/test/sample.js***'b' was used before it was defined.***16***1***print('hello');
	Error number: 0

不加report.html的输出就是以***分割的。分别代表`文件名，错误描述，行号，列号，代码`

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

## Friendly link
* <http://www.jshint.com/>
* <http://www.jslint.com/>
