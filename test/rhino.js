/*jshint boss: true, rhino: true */
/*globals JSHINT*/

load("jshint.js");

optstr = 'baidu=12,yx=jxq';
optstr.split(',').forEach(function (arg) {
    var o = arg.split('=');
    print(o[0])
});

var reader = new FileReader();
var input = reader.readAsText('test/sample.js');
var result = JSHINT(input, {});
var output = JSHINT.errors;
output.forEach(function (arg) {
        print (arg.line);
});

