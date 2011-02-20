function b() {
    return p[i++*4]
}

//RENAME x1 A
//RENAME x2 B
//RENAME y1 C
//RENAME y2 D
//RENAME z1 E
//RENAME z2 F

// push face
function G(a,b,c) {
    v1.push(a)
    v2.push(b)
    v3.push(c)

    // normal
    //y1*z2 - y2*z1 , z1*x2 - z2*x1 , x1*y2 - x2*y1

    x1=x[a]-x[b]
    y1=y[a]-y[b]
    z1=z[a]-z[b]
    x2=x[a]-x[c]
    y2=y[a]-y[c]
    z2=z[a]-z[c]
    t = y1*z2 - y2*z1
    u = z1*x2 - z2*x1
    v = x1*y2 - x2*y1
    l=Math.sqrt(t*t+u*u+v*v)
    x.push(t/l)
    y.push(u/l)
    z.push(v/l)
}

N = b()
//console.log("npoints(N): " + N)

x = []
y = []
z = []
q = 255
w = 128

// xxx, yyy, zzz format
/*
for(n=0;n<N;n++) {
    x[n]=(p[i*4]-w-124)/3
    x[n+N]=-x[n] // points are duplicated for mirroring
    y[n]=y[n+N]=p[(i+N)*4]-w
    z[n]=z[n+N]=(p[(2*N+i++)*4]-w)*2
}
*/
for(n=0;n<N;n++)x[n]=(b()-w-124)/3,x[n+N]=-x[n]
for(n=0;n<N;n++)y[n]=y[n+N]=b()-w
for(n=0;n<N;n++)z[n]=z[n+N]=b()*2-q

N*=2
//i += N

v1 = []
v2 = []
v3 = []

S = b()
//console.log("nfaces(S): " + S)

for(n=0;n<S;n++) G(b(),b(),b())

T = b()
//console.log("nstrips(T) " + T)
for(n=0;n<T;n++) {
    U = b()
    //console.log("strip has " + U + "verts")
    G(b(),b(),b())
    S++
    for (m=3;m++<U;S++)
        G(v2[v2.length-1], v3[v3.length-1], b())
}

// Add mirrored faces
for(n=0;n<S;) G(v1[n]+N/2, v2[n]+N/2, v3[n++]+N/2)

S*=2

N+=S // add normals to vertex count

// Face order
X = []
for(n=0;n<S;) X[n]=n++
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
//xxRENAME tx a
//xxRENAME ty b
//xxRENAME tz d

setInterval( function() {
    with (Math) {
        t = new Date().getTime()/S
        //console.log("t=" + t);
        I = sin(t)*2 // angle_x
        O = cos(t*.7)*2 // angle_y
        P = sin(t*.8)*2 // angle_z
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

        tx=[]
        ty=[]
        tz=[]

        for(n=0;n<N;n++) {
            //console.log("E=" + E);
            tz[n] = x[n]*(-A*D*E+B*F) + y[n]*(A*D*F+B*E) + z[n]*A*C
            tx[n] = x[n]*C*E - y[n]*C*F + z[n]*D
            ty[n] = x[n]*(B*D*E+A*F) - y[n]*(B*D*F-A*E) - z[n]*B*C

            if(n<N-S) {
                // divide by z+something for the real vertices (not for normals)
                tx[n] = tx[n]/(tz[n]+R)*q + q //silly offset
                ty[n] = ty[n]/(tz[n]+R)*q + q //silly offset
            }




            //tz[n] = x[n]*M8 + y[n]*M9 + z[n]*M10
            //tx[n] = (x[n]*M0 - y[n]*M1 + z[n]*M2)/(tz[n]+R)*q + q //silly offset
            //ty[n] = (x[n]*M4 + y[n]*M5 - z[n]*M6)/(tz[n++]+R)*q + q //silly offset
        }

        X.sort(function(a,b){return tz[v1[b]]-tz[v1[a]]})
        c.fillStyle = "#000000"
        c.fillRect(0,0,R,R)
        for(n=0;n<S;) {
            c.beginPath()
            t=X[n++]
            h=tz[N-S+t]*32|0 // |0 = round down to integer
            h=99+(h<0?-h:h)
            //if(v1[t]%(S/2)<18)h=h/4
            //h=t%0xFF
            c.fillStyle = "rgb("+h+","+h+",0)"
            //console.log(h)
            c.moveTo(tx[v1[t]], ty[v1[t]]) //, z[v1[n]])
            c.lineTo(tx[v2[t]], ty[v2[t]]) //, z[v2[n]])
            c.lineTo(tx[v3[t]], ty[v3[t]]) //, z[v3[n]])
            c.fill()
        }
    }
}, 9 );

