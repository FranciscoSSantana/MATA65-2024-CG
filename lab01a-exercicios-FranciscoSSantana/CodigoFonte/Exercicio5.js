// Desenhando objetos gráficos 3D do Three.JS

import * as THREE from 'three';

import { GUI } from 'gui';

const 	gui 		= new GUI();
const 	rendSize 	= new THREE.Vector2();

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


	var objMesh = new THREE.Mesh 	( 	new THREE.TetrahedronGeometry(), 
										new THREE.MeshBasicMaterial({color:0xffff00, wireframe:true })
									); 
	objMesh.name 	= "tetraedro";
	objMesh.visible = true;
	objMesh.rotateY(60.0 * Math.PI / 180.0); 
	objMesh.updateMatrix();
	scene.add( objMesh );

	curObj = objMesh;
	
	objMesh = new THREE.Mesh 	( 	new THREE.TorusGeometry(0.5, 0.3, 30, 30), 
									new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:false })
								); 
	objMesh.name 	= "toro";
	objMesh.visible = false;
	scene.add( objMesh );
	
	var objMesh = new THREE.Mesh 	( 	new THREE.TorusKnotGeometry(0.5, 0.2), 
										new THREE.MeshBasicMaterial({color:0x0000ff, wireframe:true })
									); 
	objMesh.name 	= "TorusKnot";
	objMesh.visible = false;
	objMesh.rotateX(60.0 * Math.PI / 180.0); 
	objMesh.rotateY(30.0 * Math.PI / 180.0); 
	objMesh.updateMatrix();
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.CapsuleGeometry(0.30, 0.6, 10, 20), 
									new THREE.MeshBasicMaterial({color:0xffa500, wireframe:false })
								); 
	objMesh.name 	= "capsula";
	objMesh.visible = false;
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.OctahedronGeometry(0.30, 0), 
									new THREE.MeshBasicMaterial({color:0x800080, wireframe:true })
								); 
	objMesh.name 	= "octaedro";
	objMesh.visible = false;
	objMesh.rotateY(60.0 * Math.PI / 180.0); 
	objMesh.updateMatrix();
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.BoxGeometry(0.5, 0.5, 0.5), 
									new THREE.MeshBasicMaterial({color:0x40e0d0, wireframe:true })
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

	var controls = 	{	Forma3D : "Tetraedro"
					};

	gui.add( controls, 'Forma3D', [ 	"Tetraedro", 
										"Toro", 
										"TorusKnot",
										"Capsula",
										"Octaedro",
										"Caixa"] ).onChange(changeObj);
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
