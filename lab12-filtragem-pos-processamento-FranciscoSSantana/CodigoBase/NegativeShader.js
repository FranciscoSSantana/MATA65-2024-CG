const NegativeShader = {

	name: 'NegativeShader',

	uniforms: {

		'tDiffuse': { value: null }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 previousPassColor = texture2D( tDiffuse, vUv );

			gl_FragColor = vec4( 1.0-previousPassColor.x, 1.0-previousPassColor.y, 1.0-previousPassColor.z, previousPassColor.w );

		}`

};

export { NegativeShader };
