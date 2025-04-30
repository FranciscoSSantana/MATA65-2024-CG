import {
	Vector2
} from 'three';

/**
 * Sobel Edge Detection (see https://youtu.be/uihBwtPIBxM)
 *
 * As mentioned in the video the Sobel operator expects a grayscale image as input.
 *
 */

const SobelOneAxisShader = {

	name: 'SobelOneAxisShader',

	uniforms: {

		'tDiffuse': { value: null },
		'resolution': { value: new Vector2() },
        'gradientSelectedIsX': { value: true },
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
		uniform bool gradientSelectedIsX;
		uniform int canalDeCor;
		varying vec2 vUv;

		void main() {

			float tx0y0, tx0y1, tx0y2, tx1y0, tx1y1, tx1y2, tx2y0, tx2y1, tx2y2;
			vec4 x0y0, x0y1, x0y2, x1y0, x1y1, x1y2, x2y0, x2y1, x2y2;
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

		// kernel definition (in glsl matrices are filled in column-major order)

			const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
			const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kernel
		
    	// fetch the 3x3 neighbourhood of a fragment
		
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

					if(gradientSelectedIsX) {
						float valueGxR = Gx[0][0] * x0y0.r + Gx[1][0] * x1y0.r + Gx[2][0] * x2y0.r +
										 Gx[0][1] * x0y1.r + Gx[1][1] * x1y1.r + Gx[2][1] * x2y1.r +
										 Gx[0][2] * x0y2.r + Gx[1][2] * x1y2.r + Gx[2][2] * x2y2.r;
						
						float valueGxG = Gx[0][0] * x0y0.g + Gx[1][0] * x1y0.g + Gx[2][0] * x2y0.g +
										 Gx[0][1] * x0y1.g + Gx[1][1] * x1y1.g + Gx[2][1] * x2y1.g +
										 Gx[0][2] * x0y2.g + Gx[1][2] * x1y2.g + Gx[2][2] * x2y2.g;
						
						float valueGxB = Gx[0][0] * x0y0.b + Gx[1][0] * x1y0.b + Gx[2][0] * x2y0.b +
										 Gx[0][1] * x0y1.b + Gx[1][1] * x1y1.b + Gx[2][1] * x2y1.b +
										 Gx[0][2] * x0y2.b + Gx[1][2] * x1y2.b + Gx[2][2] * x2y2.b;
		
						gl_FragColor = vec4( vec3( valueGxR, valueGxG, valueGxB ), 1 );
						return;
					}
					else {
						float valueGyR = Gy[0][0] * x0y0.r + Gy[1][0] * x1y0.r + Gy[2][0] * x2y0.r +
										 Gy[0][1] * x0y1.r + Gy[1][1] * x1y1.r + Gy[2][1] * x2y1.r +
										 Gy[0][2] * x0y2.r + Gy[1][2] * x1y2.r + Gy[2][2] * x2y2.r;
						
						float valueGyG = Gy[0][0] * x0y0.g + Gy[1][0] * x1y0.g + Gy[2][0] * x2y0.g +
										 Gy[0][1] * x0y1.g + Gy[1][1] * x1y1.g + Gy[2][1] * x2y1.g +
										 Gy[0][2] * x0y2.g + Gy[1][2] * x1y2.g + Gy[2][2] * x2y2.g;
						
						float valueGyB = Gy[0][0] * x0y0.b + Gy[1][0] * x1y0.b + Gy[2][0] * x2y0.b +
										 Gy[0][1] * x0y1.b + Gy[1][1] * x1y1.b + Gy[2][1] * x2y1.b +
										 Gy[0][2] * x0y2.b + Gy[1][2] * x1y2.b + Gy[2][2] * x2y2.b;
		
						gl_FragColor = vec4( vec3( valueGyR, valueGyG, valueGyB ), 1 );
						return;
					}

					break;
				default:
					break;
			}

		// gradient value in x direction

            if(gradientSelectedIsX) {
                float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
								Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
								Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

                gl_FragColor = vec4( vec3( valueGx ), 1 );
            }

		// gradient value in y direction
            else {
                float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
								Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
								Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;
                
                gl_FragColor = vec4( vec3( valueGy ), 1 );
            }
		}`

};

export { SobelOneAxisShader };
