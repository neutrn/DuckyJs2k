all: size.txt

duck.dat:    duck.3ds process3ds.py
	python process3ds.py duck2.3ds duck.dat

code.dat:    code.js repl.py
	python repl.py code.js >tmp/code.js.tmp
	python jsmin.py <tmp/code.js.tmp | tr -d '\n' >code.dat

index.html:  duck.html offsets.pl
	tr -d '\n' <duck.html | perl offsets.pl >index.html

offsets.pl:  code.dat duck.dat convertpng.py pngcanvas.py
	python convertpng.py code.dat duck.dat >offsets.pl

i.png:	code.dat duck.dat convertpng.py pngcanvas.py
	mkdir tmp 2>/dev/null || true
	python convertpng.py code.dat duck.dat
	convert -separate output.png tmp/output.png
	pngcrush -rem bKGD -rem pHYs -brute -d tmp -e .crush.png tmp/output-0.png >/dev/null
	rm i.png 2>/dev/null || true
	optipng -out i.png -zc1-9 -zm1-9 -zs0-3 -f0-5 tmp/output-0.crush.png

size.txt: index.html i.png
	bash printsize.sh |tee size.txt

clean:
	rm duck.dat tmp/* image.png code.dat output.png index.html i.png size.txt offsets.pl 2>/dev/null || true

