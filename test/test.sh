#!/bin/sh
cd $(dirname $0)
set -x
rm -v ok.html
../hint.py --help
../hint.py --version
../hint.py htmlsample.html
../hint.py -r ok.html htmlsample.html
