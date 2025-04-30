// Desenhando objetos gráficos 2D

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui 		= new GUI();
const 	rendSize 	= new THREE.Vector2();

var 	controls, 
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

	const vertices = [];

	vertices.push(	new THREE.Vector3( -0.5, -0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3(  0.5, -0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3(  0.5,  0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3( -0.5,  0.5, 0.0 ) );

	var geometry = new THREE.BufferGeometry().setFromPoints( vertices );
	
	var lineStrip = new THREE.Line( geometry );
	lineStrip.name = "linhaPoligonalAberta";
	scene.add( lineStrip );	

	var lineLoop = new THREE.LineLoop( geometry );
	lineLoop.name = "linhaPoligonalFechada";
	lineLoop.visible = false;
	scene.add( lineLoop );	

	var lineSegments = new THREE.LineSegments(geometry);
	lineSegments.name = "linhaSegment";
	lineSegments.visible = false;
	scene.add(lineSegments);

	renderer.clear();
	renderer.render(scene, camera);
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{	tipoDeLinha : "Line"
				};

	gui.add( controls, 'tipoDeLinha', [ "Line",
										"LineLoop",
									    "LineSegment" ]).onChange(changeLine);
	gui.open();
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeLine(value) {

	switch (value) {
		case "Line":
			scene.getObjectByName("linhaPoligonalAberta").visible = true;
			scene.getObjectByName("linhaPoligonalFechada").visible = false;
			scene.getObjectByName("linhaSegment").visible = false;
			break;
		
		case "LineLoop":
			scene.getObjectByName("linhaPoligonalAberta").visible = false;
			scene.getObjectByName("linhaPoligonalFechada").visible = true;
			scene.getObjectByName("linhaSegment").visible = false;
			break;
		
		case "LineSegment":
			scene.getObjectByName("linhaPoligonalAberta").visible = false;
			scene.getObjectByName("linhaPoligonalFechada").visible = false;
			scene.getObjectByName("linhaSegment").visible = true;
			break;
	}

	renderer.clear();
	renderer.render(scene, camera);	
}

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
// ******************************************************************** //
// ******************************************************************** //
main();
