/* all function are load read quit print version, see shell.cc for detail */

/**
 *
 * @date:   2012-10-31
 * @modify: 2012-11-13
 * @author: sunshengxiang01
 */

/* load jshint engine */
load('core/jshint.js');

var result = JSHINT(content, options);

// output result
var errors = JSHINT.errors;
for(var i = 0; i < errors.length; i++)
{
    var err = errors[i];
    if(err == null) continue;
    print(filename + "***" + err.reason + "***" + err.line + "***" + err.character + "***" +err.evidence);
}

