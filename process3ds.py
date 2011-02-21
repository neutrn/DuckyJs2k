#! python

import Dice3DS.dom3ds
import sys
import os
overflow_count = 0

#minx, maxx, miny, maxy, minz, maxz
extents = [10000, -10000, 10000, -10000, 10000, -10000]
strips = []
stripified = []

point_map = {}

points = []
faces = []

def sort_points(ps, fs):
	sort_key = 0 # x seems best
	old_ps = ps + []
	#print ps
	ps.sort(key=lambda p: p[sort_key])
	#print ps
	for f in range(len(fs)):
		for fv in range(3):
			fs[f][fv] = ps.index(old_ps[fs[f][fv]])



def dump_points(a):
	global overflow_count
	global point_map
	global points
	r = ''
	ax = ''
	ay = ''
	az = ''

	for n in range(len(a)):
		point_map[n] = n

	# first vertex
	x = int((a[0][0]-extents[0])/(extents[1]-extents[0])*255)
	y = int((a[0][1]-extents[2])/(extents[3]-extents[2])*255)
	z = int((a[0][2]-extents[4])/(extents[5]-extents[4])*255)
	if x < 0 or x > 255: overflow_count = overflow_count + 1
	if y < 0 or y > 255: overflow_count = overflow_count + 1
	if z < 0 or z > 255: overflow_count = overflow_count + 1
	r = r + chr(x) + chr(y) + chr(z)
	o = [x, y, z]
	ax += chr(x)
	ay += chr(y)
	az += chr(z)

	dupecheck = []
	dupecheck.append((x<<16) + (y<<8) + z)
	dupecount = 0
	n = 1
	# the rest
	for p in a[1:]:
		#print "-------------"
		x = int((p[0]-extents[0])/(extents[1]-extents[0])*255)
		y = int((p[1]-extents[2])/(extents[3]-extents[2])*255)
		z = int((p[2]-extents[4])/(extents[5]-extents[4])*255)
		#print "XX %s,%s,%s" % (x-128,y-128,z-128)
		#print "Old %s,%s,%s" % (o[0], o[1], o[2])

		dupecheckv = (x<<16) + (y<<8) + z
		if dupecheckv in dupecheck:
			dupecount += 1
			print 'Point %s is a duplicate to %s' % (n, dupecheck.index(dupecheckv))
			#print point_map
			point_map[n] = dupecheck.index(dupecheckv)
			for nn in point_map.keys():
				if point_map[nn] >= n:
					point_map[nn] = point_map[nn] - 1
			continue
			#print point_map
			#sys.exit(0)
		else:
			dupecheck.append(dupecheckv)
			points.append([x,y,z])
			n += 1

		ax += chr(x)
		ay += chr(y)
		az += chr(z)

		dx = x-o[0]
		dy = y-o[1]
		dz = z-o[2]
		if dx < 0: dx = dx + 256
		if dy < 0: dy = dy + 256
		if dz < 0: dz = dz + 256
		if dx < 0 or dx > 255: overflow_count = overflow_count + 1
		if dy < 0 or dy > 255: overflow_count = overflow_count + 1
		if dz < 0 or dz > 255: overflow_count = overflow_count + 1
		#print "Delta %s,%s,%s" % (dx,dy,dz)
		r = r + chr(dx) + chr(dy) + chr(dz)
		o = [x, y, z]
	print('%s points overflowed, dupecount %s' % (overflow_count,dupecount))
	overflow_count = 0

	if 1: # use 'new' format, first all x coords, etc
		print "Outputting %s points (in reversed order)" % (n)
		r = chr(n) + ax[::-1] + ay[::-1] + az[::-1]

	#for R in point_map.keys():
	#	print "%s, %s" % (R, point_map[R])
	return r

def populate_faces(a):
	global faces
	global points
	n = 0
	faceverts = range(len(points))
	for f in a:
		j = point_map[f[0]]
		k = point_map[f[1]]
		l = point_map[f[2]]
		if j!=k and j!=l and k!=l:
			faces.append([j,k,l])
			n += 1
			if j in faceverts: faceverts.remove(j)
			if k in faceverts: faceverts.remove(k)
			if l in faceverts: faceverts.remove(l)
		else:
			print 'Dropped zero face %s' % (n)
	print "Unused vertices", faceverts

def dump_points_obj(a):
	r = ''

	for p in a:
		x = p[0]
		y = p[1]
		z = p[2]

		r = r + 'v %0.2f %0.2f %0.2f\n' % (x, y, z)
	return r

def dump_faces(a):
	r = ''
	for f in a:
		r = r + chr(f[0] & 0xFF)
		r = r + chr(f[1] & 0xFF)
		r = r + chr(f[2] & 0xFF)
		#b = 0
		#if f[0] > 0xFF: b = 1
		#if f[1] > 0xFF: b = b + 2
		#if f[2] > 0xFF: b = b + 4
		#r = r + chr(b)
	return r

def dump_faces_obj(a):
	r = ''
	for f in a:
		r = r + 'f %s %s %s\n' % (f[0]+1, f[1]+1, f[2]+1)
	return r

def find_next_in_strip(v1, v2, skiplist):
	global faces
	n=0
	#revf = faces + []
	#revf.reverse()
	for f in faces:
		if not n in skiplist:
			if v1 in f and v2 in f:
				return n
		n += 1
	return -1

