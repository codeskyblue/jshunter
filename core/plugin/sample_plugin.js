/* 
    only two variable can use: var filename, var content 
    this code will be load and run before program(jshint.js) 

    function can use:
        read(filename);     // this will return filecontent as string
        load(filename);     // run js file, not ok now
        quit(n);            // n is an integer, just like exit n
        print(string);      // print a string, function print will add '\n' automatically
*/

/* Example */
if (filename != 'hello' && content.length > 10){
    quit(0);
};
