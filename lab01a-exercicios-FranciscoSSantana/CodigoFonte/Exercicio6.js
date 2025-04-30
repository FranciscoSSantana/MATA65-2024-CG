// Desenhando objetos gráficos 3D do Three.JS

import * as THREE from 'three';

import { GUI } from 'gui';

const 	gui 		= new GUI();
const 	rendSize 	= new THREE.Vector2();

var 	materialBasic,
		materialDepth,
		materialNormal,
		materialLambert;

var 	colorControl;

var 	controls, 
		scene,
		camera,
		renderer,
		curObj = null;

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

	var axis = new THREE.AxesHelper(0.8);
    axis.name = "eixos";
    scene.add(axis);

	const light = new THREE.PointLight(0xffffff, 3);
	light.position.set(-1, 1, 1);
	scene.add(light);

	materialBasic = new THREE.MeshBasicMaterial();
	materialDepth = new THREE.MeshDepthMaterial();
	materialNormal = new THREE.MeshNormalMaterial();
	materialLambert = new THREE.MeshLambertMaterial();

	var objMesh = new THREE.Mesh 	( 	new THREE.TetrahedronGeometry(), 
										materialBasic
									); 
	objMesh.name 	= "tetraedro";
	objMesh.visible = true;
	objMesh.rotateY(60.0 * Math.PI / 180.0); 
	objMesh.updateMatrix();
	scene.add( objMesh );

	curObj = objMesh;
	
	objMesh = new THREE.Mesh 	( 	new THREE.TorusGeometry(0.5, 0.3, 30, 30), 
									materialBasic
								); 
	objMesh.name 	= "toro";
	objMesh.visible = false;
	scene.add( objMesh );
	
	var objMesh = new THREE.Mesh 	( 	new THREE.TorusKnotGeometry(0.5, 0.2), 
										materialBasic
									); 
	objMesh.name 	= "TorusKnot";
	objMesh.visible = false;
	objMesh.rotateX(60.0 * Math.PI / 180.0); 
	objMesh.rotateY(30.0 * Math.PI / 180.0); 
	objMesh.updateMatrix();
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.CapsuleGeometry(0.30, 0.6, 10, 20), 
									materialBasic
								); 
	objMesh.name 	= "capsula";
	objMesh.visible = false;
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.OctahedronGeometry(0.30, 0), 
									materialBasic
								); 
	objMesh.name 	= "octaedro";
	objMesh.visible = false;
	objMesh.rotateY(60.0 * Math.PI / 180.0); 
	objMesh.updateMatrix();
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.BoxGeometry(0.5, 0.5, 0.5), 
									materialBasic
								); 
	objMesh.name 	= "caixa";
	objMesh.visible = false;
	objMesh.rotateY(45.0 * Math.PI / 180.0);
	objMesh.rotateZ(45.0 * Math.PI / 180.0);
	objMesh.updateMatrix();
	scene.add( objMesh );

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	var controls = 	{	Forma3D : "Tetraedro",
						Material: "Basic",
						cor: "ffffff",
						wireframe: false
					};

	gui.add( controls, 'Forma3D', [ 	"Tetraedro", 
										"Toro", 
										"TorusKnot",
										"Capsula",
										"Octaedro",
										"Caixa"] ).onChange(changeObj);
									
	gui.add (controls, 'Material', [	"Basic",
										"Depth",
										"Normal",
										"Lambert"]).onChange(changeMaterial);
	
	colorControl = gui.addColor(controls, 'cor').onChange(changeColor);
	
	gui.add(controls, 'wireframe').onChange(enableWireframe);
	gui.open();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function changeObj(val) { 

	switch (val) {
		case "Tetraedro"	: 	curObj = scene.getObjectByName("tetraedro");
								curObj.visible							 	= true;
								scene.getObjectByName("toro").visible 		= false;
								scene.getObjectByName("TorusKnot").visible 	= false;
								scene.getObjectByName("capsula").visible 	= false;
								scene.getObjectByName("octaedro").visible 	= false;
								scene.getObjectByName("caixa").visible 		= false;
								break;
		case "Toro"			:  	curObj = scene.getObjectByName("toro");
								curObj.visible							 	= true;
								scene.getObjectByName("tetraedro").visible 	= false;
								scene.getObjectByName("TorusKnot").visible 	= false;
								scene.getObjectByName("capsula").visible 	= false;
								scene.getObjectByName("octaedro").visible 	= false;
								scene.getObjectByName("caixa").visible 		= false;
								break;
		case "TorusKnot"	:  	curObj = scene.getObjectByName("TorusKnot");
								curObj.visible							 	= true;
								scene.getObjectByName("tetraedro").visible 	= false;
								scene.getObjectByName("toro").visible 		= false;
								scene.getObjectByName("capsula").visible 	= false;
								scene.getObjectByName("octaedro").visible 	= false;
								scene.getObjectByName("caixa").visible 		= false;
								break;
		case "Capsula"		:  	curObj = scene.getObjectByName("capsula");
								curObj.visible							 	= true;
								scene.getObjectByName("tetraedro").visible 	= false;
								scene.getObjectByName("TorusKnot").visible 	= false;
								scene.getObjectByName("toro").visible 		= false;
								scene.getObjectByName("octaedro").visible 	= false;
								scene.getObjectByName("caixa").visible 		= false;
								break;
		case "Octaedro"		:  	curObj = scene.getObjectByName("octaedro");
								curObj.visible							 	= true;
								scene.getObjectByName("tetraedro").visible 	= false;
								scene.getObjectByName("TorusKnot").visible 	= false;
								scene.getObjectByName("capsula").visible 	= false;
								scene.getObjectByName("toro").visible 		= false;
								scene.getObjectByName("caixa").visible 		= false;
								break;
		case "Caixa"		:  	curObj = scene.getObjectByName("caixa");
								curObj.visible							 	= true;
								scene.getObjectByName("tetraedro").visible 	= false;
								scene.getObjectByName("TorusKnot").visible 	= false;
								scene.getObjectByName("capsula").visible 	= false;
								scene.getObjectByName("octaedro").visible 	= false;
								scene.getObjectByName("toro").visible 		= false;
								break;
		}

	renderer.clear();
	renderer.render(scene, camera);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************
function changeMaterial(val) { 

	switch (val) {
		case "Basic"	    : 	scene.getObjectByName("tetraedro").material	=
								scene.getObjectByName("toro").material 		=
								scene.getObjectByName("TorusKnot").material =
								scene.getObjectByName("capsula").material 	=
								scene.getObjectByName("octaedro").material 	=
								scene.getObjectByName("caixa").material		= materialBasic;
								colorControl.enable();
								break;
		case "Depth"	    :  	scene.getObjectByName("tetraedro").material	=
								scene.getObjectByName("toro").material 		=
								scene.getObjectByName("TorusKnot").material =
								scene.getObjectByName("capsula").material 	=
								scene.getObjectByName("octaedro").material 	=
								scene.getObjectByName("caixa").material		= materialDepth;
								colorControl.disable();
								break;
		case "Normal"	    :  	scene.getObjectByName("tetraedro").material	=
								scene.getObjectByName("toro").material 		=
								scene.getObjectByName("TorusKnot").material =
								scene.getObjectByName("capsula").material 	=
								scene.getObjectByName("octaedro").material 	=
								scene.getObjectByName("caixa").material		= materialNormal;
								colorControl.disable();
								break;
		case "Lambert"		:  	scene.getObjectByName("tetraedro").material	=
								scene.getObjectByName("toro").material 		=
								scene.getObjectByName("TorusKnot").material =
								scene.getObjectByName("capsula").material 	=
								scene.getObjectByName("octaedro").material 	=
								scene.getObjectByName("caixa").material		= materialLambert;
								colorControl.enable();
								break;
		}

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeColor(value) {
	materialBasic.color.set(value);
	materialLambert.color.set(value);
	scene.getObjectByName("tetraedro").material.color.set(value);
	scene.getObjectByName("toro").material.color.set(value);
	scene.getObjectByName("TorusKnot").material.color.set(value);
	scene.getObjectByName("capsula").material.color.set(value);
	scene.getObjectByName("octaedro").material.color.set(value);
	scene.getObjectByName("caixa").material.color.set(value);

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function enableWireframe(value) {
	materialBasic.wireframe = value;
	materialDepth.wireframe = value;
	materialNormal.wireframe = value;
	materialLambert.wireframe = value;
	scene.getObjectByName("tetraedro").material.wireframe = value;
	scene.getObjectByName("toro").material.wireframe = value;
	scene.getObjectByName("TorusKnot").material.wireframe = value;
	scene.getObjectByName("capsula").material.wireframe = value;
	scene.getObjectByName("octaedro").material.wireframe = value;
	scene.getObjectByName("caixa").material.wireframe = value;


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
