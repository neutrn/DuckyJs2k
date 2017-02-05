# A quick-and-dirty rotating 3D duck

This is an ugly hack that uses JS+HTML canvas and PNG compression to render a rotating duck in less than 2k bytes. Inspired by http://www.pouet.net/prod.php?which=56598.

Look here for the end result: http://rossi.pw/duck/

![Screenshot](./screenshot.png?raw=true "Screenshot")

# Why?

The conversation went something like this:

> * a friend: (browsing pouet.net) Wow! They made a rotating duck in less than 2k!
> * me: Looks cool, but not that impressive, really.
> * a friend: It's amazing that they did it in less then 2k! Bet you can't do it!
> * me: No? *Hold me beer!*

# Requirements

To build it you need specific versions of Python (incl. Dice3DS), optipng, pngcrush, ImageMagick, and who knows what.

# License

duck.3ds acquired from http://pascal.leynaud.free.fr/3ds/. However, I reduced the amount of polys a bit in Blender. This could be considered cheating (in terms of the 2k size challenge), but the implementation by Knox did that as well.

jsmin.py

```
# This code is original from jsmin by Douglas Crockford, it was translated to
# Python by Baruch Even. The original code had the following copyright and
# license.
#
# /* jsmin.c
#    2007-05-22
#
# Copyright (c) 2002 Douglas Crockford  (www.crockford.com)
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
# of the Software, and to permit persons to whom the Software is furnished to do
# so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# The Software shall be used for Good, not Evil.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
# */
```

pngcanvas.py

```
Simple PNG Canvas for Python 0.8
Rui Carmo (http://the.taoofmac.com)
CC Attribution-NonCommercial-NoDerivs 2.0 Rui Carmo
```

The rest of the code and related files are licensed under unlicense.

```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>
```