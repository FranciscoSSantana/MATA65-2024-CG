// Monta o cenário para o uso do algoritmo de Ray Casting gerado no Frag Shader

import * as THREE from 'three';

const 	rendSize 	= new THREE.Vector2();

let 	scene,
		camera,
		renderer,
		shaderMat;

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	let maxDim = Math.min(window.innerWidth, window.innerHeight)

	rendSize.x =  
	rendSize.y =  maxDim * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -10.0, 10.0, 10.0, -10.0, -10.0, 10.0 );

    geraImagem();

	renderer.clear();
	renderer.render(scene, camera);    
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function geraImagem() {

	shaderMat = new THREE.ShaderMaterial( 	
					{ 	uniforms  		: 	{	uCamPos	: { type 	: "vec3" , 
															value  	: new THREE.Vector3(0.0, 0.0, 10.0) } 
											},
						vertexShader 	: document.getElementById('RayTracing_VS').textContent,
						fragmentShader 	: document.getElementById('RayTracing_FS').textContent,
						wireframe : false,
					} );

	let plane 	= new THREE.Mesh( 	new THREE.PlaneGeometry(20.0, 20.0, 1, 1),
									shaderMat );
	plane.name 	= "imagem";
	plane.position.z = 5.0;
	plane.updateMatrix();
	scene.add( plane );	
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

main();
