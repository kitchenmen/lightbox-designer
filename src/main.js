const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const _ = require('lodash');
require('three-svg-loader')(THREE);
require('three-obj-loader')(THREE);

window.THREE = THREE;

const scene = new THREE.Scene();
let camera, controls;
const renderer = new THREE.WebGLRenderer({antialias: true});
const loader = new THREE.SVGLoader();
const objLoader = new THREE.OBJLoader();

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

const loadFrame = () => {
  objLoader.load('/frame.obj', (object) => {
    object.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2);
    // object.position.z -= 10;
    object.position.x += 22.7;
    object.position.y -= 13;
    object.scale.x = 1.2;
    object.scale.z = 1.2;
    object.children[0].material.color = new THREE.Color("rgb(112, 72, 11)");
    console.log({object});
    // object.position.z -= 5;
    scene.add(object);
  }, _.noop, (error) => {
    console.error({error});
  });
};

const loadLayer = (filename, depth=0) => {
  loader.load(filename, (paths) => {
    var group = new THREE.Group();

    for ( var i = 0; i < paths.length; i ++ ) {

        var path = paths[ i ];

        var material = new THREE.MeshPhongMaterial( {
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: true,
          transparent: true,
          opacity: 0.6
        } );

        console.log({material});

        var shapes = path.toShapes( true );

        for ( var j = 0; j < shapes.length; j ++ ) {

          var shape = shapes[ j ];
          var geometry = new THREE.ShapeBufferGeometry( shape );
          var extrudedGeometry = new THREE.ExtrudeGeometry(shape, {amount: 0.1, bevelEnabled: false});
          var mesh = new THREE.Mesh( extrudedGeometry, material );
          group.add( mesh );

        }

      }

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
    camera = new THREE.PerspectiveCamera( 75, bbox.width / bbox.height, 0.1, 1000 );
    renderer.setSize( bbox.width, bbox.height );
    container.appendChild( renderer.domElement );
    renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor( 0x000000, 1 );

    camera.position.set(6, -6, 12);
		controls = new OrbitControls( camera, renderer.domElement );
    controls.target.x = 6;
    controls.target.y = -6;
    // controls.enableZoom = false;
    controls.update();
    window.controls = controls;

		var lights = [];
    window.lights = lights;
		lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[ 1 ] = new THREE.PointLight( 0xffffff, 0.7, 0 );
		// lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

		lights[ 0 ].position.set( 1, -0.1, 0.1 );
		lights[ 1 ].position.set( 100, 200, 100 );
		// lights[ 2 ].position.set( - 100, - 200, - 100 );

    // Start: lights[0].position.set(1,-0.1, 0.1)
    // End: 11,-0.1, 0.1
    for (let i=0;i<3;i++) {
      var light = new THREE.PointLight( new THREE.Color("blue"), 1, 1 );
      light.position.set(3+ i*(11-1)/3, 0, 0.1);
      scene.add(light);
    }

    for (let i=0;i<3;i++) {
      var light = new THREE.PointLight( 0xffffff, 0.5, 100 );
      light.position.set(3+ i*(11-1)/3, -13, 0.1);
      scene.add(light);
    }

		// scene.add( lights[ 0 ] );
		scene.add( lights[ 1 ] );
		// scene.add( lights[ 2 ] );

    // Geometry doesn't do much on its own, we need to create a Mesh from it
    // var material1 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    // var material2 = new THREE.MeshPhongMaterial({color: 0xff0000});
    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // window.extrudedMesh = new THREE.Mesh(extrudedGeometry, material1);
    // window.cube = new THREE.Mesh( geometry, material2 );

    // scene.add(extrudedMesh);
    // scene.add(cube);

    loadLayer('/mountain1.svg', 0.3);
    loadLayer('/forest1.svg', -0.2);
    loadFrame();
    animate();

    // controls.update();
    window.camera = camera;
  }
}
