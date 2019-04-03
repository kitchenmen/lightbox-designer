const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const _ = require('lodash');
require('three-svg-loader')(THREE);

const scene = new THREE.Scene();
let camera, controls;
const renderer = new THREE.WebGLRenderer({antialias: true});
const loader = new THREE.SVGLoader();

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

const loadLayer = (filename, depth=0) => {
  loader.load(filename, (paths) => {
    var group = new THREE.Group();

    for ( var i = 0; i < paths.length; i ++ ) {

        var path = paths[ i ];

// var material2 = new THREE.MeshPhongMaterial({color: 0xff0000});
        var material = new THREE.MeshPhongMaterial( {
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false
        } );

        var shapes = path.toShapes( true );

        for ( var j = 0; j < shapes.length; j ++ ) {

          var shape = shapes[ j ];
          var geometry = new THREE.ShapeBufferGeometry( shape );
          var extrudedGeometry = new THREE.ExtrudeGeometry(shape, {amount: 0.1, bevelEnabled: false});
          var mesh = new THREE.Mesh( extrudedGeometry, material );
          group.add( mesh );

        }

      }
      // group.up.set(0.0, 0.0, -1.0);
      // group.rotation.z = 90 * Math.PI/180;
      // group.rotation.x = -90 * Math.PI/180;
      group.scale.y = -1;
      group.position.z -= depth;
      scene.add( group );

  }, _.noop, (error) => {
    console.error("Error loading SVG");
    console.error({error});
  });
}

module.exports = {
  scene: (selector) => {
    const container = document.querySelector(selector);
    const bbox = container.getBoundingClientRect();
    console.log({bbox});
    camera = new THREE.PerspectiveCamera( 75, bbox.width / bbox.height, 0.1, 1000 );
    renderer.setSize( bbox.width, bbox.height );
    container.appendChild( renderer.domElement );
    renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor( 0x000000, 1 );

    camera.position.set(6, -6, 10);
    // // camera.position.x = 6;
    // // camera.position.y = -6;
    // camera.position.z = 10;

		controls = new OrbitControls( camera, renderer.domElement );
    controls.target.x = 6;
    controls.target.y = -6;
    controls.update();
    window.controls = controls;

    // controls.update();
    // controls.update();
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

    // Geometry doesn't do much on its own, we need to create a Mesh from it
    // var material1 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    // var material2 = new THREE.MeshPhongMaterial({color: 0xff0000});
    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // window.extrudedMesh = new THREE.Mesh(extrudedGeometry, material1);
    // window.cube = new THREE.Mesh( geometry, material2 );

    // scene.add(extrudedMesh);
    // scene.add(cube);

    loadLayer('/mountain1.svg', 0.3);
    loadLayer('/forest1.svg');
    animate();

    // controls.update();
    window.camera = camera;
  }
}
