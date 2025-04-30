precision mediump float;

uniform float uTime;
uniform float uAmp;
uniform bool uDeformaX;
uniform bool uDeformaI;
uniform bool uDeformaC;
uniform bool uDeformaO;

varying vec3 vColor;

#define PI 3.141592653

#define TWIST_ANGLE 60.0
#define BEND_ANGLE 60.0
#define HEIGHT 217.8
#define MAX_X_X -110.814575195
#define MAX_X_Y 48.69998169
#define PIVOT_X_X -185.0
#define PIVOT_X_Y -24.45
#define PIVOT_X_Z 27.0
#define PIVOT_I_X -80.0
#define PIVOT_I_Y 0.0
#define PIVOT_I_Z 27.0
#define PIVOT_C_X 22.0
#define PIVOT_C_Y -29.5
#define PIVOT_C_Z 27.0
#define PIVOT_O_X 182.5
#define PIVOT_O_Z 27.0

vec4 tapper(vec4 pos) {
    vec4 new_pos;
    float distanceFromCenter = distance(vec2(PIVOT_X_X, PIVOT_X_Y),
                                        vec2(pos.x, pos.y));

    float maxDistance = distance(vec2(PIVOT_X_X, PIVOT_X_Y),
                                 vec2(MAX_X_X, MAX_X_Y));

    float amp = 0.4 + (0.4 * sin((PI/2.0)*uTime*4.1889));

    //amplitude maior conforme distância do centro aumenta
    amp = (amp * (max(0.0, distanceFromCenter - 12.0)/maxDistance))/1.5;
    
    //perna "\" do X
    if((pos.x <= PIVOT_X_X && pos.y >= PIVOT_X_Y) ||
       (pos.x > PIVOT_X_X && pos.y < PIVOT_X_Y))     {

        new_pos.x = pos.x - (pos.x - ((pos.y + 279.5)/-1.379127511)) * amp;
        new_pos.z = pos.z - (pos.z - (PIVOT_X_Z)) * amp;
    }

    //perna "/" do X
    else {
        new_pos.x = pos.x - (pos.x - ((pos.y - 230.6)/1.379127511)) * amp;
        new_pos.z = pos.z - (pos.z - (PIVOT_X_Z)) * amp;
    }
    
    new_pos.y = pos.y;
    new_pos.w = 1.0;

    return new_pos;
}

vec4 spring(vec4 pos) {
	vec4 new_pos;
    float amp = uAmp*((HEIGHT*0.5 + position.y)/HEIGHT*1.5);
	
    if(pos.y > -100.0) {
	    new_pos.y = pos.y + amp * sin(uTime*6.286);
    }
    else {
        new_pos.y = pos.y;
    }

    //efeito do "pingo do i" como um peso numa mola
    if(new_pos.y > pos.y) {
        if(pos.y > 60.0) {
	        new_pos.y = pos.y + amp * sin(uTime*6.286);
        }
        else {
            new_pos.y = pos.y;
        }
    }
    new_pos.z = pos.z;
	new_pos.x = pos.x;
    new_pos.w = pos.w;

    return new_pos;
}

vec4 bend(vec4 pos) {
    float angrad = BEND_ANGLE * (0.2 + sin(uTime * 6.286)) * (PI/180.0);
    float angle = (HEIGHT*0.5 + position.y)/(HEIGHT*0.5) * angrad;

    float x = PIVOT_C_X;
    float y = PIVOT_C_Y;
    float st = sin(angle);
	float ct = cos(angle);
	vec4 new_pos;
    
	new_pos.x = x + (pos.x - x)*ct - (pos.y - y)*st;
	new_pos.y = y + (pos.x - x)*st + (pos.y - y)*ct;
    
    new_pos.z = pos.z;
    new_pos.w = pos.w;

    return new_pos;
}

//baseado no livro ShaderX3 e no site 
//http://www.ozone3d.net/tutorials/mesh_deformer_p3.php 
vec4 twist(vec4 pos) {
    float angrad = TWIST_ANGLE * sin(uTime * 6.286) * (PI/180.0);
    float angle = (HEIGHT*0.5 + position.y)/(HEIGHT*0.5) * angrad;

    float x = PIVOT_O_X;
    float z = PIVOT_O_Z;
    float st = sin(angle);
	float ct = cos(angle);
	vec4 new_pos;
	
	new_pos.x = x + (pos.x - x)*ct - (pos.z - z)*st;
	new_pos.z = z + (pos.x - x)*st + (pos.z - z)*ct;
	
	new_pos.y = pos.y;
    new_pos.w = pos.w;

    return new_pos;
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //

void main(void) {
    vec4 tappPos, springPos, bendPos, twistPos;

    //cor em gradiente baseada na posição de z                       
    vColor = vec3(0.0, (0.0092592 * position.z) + 0.5, (0.00592592 * position.z) +0.32);

    //Deforma Letra "X"
    if(position.x >= -265.0 && position.x <= -110.0 && uDeformaX) {
        tappPos = tapper(vec4(position, 1.0));
        gl_Position = projectionMatrix * modelViewMatrix * tappPos;
    }

    //Deforma Letra "I"
    else if(position.x >= -110.0 && position.x <= -50.0 && uDeformaI) {
        springPos = spring(vec4(position, 1.0));
        gl_Position = projectionMatrix * modelViewMatrix * springPos;
    }
    
    //Deforma Letra "C"
    else if(position.x >= -50.0 && position.x <= 105.0 && uDeformaC) {
        bendPos = bend(vec4(position, 1.0));
        gl_Position = projectionMatrix * modelViewMatrix * bendPos;
    }

    //Deforma Letra "O"
    else if(position.x >=  105.0 && position.x <= 270.0 && uDeformaO) {
        twistPos = twist(vec4(position, 1.0));
        gl_Position = projectionMatrix * modelViewMatrix * twistPos;
    }
    
    //idle
    else {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
}

//x: -260 até -110
//i: -110 até -50
//c: -50  até +105
//o: +105 até +260