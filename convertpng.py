#!python

import pngcanvas
import sys

width = 640
height = 4
x = 0
y = 0
cv = pngcanvas.PNGCanvas(width, height)
offset = 0

rc=gc=bc=1

for fn in sys.argv[1:]:
	f = open(fn, 'rb')
	d = f.read()
	#if rc:
	#	rc=0
	#	if gc:
	#		gc = 0
	#		bc = 1
	#	else:
	#		gc = 1
	#else:
	#	rc=1
	for c in d:
		cv.point(x, y, [ord(c)*rc, ord(c)*gc, ord(c)*bc, 0xFF])
		x = x + 1
		if x >= width:
			x = 0
			y = y +1
	print "s/OFFSET_%s/%s/;" % (fn, offset)
	offset = offset + len(d)

# clear remainder
while y<height:
	cv.point(x, y, [0, 0, 0, 0xFF])
	x = x + 1
	if x >= width:
		x = 0
		y = y +1

o = open("output.png", 'wb')
print "#%s bytes output" % offset
o.write(cv.dump())
o.close()

		

