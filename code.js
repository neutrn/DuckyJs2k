
// The silly //RENAME comments can be used to shorten variable or function
// names in preprocessing

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

    // Calculate face normal using cross product and normalize
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

//RENAME orig_num_faces L
orig_num_faces = N = getByte();
//console.log('npoints(N): ' + N)

// Vertex data
// Normals are appended to the same array when reading face data
x = [];
y = [];
z = [];

q = 255;
w = 128;

// Read vertex data, xxx..., yyy..., zzz... format
// Add mirrored vertices while at it
for(n=N;n--;)x[n]=getByte()/3-84,x[n+N]=-x[n];
for(n=N;n--;)y[n]=y[n+N]=getByte()-w;
for(n=N;n--;)z[n]=z[n+N]=getByte()*2-q;

N*=2;

// Face data (i.e. vertex indices)
v1 = [];
v2 = [];
v3 = [];

// Read list of non-stripped faces. Three vertex indices per face
S=getByte();
for(n=S;n--;) pushFace(getByte(),getByte(),getByte());

// Read triangle strips
T = getByte();
for(n=T;n--;) {
    // Read strip length
    U = getByte();
    pushFace(getByte(),getByte(),getByte());
    S++;
    for (m=3;m++<U;S++)
        pushFace(v2[v2.length-1], v3[v3.length-1], getByte())
}

// Add mirrored faces
for(n=S;n--;) pushFace(v1[n]+N/2, v2[n]+N/2, v3[n]+N/2);

S*=2; // add mirrored faces to face count

N+=S; // add normals to vertex count

// Face order
X = [];
for(n=S;n--;) X[n]=n;

// Render function
setInterval( function() { with(Math) {
    t = new Date().getTime()/999;

    // Rotation angles based on current time
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
        // 3D rotation
        tz[n] = x[n]*(B*F-A*D*E) + y[n]*(A*D*F+B*E) + z[n]*A*C;
        tx[n] = x[n]*C*E - y[n]*C*F + z[n]*D;
        ty[n] = x[n]*(B*D*E+A*F) - y[n]*(B*D*F-A*E) - z[n]*B*C;

        if(n<=N-S)
            // Perspective projection: divide by z+something for
            // the real vertices (not for normals)
            tx[n]/=tz[n]/q+3,
            ty[n]/=tz[n]/q+3;

        //tz[n] = x[n]*M8 + y[n]*M9 + z[n]*M10
        //tx[n] = (x[n]*M0 - y[n]*M1 + z[n]*M2)/(tz[n]+R)*q + q //silly offset
        //ty[n] = (x[n]*M4 + y[n]*M5 - z[n]*M6)/(tz[n++]+R)*q + q //silly offset
    }

    // Sort using the sum of z coords to each vertex in face
    X.sort(function(t,n){return tz[v1[t]]-tz[v1[n]]+tz[v2[t]]-tz[v2[n]]+tz[v3[t]]-tz[v3[n]]});

    // Clear background
    c.fillStyle = 'rgb(0,0,0)';
    c.fillRect(0,0,R,R);

    // Render each face
    for(n=S;n--;){
        t=X[n];
        h=tx[N-S+t]+ty[N-S+t]-tz[N-S+t];
        h=h*h*h;
        h=99+(h<0?-h:h)*4;
        // If the face includes any of the first 17 vertices, it's part of the eye
        A=h/8;
        if(v1[t]%orig_num_faces<17)h=h/6,A=h;
        c.fillStyle = 'rgb('+(h|0)+','+(h|0)+','+(A|0)+')'; // |0 = round down to integer

        // Fill face
        c.beginPath();
        c.moveTo(tx[v1[t]]+q, ty[v1[t]]+q);
        c.lineTo(tx[v2[t]]+q, ty[v2[t]]+q);
        c.lineTo(tx[v3[t]]+q, ty[v3[t]]+q);
        c.fill()
    } }
}, 9 )

