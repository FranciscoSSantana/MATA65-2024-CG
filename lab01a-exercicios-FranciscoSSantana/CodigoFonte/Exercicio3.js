// Desenhando objetos gráficos 2D

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui 		= new GUI();
const 	rendSize 	= new THREE.Vector2();

var 	isDashed, scl, dS, gS;

var 	materialBasic,
		materialDashed,
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

	const vertices = [];

	vertices.push(	new THREE.Vector3( -0.5, -0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3(  0.5, -0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3(  0.5,  0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3( -0.5,  0.5, 0.0 ) );

	var geometry = new THREE.BufferGeometry().setFromPoints( vertices );
	materialBasic = new THREE.LineBasicMaterial();
	materialDashed = new THREE.LineDashedMaterial({
		scale: 1.5,
		dashSize: 0.3,
		gapSize: 0.15
	});
	
	
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

	controls = 	{	tipoDeLinha : "Line",
					dashed 		: false,
					cor 		: 'FFFFFF',
					grossura	: 1,
					dashSize	: 0.3,
					gapSize		: 0.15,
					scale		: 1.5
				};

	gui.add( controls, 'tipoDeLinha', [ "Line",
										"LineLoop",
									    "LineSegment" ]).onChange(changeLine);
	
	isDashed = gui.add( controls, 'dashed').onChange(changeDash);
									
	gui.addColor( controls, 'cor' ).onChange(changeColor);

	gui.add( controls, 'grossura', 0, 5).onChange(changeWidth);

	dS = gui.add( controls, 'dashSize', 0, 1).onChange(changeDashSize);
	dS.disable();

	gS = gui.add( controls, 'gapSize', 0, 1).onChange(changeGapSize);
	gS.disable();

	scl = gui.add( controls, 'scale', 0, 2).onChange(changeScale);
	scl.disable();

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
function changeDash(value) {
	if(value) {
		scene.getObjectByName("linhaPoligonalAberta").material = materialDashed;
		scene.getObjectByName("linhaPoligonalFechada").material = materialDashed;
		scene.getObjectByName("linhaSegment").material = materialDashed;
		scene.getObjectByName("linhaPoligonalAberta").computeLineDistances();
		scene.getObjectByName("linhaPoligonalFechada").computeLineDistances();
		scene.getObjectByName("linhaSegment").computeLineDistances();
		dS.enable();
		gS.enable();
		scl.enable();
	}
	if(!value) {
		scene.getObjectByName("linhaPoligonalAberta").material = materialBasic;
		scene.getObjectByName("linhaPoligonalFechada").material = materialBasic;
		scene.getObjectByName("linhaSegment").material = materialBasic;
		dS.disable();
		gS.disable();
		scl.disable();
	}

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeColor(value) {

	materialBasic.color.set(value);
	materialDashed.color.set(value);
	if(isDashed.getValue()) {
		scene.getObjectByName("linhaPoligonalAberta").material = materialDashed;
		scene.getObjectByName("linhaPoligonalFechada").material = materialDashed;
		scene.getObjectByName("linhaSegment").material = materialDashed;
	}
	else {
		scene.getObjectByName("linhaPoligonalAberta").material = materialBasic;
		scene.getObjectByName("linhaPoligonalFechada").material = materialBasic;
		scene.getObjectByName("linhaSegment").material = materialBasic;
	}

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeWidth(value) {
	scene.getObjectByName("linhaPoligonalAberta").material.linewidth = value;
	scene.getObjectByName("linhaPoligonalFechada").material.linewidth = value;
	scene.getObjectByName("linhaSegment").material.linewidth = value;

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeDashSize(value) {
	materialDashed.dashSize = value;
	scene.getObjectByName("linhaPoligonalAberta").material = materialDashed;
	scene.getObjectByName("linhaPoligonalFechada").material = materialDashed;
	scene.getObjectByName("linhaSegment").material = materialDashed;

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeGapSize(value) {
	materialDashed.gapSize = value;
	scene.getObjectByName("linhaPoligonalAberta").material = materialDashed;
	scene.getObjectByName("linhaPoligonalFechada").material = materialDashed;
	scene.getObjectByName("linhaSegment").material = materialDashed;

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeScale(value) {
	materialDashed.scale = value;
	scene.getObjectByName("linhaPoligonalAberta").material = materialDashed;
	scene.getObjectByName("linhaPoligonalFechada").material = materialDashed;
	scene.getObjectByName("linhaSegment").material = materialDashed;

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
