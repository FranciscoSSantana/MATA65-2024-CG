//Animando uma production logo

import * as THREE from 'three';
import {TextGeometry} from 'textGeometry';
import {FontLoader} from 'fontLoader';

const 	rendSize 	= new THREE.Vector2();

let     scene,
        camera,
        camera2,
        cameraHelper,
        renderer,
        uniforms,
        shaderMat;

let     loopStartTime,
        animationStartTime,
        jumping = false,
        y_speed = 60,
        gravity = -2;

var logo = undefined,
    curve = undefined,
    trajetoria = undefined,
    foco1 = new THREE.Vector3(0.0, 0.0, 0.0),
    foco2 = new THREE.Vector3(250.0, 0.0, 0.0),
    foco3 = new THREE.Vector3(-100.0, -50.0, 0.0);

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
async function main() {

    const vsh = await fetch('./vertShader.glsl');
	const fsh = await fetch('./fragShader.glsl');

    renderer = new THREE.WebGLRenderer();

    renderer.autoClear = false;

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70.0, rendSize.x / rendSize.y, 0.01, 1200.0 );
	camera.position.y = 0.0;
	camera.position.z = 490.0;
	camera.updateProjectionMatrix();
    scene.add(camera);

    cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);

    camera2 = new THREE.PerspectiveCamera( 70.0, rendSize.x / rendSize.y, 0.01, 2000.0 );
	camera2.position.x = 800.0;
    camera2.position.y = 800.0;
	camera2.position.z = 800.0;
    camera2.lookAt(0, 0, 0);
	camera2.updateProjectionMatrix();

    //Cria trajetória da câmera a partir de pontos de controle
    curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0,    0,    550 ),
	new THREE.Vector3( -600, 200,    50 ),
    new THREE.Vector3( -300, 400,    -20 ),
    new THREE.Vector3( -40, 550,    -240 ),
	new THREE.Vector3( 0,    70,    -490 ),
    new THREE.Vector3( 90,    -100,    -920 ),
	new THREE.Vector3( 520,    -240,  0 )
    ], true );

    uniforms = { uTime   :  { type: "f",    value: 0.0},
                 uAmp    :  { type: "f",    value: 50.0},
                 uDeformaX: { type: "bool", value: false},
                 uDeformaI: { type: "bool", value: false},
                 uDeformaC: { type: "bool", value: false},
                 uDeformaO: { type: "bool", value: false} };

    shaderMat = new THREE.ShaderMaterial(	{ 	uniforms,
                                                vertexShader 	: await vsh.text(),
                                                fragmentShader 	: await fsh.text(),
                                                wireframe		: false,
                                            } );

    renderer.clear();
    renderer.render(scene, camera);

    generateLogo();
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function generateLogo() {
    logo = new THREE.Group();

    let text = "xico";

    const loader = new FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( newFont ) {

	    const fontOptions = {
            font: newFont,

            size: 200,
            curveSegments: 80,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true
        }

        const letras = Array.from(text);

        letras.forEach((letra, j) => {
            const textGeo = new TextGeometry(letra, fontOptions);

            //set posição de cada letra
            switch (j) {
                case 0:
                    textGeo.translate(-258.32223510742, -108.9, 2.0);
                    break;
                case 1:
                    textGeo.translate(-100.0, -108.9, 2.0);
                    break;
                case 2:
                    textGeo.translate(-45.0, -108.9, 2.0);
                    break;
                case 3:
                    textGeo.translate(115.0, -108.9, 2.0);
                    break;
                default:
                    break;
            }

            const textMesh = new THREE.Mesh(textGeo, shaderMat);

            textMesh.name = j;

            logo.add(textMesh);
        });

        logo.name = "prodLogo";
        logo.visible = true;
        scene.add(logo);
        renderer.clear();
        renderer.render(scene, camera);
        loopStartTime = null;
        requestAnimationFrame(anime);
    } );
}

function updateCamera(tempo) {
    const ponto = (tempo % 14)/14.0;
    const pos = curve.getPointAt(ponto);
    camera.position.copy(pos);

    //alterna o foco (lookAt) da câmera suavemente entre 3 pontos,
    //foco1 foco2 e foco3
    if(tempo <= 4.66666) {
        let foco = new THREE.Vector3();
        camera.lookAt(foco.lerpVectors(foco1, foco2, tempo/4.66666));
    }
    else if(tempo > 4.66666 && tempo <= 9.33333) {
        let foco = new THREE.Vector3();
        camera.lookAt(foco.lerpVectors(foco2, foco3, (tempo-4.66666)/4.66666));
    }
    else if(tempo > 9.33333 && tempo <= 14.0) {
        let foco = new THREE.Vector3();
        camera.lookAt(foco.lerpVectors(foco3, foco1, (tempo-9.33333)/4.66666));
    }

    camera.updateProjectionMatrix();
}

