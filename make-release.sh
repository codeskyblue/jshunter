#!/bin/sh
version=`./hint.py -v | awk '{print $2}'`
td="jshunter-$version"
mkdir $td
cp -rv core lib tmp hint.py hint.conf README $td
find $td | grep "[.]svn" | xargs rm -fr
rm $td.tar.gz
tar -czf $td.tar.gz $td
rm -rf $td

