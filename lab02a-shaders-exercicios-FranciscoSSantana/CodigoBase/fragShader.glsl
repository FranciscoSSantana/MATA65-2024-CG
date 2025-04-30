#ifdef GL_ES
    precision mediump float;
#endif

varying vec2 vXY;

uniform float uTime;
uniform vec2 uDim;

void main () {

  float distancia = sqrt(pow(0.0 - vXY.x, 2.0) + pow(0.0 - vXY.y, 2.0));

  gl_FragColor = vec4(distancia, 0.0, 0.0, 1.0);;

  }