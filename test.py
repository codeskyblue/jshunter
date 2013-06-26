#!/usr/bin/env python
# coding: utf-8
#
#

import pystache


print pystache.render('Hi, {{person}}!', {'person': 'now'})

