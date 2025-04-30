const BrightnessShader = {

	name: 'BrightnessShader',

	uniforms: {

		'tDiffuse': 	{ value: null },
		'brightness': 	{ value: 1.0},
		'canalDeCor': 	{ value: 0}

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		#include <common>

		uniform sampler2D tDiffuse;

		uniform float brightness;

		uniform int canalDeCor;

		varying vec2 vUv;

		void main() {

			vec4 previousPassColor = texture2D( tDiffuse, vUv );

			mat4 brightnessMat = mat4 (1, 0, 0, brightness,
									   0, 1, 0, brightness,
									   0, 0, 1, brightness,
									   0, 0, 0, 1);
			
			switch (canalDeCor) {
				case 0: //gray
					gl_FragColor = vec4( previousPassColor.r * brightness, 
										 previousPassColor.g * brightness, 
										 previousPassColor.b * brightness, previousPassColor.w );
					break;

				case 1: //red
					gl_FragColor = vec4( previousPassColor.r * brightness, 0.0, 0.0, previousPassColor.w );
					break;
				
				case 2: //green
					gl_FragColor = vec4( 0.0, previousPassColor.g * brightness, 0.0, previousPassColor.w );
					break;
				
				case 3: //blue
					gl_FragColor = vec4( 0.0, 0.0, previousPassColor.b * brightness, previousPassColor.w );
					break;
				
				case 4: //all colors
					gl_FragColor = vec4( previousPassColor.r * brightness, 
										 previousPassColor.g * brightness, 
										 previousPassColor.b * brightness, previousPassColor.w );
					break;
				default:
					break;
			}

		}`

};

export { BrightnessShader };