function animationLoop(tempo) {

    //movimento do X para frente
    if(tempo > 0.5 && tempo < 1.0 && logo.children[0].position.z < 50.0) {
        logo.children[0].translateZ(1.0);
    }
    //deformação do X
    if(tempo > 1.0 && logo.children[0].position.z == 50.0) {
        if(uniforms.uDeformaX.value)
            uniforms.uTime.value = tempo - animationStartTime;
        else {
            uniforms.uDeformaX.value = true;
            animationStartTime = tempo;
            uniforms.uTime.value = tempo - animationStartTime;
        }
    }

    //movimento do I para frente, retorno da posição e fim da deformação do X
    if(tempo > 2.5 && tempo < 3.0 && logo.children[1].position.z < 50.0) {
        uniforms.uDeformaX.value = false;
        logo.children[0].translateZ(-1.0);
        logo.children[1].translateZ(1.0);
    }
    //deformação do I
    if(tempo > 3.0 && logo.children[1].position.z == 50.0) {
        if(uniforms.uDeformaI.value)
            uniforms.uTime.value = tempo - animationStartTime;
        else {
            uniforms.uDeformaI.value = true;
            animationStartTime = tempo;
            uniforms.uTime.value = tempo - animationStartTime;
        }
    }

    //movimento do C para frente, retorno da posição e fim da deformação do I
    if(tempo > 4.5 && tempo < 5.0 && logo.children[2].position.z < 50.0) {
        uniforms.uDeformaI.value = false;
        logo.children[1].translateZ(-1.0);
        logo.children[2].translateZ(1.0);
    }
    //deformação do C
    if(tempo > 5.0 && logo.children[2].position.z == 50.0) {
        if(uniforms.uDeformaC.value)
            uniforms.uTime.value = tempo - animationStartTime;
        else {
            uniforms.uDeformaC.value = true;
            animationStartTime = tempo;
            uniforms.uTime.value = tempo - animationStartTime;
        }
    }

    //movimento do O para frente, retorno da posição e fim da deformação do C
    if(tempo > 6.5 && tempo < 7.0 && logo.children[3].position.z < 50.0) {
        uniforms.uDeformaC.value = false;
        logo.children[2].translateZ(-1.0);
        logo.children[3].translateZ(1.0);
    }
    //deformação do O
    if(tempo > 7.0 && logo.children[3].position.z == 50.0) {
        if(uniforms.uDeformaO.value)
            uniforms.uTime.value = tempo - animationStartTime;
        else {
            uniforms.uDeformaO.value = true;
            animationStartTime = tempo;
            uniforms.uTime.value = tempo - animationStartTime;
        }
    }

    //retorno da posição e fim da deformação do O
    if(tempo > 8.5 && tempo < 9.0 && logo.children[3].position.z > 0.0) {
        uniforms.uDeformaO.value = false;
        logo.children[3].translateZ(-1.0);
    }   

    //"pulo" da production logo em conjunto
    if(tempo > 9.0 && tempo < 9.5) {
        if(tempo < 9.15)
            jumping = true;
        if(jumping) {
            logo.translateY(y_speed/10.0);
            y_speed += gravity;
            if(y_speed < -60) {
                jumping = false;
                y_speed = 60;
            }
        }
    }

    //deformação de todas as letras ao fim do pulo
    if(tempo > 9.37 && tempo < 13.87) {
        if(uniforms.uDeformaX.value)
            uniforms.uTime.value = tempo - animationStartTime;
        else {
            uniforms.uDeformaX.value = true;
            uniforms.uDeformaI.value = true;
            uniforms.uDeformaC.value = true;
            uniforms.uDeformaO.value = true;
            animationStartTime = tempo;
            uniforms.uTime.value = tempo - animationStartTime;
        }
    }

    //fim da deformação de todas as letras 
    if(tempo > 13.87) {
        uniforms.uDeformaX.value = false;
        uniforms.uDeformaI.value = false;
        uniforms.uDeformaC.value = false;
        uniforms.uDeformaO.value = false;
    }
}

function renderPiP() {
    renderer.clear(true, true);

	renderer.setViewport(0.0, 0.0, rendSize.x, rendSize.y);
	camera.updateProjectionMatrix();
	cameraHelper.visible = false;
	cameraHelper.update();
	renderer.render( scene, camera );

    renderer.clearDepth();
	renderer.setViewport(rendSize.x / 2.0, 0.0, rendSize.x/2.0, rendSize.y/2.0);
	cameraHelper.visible = true;
	camera2.updateProjectionMatrix();
	cameraHelper.update();
	renderer.render( scene, camera2 );
}

function anime(t) {
    t *= 0.001;
    if(!loopStartTime)
        loopStartTime = t;
    requestAnimationFrame(anime);

    //tempo dentro do loop
    const tempo = t - loopStartTime;
    uniforms.uTime.value = tempo;

    updateCamera(tempo);

    animationLoop(tempo);

    //restartLoop
    if(tempo >= 14) {
        loopStartTime = t;
    }
    
    renderPiP();
}

main();