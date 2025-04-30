// Desenhando objetos gráficos 2D

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui 		= new GUI();
const 	rendSize 	= new THREE.Vector2();

var 	n, a, b;

const 	vertices = [];

var 	geometry,
		controls, 
		scene,
		camera,
		renderer;

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	window.addEventListener ( 'resize', onWindowResize 	);

	scene 	= new THREE.Scene();

	initGUI();

	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );

	for (let x = -1; x <= 1; x += 0.005) {
		var y = controls.b * ((1 - (Math.abs(x / controls.a) ** controls.n) ) ** (1/controls.n));
		vertices.push( new THREE.Vector3( x, y, 0.0 ) );
	}
	for (let x = 1; x >= -1; x -= 0.005) {
		var y = controls.b * ((1 - (Math.abs(x / controls.a) ** controls.n) ) ** (1/controls.n));		vertices.push( new THREE.Vector3( x, -1*y, 0.0 ) );
	}

	geometry = new THREE.BufferGeometry().setFromPoints( vertices );

	var lineElipse = new THREE.LineLoop( geometry );
	lineElipse.name = "linhaElipse";
	scene.add( lineElipse );	

	renderer.clear();
	renderer.render(scene, camera);
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{	n : 1,
					a : 1,
					b : 1
				};

	n = gui.add( controls, 'n', 0.001, 5).onChange(updateGeometry);

	a = gui.add( controls, 'a', 0.001, 3).onChange(updateGeometry);

	b = gui.add( controls, 'b', 0.001, 3).onChange(updateGeometry);

	gui.open();
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function onWindowResize() {

	let minDim = Math.min(window.innerWidth, window.innerHeight);

	renderer.setSize(minDim*0.8, minDim*0.8);

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function updateGeometry() {

	for(let i = 1; i < geometry.attributes.position.array.length; i += 3) {
		let x = geometry.attributes.position.array[i-1];
		if(i < geometry.attributes.position.array.length/2) {
			geometry.attributes.position.array[i] = controls.b * ((1 - (Math.abs(x / controls.a) ** controls.n) ) ** (1/controls.n));
		}
		else {
			geometry.attributes.position.array[i] = -1 * controls.b * ((1 - (Math.abs(x / controls.a) ** controls.n) ) ** (1/controls.n));
		}
	}
	geometry.attributes.position.needsUpdate = true;


	renderer.clear();
	renderer.render(scene, camera);	
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //
main();
