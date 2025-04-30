import {
	Vector2
} from 'three';

const SharpnessMaskShader = {

	name: 'SharpnessMaskShader',

	uniforms: {

		'tDiffuse': { value: null },
        'resolution': { value: new Vector2() },
        'k': { value: 1.0 },
        'canalDeCor': { value: 0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float k;
    uniform int canalDeCor;
    varying vec2 vUv;

    void main() {

        float tx0y0, tx0y1, tx0y2, tx1y0, tx1y1, tx1y2, tx2y0, tx2y1, tx2y2;
        vec4 x0y0, x0y1, x0y2, x1y0, x1y1, x1y2, x2y0, x2y1, x2y2;
        vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

    // kernel definition (in glsl matrices are filled in column-major order)

        const mat3 L = mat3( 8, 16, 8, 16, 32, 16, 8, 16, 8 );

    // fetch the 3x3 neighbourhood of a fragment

    // first column

        switch (canalDeCor) {
            case 0: //gray
            case 1: //red

                tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).r;
                tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).r;
                tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).r;

                tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).r;
                tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).r;
                tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).r;

                tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).r;
                tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).r;
                tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).r;
                break;
            
            case 2: //green

                tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).g;
                tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).g;
                tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).g;

                tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).g;
                tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).g;
                tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).g;

                tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).g;
                tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).g;
                tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).g;				
                break;
            
            case 3: //blue

                tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).b;
                tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).b;
                tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).b;

                tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).b;
                tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).b;
                tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).b;

                tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).b;
                tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).b;
                tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).b;
                break;

            case 4: //all colors
                x0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) );
                x0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) );
                x0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) );

                x1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) );
                x1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) );
                x1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) );

                x2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) );
                x2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) );
                x2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) );

                //aplica transformações em todos os canais (ver com mais detalhes abaixo, para os outros casos)

                float valueGR = (L[0][0] * x0y0.r + L[1][0] * x1y0.r + L[2][0] * x2y0.r +
                                L[0][1] * x0y1.r + L[1][1] * x1y1.r + L[2][1] * x2y1.r +
                                L[0][2] * x0y2.r + L[1][2] * x1y2.r + L[2][2] * x2y2.r)/128.0;

                float valueGG = (L[0][0] * x0y0.g + L[1][0] * x1y0.g + L[2][0] * x2y0.g +
                                L[0][1] * x0y1.g + L[1][1] * x1y1.g + L[2][1] * x2y1.g +
                                L[0][2] * x0y2.g + L[1][2] * x1y2.g + L[2][2] * x2y2.g)/128.0;
                
                float valueGB = (L[0][0] * x0y0.b + L[1][0] * x1y0.b + L[2][0] * x2y0.b +
                                L[0][1] * x0y1.b + L[1][1] * x1y1.b + L[2][1] * x2y1.b +
                                L[0][2] * x0y2.b + L[1][2] * x1y2.b + L[2][2] * x2y2.b)/128.0;
                
                float mascaraR = x1y1.r - valueGR; 
                float mascaraAplicadaR = x1y1.r + k * mascaraR; 

                float mascaraG = x1y1.g - valueGG; 
                float mascaraAplicadaG = x1y1.g + k * mascaraG; 
                
                float mascaraB = x1y1.b - valueGB; 
                float mascaraAplicadaB = x1y1.b + k * mascaraB; 

                gl_FragColor = vec4( vec3( mascaraAplicadaR, mascaraAplicadaG, mascaraAplicadaB ), 1 );
                return;
                break;
            default:
                break;
        }

    // suavizacao

        float valueg = (L[0][0] * tx0y0 + L[1][0] * tx1y0 + L[2][0] * tx2y0 +
                        L[0][1] * tx0y1 + L[1][1] * tx1y1 + L[2][1] * tx2y1 +
                        L[0][2] * tx0y2 + L[1][2] * tx1y2 + L[2][2] * tx2y2)/128.0;
        
    // criacao da mascara

        //valores ja estao no canal de cor correto, visto que foram setados no switch case
        float mascara = tx1y1 - valueg; 

    // aplicacao

        float mascaraAplicada = tx1y1 + k * mascara; 

        switch (canalDeCor) {
            case 0: //gray
                gl_FragColor = vec4( vec3( mascaraAplicada ), 1 );
                break;
            
            case 1: //red
                gl_FragColor = vec4( vec3( mascaraAplicada, 0.0, 0.0 ), 1 );
                break;

            case 2: //green
                gl_FragColor = vec4( vec3( 0.0, mascaraAplicada, 0.0 ), 1 );
                break;

            case 3: //blue
                gl_FragColor = vec4( vec3( 0.0, 0.0, mascaraAplicada ), 1 );
                break;

            default:
                break;
        }
    }`
};

export { SharpnessMaskShader };
