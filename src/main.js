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
          color: new THREE.Color("white"),
          depthWrite: true,
          transparent: true,
          opacity: 0.4,
          roughness: 1,
          side: THREE.DoubleSide
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

    for (let i=0;i<5;i++) {
      var light = new THREE.PointLight( new THREE.Color("blue"), 1);
      light.position.set(3+ i*(11-1)/5, -3, -1);
      scene.add(light);
    }

    for (let i=0;i<5;i++) {
      var light = new THREE.PointLight( new THREE.Color("green)"), 1);
      light.position.set(3+ i*(11-1)/5, -13, 0.1);
      scene.add(light);
    }

    loadLayer('/svgs/l5.svg', 0.10);
    loadLayer('/svgs/l1.svg', 0.6);
    loadLayer('/svgs/l2.svg', -1);
    loadLayer('/svgs/l3.svg', -0.2);
    // loadLayer('/svgs/l4.svg', -0.6);

    loadFrame();
    animate();

    // controls.update();
    window.camera = camera;
  }
}
