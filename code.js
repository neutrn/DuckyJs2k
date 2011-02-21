//RENAME getByte b
function getByte() {
    return p[i++*4]
}

//RENAME pushFace G
function pushFace(a,b,c) {
    v1.push(a);
    v2.push(b);
    v3.push(c);

//RENAME x1 A
//RENAME x2 B
//RENAME y1 C
//RENAME y2 D
//RENAME z1 E
//RENAME z2 F

    // Calculate normal using cross product
    x1=x[a]-x[b];
    y1=y[a]-y[b];
    z1=z[a]-z[b];
    x2=x[a]-x[c];
    y2=y[a]-y[c];
    z2=z[a]-z[c];
    t = y1*z2 - y2*z1;
    u = z1*x2 - z2*x1;
    v = x1*y2 - x2*y1;
    l=Math.sqrt(t*t+u*u+v*v);
    x.push(t/l);
    y.push(u/l);
    z.push(v/l)
}

N = getByte();
//console.log('npoints(N): ' + N)

// vertex data
x = [];
y = [];
z = [];

q = 255;
w = 128;

// Read vertex data, xxx..., yyy..., zzz... format
// Add mirrored vertices while at it
for(n=N;n--;)x[n]=(getByte()-w-124)/3,x[n+N]=-x[n];
for(n=N;n--;)y[n]=y[n+N]=getByte()-w;
for(n=N;n--;)z[n]=z[n+N]=getByte()*2-q;

N*=2;

//xRENAME v1 K
//xRENAME v2 H
//xRENAME v3 J
v1 = [];
v2 = [];
v3 = [];
S=getByte();
for(n=S;n--;) pushFace(getByte(),getByte(),getByte());

T = getByte();
//console.log('nstrips(T) ' + T)
for(n=T;n--;) {
    U = getByte();
    //console.log('strip has ' + U + 'verts')
    pushFace(getByte(),getByte(),getByte());
    S++;
    for (m=3;m++<U;S++)
        pushFace(v2[v2.length-1], v3[v3.length-1], getByte())
}

// Add mirrored faces
for(n=S;n--;) pushFace(v1[n]+N/2, v2[n]+N/2, v3[n]+N/2);

S*=2;

N+=S; // add normals to vertex count

// Face order
X = [];
for(n=S;n--;) X[n]=n;
//for(n=S-1;X[n]=n--;);

// Sort faces
//function Y(a,b) { return tz[v1[a]]>tz[v1[b]] ? -1 : 1 }

//xRENAME M0 a
//xRENAME M1 b
//xRENAME M2 d
//xRENAME M4 e
//xRENAME M5 f
//xRENAME M6 g
//xRENAME M8 h
//xRENAME M8 i
//xRENAME M10 j
//xRENAME tx e
//xRENAME ty d
//xRENAME tz f

setInterval( function() { with(Math) {
    t = new Date().getTime()/S;
    //console.log('t=' + t);
    I = sin(t)*2; // angle_x
    O = cos(t*.7)*2; // angle_y
    P = -O; // angle_z
    A       = cos(I);
    C       = cos(O);
    E       = cos(P);
    B       = sin(I);
    D       = sin(O);
    F       = sin(P);
    /*
    M0  =   C * E;
    M1  =  C * F;
    M2  =   D;
    M4  =  B*D * E + A * F;
    M5  = -B*D * F + A * E;
    M6  =  B * C;
    M8  = -A*D * E + B * F;
    M9  =  A*D * F + B * E;
    M10 =   A * C;*/

    tx=[];
    ty=[];
    tz=[];

    for(n=N;n--;) {
        //console.log('E=' + E);
        tz[n] = x[n]*(B*F-A*D*E) + y[n]*(A*D*F+B*E) + z[n]*A*C;
        tx[n] = x[n]*C*E - y[n]*C*F + z[n]*D;
        ty[n] = x[n]*(B*D*E+A*F) - y[n]*(B*D*F-A*E) - z[n]*B*C;

        if(n<=N-S)
            // divide by z+something for the real vertices (not for normals)
            tx[n]/=tz[n]/q+3,
            ty[n]/=tz[n]/q+3;

        //tz[n] = x[n]*M8 + y[n]*M9 + z[n]*M10
        //tx[n] = (x[n]*M0 - y[n]*M1 + z[n]*M2)/(tz[n]+R)*q + q //silly offset
        //ty[n] = (x[n]*M4 + y[n]*M5 - z[n]*M6)/(tz[n++]+R)*q + q //silly offset
    }

    X.sort(function(t,n){return tz[v1[t]]-tz[v1[n]]});

    c.fillStyle = 'rgb(0,0,0)';
    c.fillRect(0,0,R,R);
    for(n=S;n--;){
        c.beginPath();
        t=X[n];
        h=tz[N-S+t]*32|0; // |0 = round down to integer
        h=99+(h<0?-h:h);
        //if(v1[t]%(S/2)<18)h=h/4
        //h=t%0xFF
        c.fillStyle = 'rgb('+h+','+h+',0)';
        //console.log(h)
        c.moveTo(tx[v1[t]]+q, ty[v1[t]]+q); //, z[v1[n]])
        c.lineTo(tx[v2[t]]+q, ty[v2[t]]+q); //, z[v2[n]])
        c.lineTo(tx[v3[t]]+q, ty[v3[t]]+q); //, z[v3[n]])
        c.fill()
    } }
}, 9 )