def gen_strip(firstface, dir):
	global faces
	global stripified

	if firstface in stripified:
		return 0

	res = {}
	tstrip = []

	i0 = 0
	i1 = 1
	i2 = 2

	if dir == 1:
		i0 = 1
		i1 = 2
		i2 = 0
	elif dir == 2:
		i0 = 2
		i1 = 0
		i2 = 1

	local_stripified = stripified + []
	new_faces = []

	currentface = firstface
	tstrip += [faces[currentface][i0], faces[currentface][i1], faces[currentface][i2]]
	while 1:
		local_stripified.append(currentface)
		new_faces.append(currentface)
		currentface = find_next_in_strip(tstrip[-2], tstrip[-1], local_stripified)
		if currentface == -1:
			res['strip'] = tstrip
			res['len'] = len(tstrip)
			res['faces'] = new_faces
			#print "Generated strip with %s verts" % res['len']
			#print res
			return res
		else:
			nextv=-1
			if not faces[currentface][0] in tstrip[-2:]:
				nextv = faces[currentface][0]
			if not faces[currentface][1] in tstrip[-2:]:
				nextv = faces[currentface][1]
			if not faces[currentface][2] in tstrip[-2:]:
				nextv = faces[currentface][2]
			if nextv == -1:
				print 'Current face was %s, looking for next in strip with verts %s and %s, but got %s,%s,%s' % \
					(local_stripified[-1],tstrip[-2],tstrip[-1],faces[currentface][0],faces[currentface][1],faces[currentface][2])
				raise LookupError('What?')
			tstrip += [nextv]


def stripify_longest():
	global faces
	global strips
	global stripified
	maxlen = 0
	currentmax = {}
	
	for f in range(len(faces)):
		if f not in stripified:
			for dir in range(3):
				r = gen_strip(f, dir)
				if r['len'] > maxlen:
					currentmax = r
					maxlen = r['len']

	if maxlen > 0:
		print 'Longest strip is %s verts long' % currentmax['len']
		print 'Faces ', currentmax['faces']
		print 'Verts ', currentmax['strip']
		stripified += currentmax['faces']
		strips.append(currentmax['strip'])

	return maxlen

def stripify():
	global faces
	# faces is already mapped through point_map

	print 'Brute forcing triangle strips...'
	while stripify_longest():
		pass
	non_stripable_faces = []
	final_strips = []
	for s in strips:
		if len(s) == 3:
			non_stripable_faces.append(s)
		else:
			final_strips.append(s)

	r = ''

	# first non-stripped faces
	print 'Outputting %s non-stripped faces' % (len(non_stripable_faces)/3)
	r += chr(len(non_stripable_faces))
	
	# sort by first vertex index
	non_stripable_faces.sort(key=lambda v1: v1[2])

	for c in non_stripable_faces:
		r += chr(c[0])
		r += chr(c[1])
		r += chr(c[2])
	
	# strips
	print 'Outputting %s strips' % (len(final_strips))
	r += chr(len(final_strips))
	for s in final_strips:
		r += chr(len(s))
		for v in s:
			r += chr(v)

	return r

def find_extents(objs):
	global extents
	for o in objs:
		if hasattr(o.obj, 'points'):
			for p in o.obj.points.array:
				extents[0] = min(extents[0], p[0])
				extents[1] = max(extents[1], p[0])
				extents[2] = min(extents[2], p[1])
				extents[3] = max(extents[3], p[1])
				extents[4] = min(extents[4], p[2])
				extents[5] = max(extents[5], p[2])

	print "Extents (%s,%s,%s)->(%s,%s,%s)" % (extents[0],extents[2],extents[4],extents[1],extents[3],extents[5])

def main():
	if len(sys.argv) != 3:
		sys.exit('Usage ' + sys.argv[0] + '<inputfile> <outputfile>')
	outb = ''

	d = Dice3DS.dom3ds.read_3ds_file(sys.argv[1])
	find_extents(d.mdata.objects)
	for o in d.mdata.objects:
		print('Object ' + o.name)
		if hasattr(o.obj, 'points') and o.name == 'Cube':
			print('Triobj %s points' % o.obj.points.npoints)
			duckbody=o.obj
		elif hasattr(o.obj, 'points') and o.name == 'Object05':
			print('Triobj %s points' % o.obj.points.npoints)
			duckeye=o.obj

	# build combined array of eye+body points
	pointarray = []
	for p in duckeye.points.array:
		pointarray.append([p[0],p[1],p[2]])
	for p in duckbody.points.array:
		pointarray.append([p[0],p[1],p[2]])

	# build combined array of eye+body faces
	facearray = []
	for f in duckeye.faces.array:
		facearray.append([f[0],f[1],f[2]])
	o = len(duckeye.points.array)
	for f in duckbody.faces.array:
		facearray.append([f[0]+o,f[1]+o,f[2]+o])

	# sort points
	sort_points(pointarray, facearray)

	# dump points and generate triangle strips
	outb += dump_points(pointarray)
	populate_faces(facearray)
	outb += stripify()

	outfile = open(sys.argv[2], 'wb')
	outfile.write(outb)
	outfile.close()
	print "Done. Wrote %s bytes." % (len(outb))

if __name__ == '__main__':
    main()

