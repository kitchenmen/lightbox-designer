const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');

const scene = new THREE.Scene();
let camera;
const renderer = new THREE.WebGLRenderer({antialias: true});

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

module.exports = {
  scene: (selector) => {
    const container = document.querySelector(selector);
    const bbox = container.getBoundingClientRect();
    camera = new THREE.PerspectiveCamera( 75, bbox.width / bbox.height, 0.1, 1000 );
    renderer.setSize( bbox.width, bbox.height );
    container.appendChild( renderer.domElement );
    renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor( 0x000000, 1 );
		var orbit = new OrbitControls( camera, renderer.domElement );
		// orbit.enableZoom = false;

		var lights = [];
		lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

		lights[ 0 ].position.set( 0, 200, 0 );
		lights[ 1 ].position.set( 100, 200, 100 );
		lights[ 2 ].position.set( - 100, - 200, - 100 );

		scene.add( lights[ 0 ] );
		scene.add( lights[ 1 ] );
		scene.add( lights[ 2 ] );

    // Create a 2D triangular shape
    // The Shape() class has methods for drawing a 2D shape
    var triangleShape = new THREE.Shape();
    triangleShape.moveTo(-2, -2);
    triangleShape.lineTo(0, 2);
    triangleShape.lineTo(2, -2);
    triangleShape.lineTo(-2, -2);

    // Create a new geometry by extruding the triangleShape
    // The option: 'amount' is how far to extrude, 'bevelEnabled: false' prevents beveling
    var extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: 1, bevelEnabled: false});

    // Geometry doesn't do much on its own, we need to create a Mesh from it
    var material1 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    var material2 = new THREE.MeshPhongMaterial({color: 0xff0000});
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    window.extrudedMesh = new THREE.Mesh(extrudedGeometry, material1);
    window.cube = new THREE.Mesh( geometry, material2 );

    scene.add(extrudedMesh);
    scene.add(cube);
    animate();

    camera.position.z = 5;

  }
}
