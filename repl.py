#!python

import os
import sys
import string

f=open(sys.argv[1], 'r')
a=f.readlines()

map = {}

for l in a:
	if l[:8] == '//RENAME':
		(frm, to) = string.split(l[9:])
		map[frm] = to

f.seek(0)
d = f.read()

for k in map.keys():
	d = string.replace(d, k, map[k])

print d


