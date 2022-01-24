import React from 'react'
import { ArToolkitProfile, ArToolkitSource, ArToolkitContext, ArMarkerControls} from 'arjs/three.js/build/ar-threex.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class ThreexComp extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 'compass': 0 };
	}

    componentDidMount() {
		console.log("three:::props:::",this.props);

        ArToolkitContext.baseURL = './'
        // init renderer
	    var renderer	= new THREE.WebGLRenderer({
		    antialias	: true,
		    alpha: true
	    });
	    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	    // renderer.setPixelRatio( 2 );
	    renderer.setSize( window.innerWidth, window.innerHeight );
	    renderer.domElement.style.position = 'absolute'
	    renderer.domElement.style.top = '0px'
	    renderer.domElement.style.left = '0px'
	    document.body.appendChild( renderer.domElement );

	    // array of functions for the rendering loop
	    var onRenderFcts= [];

	    // init scene and camera
	    var scene	= new THREE.Scene();

	    //////////////////////////////////////////////////////////////////////////////////
	    //		Initialize a basic camera
	    //////////////////////////////////////////////////////////////////////////////////

	    // Create a camera
	    var camera = new THREE.Camera();
	    scene.add(camera);
        const artoolkitProfile = new ArToolkitProfile()
	    artoolkitProfile.sourceWebcam()

	    const arToolkitSource = new ArToolkitSource(artoolkitProfile.sourceParameters)

        arToolkitSource.init(function onReady(){
		    onResize()
	    })

	    // handle resize
	    window.addEventListener('resize', function(){
		    onResize()
	    })
	    function onResize(){
		    arToolkitSource.onResizeElement()
		    arToolkitSource.copyElementSizeTo(renderer.domElement)
		    if( arToolkitContext.arController !== null ){
			    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
		    }
	    }

        ////////////////////////////////////////////////////////////////////////////////
	    //          initialize arToolkitContext
	    ////////////////////////////////////////////////////////////////////////////////

	    // create atToolkitContext
	    var arToolkitContext = new ArToolkitContext({
            cameraParametersUrl: ArToolkitContext.baseURL + '../../data/camera_para.dat',
            detectionMode: 'mono',
        })
    
	    // initialize it
	    arToolkitContext.init(function onCompleted(){
		    // copy projection matrix to camera
		    camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	    })

	    // update artoolkit on every frame
	    onRenderFcts.push(function(){
		    if( arToolkitSource.ready === false )	return

		    arToolkitContext.update( arToolkitSource.domElement )
	    })


        ////////////////////////////////////////////////////////////////////////////////
	    //          Create a ArMarkerControls
	    ////////////////////////////////////////////////////////////////////////////////

	    var markerGroup = new THREE.Group()
	    scene.add(markerGroup)

	    var markerControls = new ArMarkerControls(arToolkitContext, markerGroup, {
		    type : 'pattern',
		    patternUrl : ArToolkitContext.baseURL + '../../data/patt.hiro',
	    })

	    //////////////////////////////////////////////////////////////////////////////////
	    //		add an object in the scene
	    //////////////////////////////////////////////////////////////////////////////////

	    var markerScene = new THREE.Scene()
	    markerGroup.add(markerScene)

		const loader = new GLTFLoader();
		var model;
		
		loader.load( '../../data/arrow/scene.gltf', ( gltf ) => {
			gltf.scene.scale.set(0.5,1,1);
			model = gltf.scene;
			if(model){
				model.rotation.x = -1.2;
				// model.rotation.y = 1.57;
				model.rotation.y = 1.57-(this.props.angle)/57.29578;
			}
			markerScene.add( model );
		}, function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		}, function ( error ) {
			console.error( error );
		} );


        //////////////////////////////////////////////////////////////////////////////////
	    //		render the whole thing on the page
	    //////////////////////////////////////////////////////////////////////////////////
	    onRenderFcts.push(()=>{
		    renderer.render( scene, camera );
	    })


        // run the rendering loop
	    var lastTimeMsec= null
	    requestAnimationFrame(function animate(nowMsec){
		    // keep looping
		    requestAnimationFrame( animate );
		    // measure time
		    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		    var deltaMsec	= Math.min(1000, nowMsec - lastTimeMsec)
		    lastTimeMsec	= nowMsec
		    // call each update function
		    onRenderFcts.forEach(function(onRenderFct){
			    onRenderFct(deltaMsec/100, nowMsec/100)
		    })
	    })
    }
	

    render() {
		console.log(this.state);
        return (
        <div 
			style={{ width: "800px", height: "800px" }}
            ref={mount => { this.mount = mount}}
        />
        )
    }       
}