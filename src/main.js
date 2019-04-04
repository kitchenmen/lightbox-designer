const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const _ = require('lodash');
const yo = require('yo-yo');
require('three-svg-loader')(THREE);
require('three-obj-loader')(THREE);

window.THREE = THREE;

const scene = new THREE.Scene();
let camera, controls, container;
const renderer = new THREE.WebGLRenderer({antialias: true});
const loader = new THREE.SVGLoader();
const objLoader = new THREE.OBJLoader();
let layers = [];

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
	const bbox = container.getBoundingClientRect();
  camera.aspect = bbox.width / bbox.height;
  camera.updateProjectionMatrix();
  renderer.setSize( bbox.width, bbox.height );
}

const clearScene  = () => {
	console.log("Clearing scene!");
	_.each(layers, (layer) => {
		scene.remove(layer);
	});
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
			layers.push(group);
      scene.add( group );

  }, _.noop, (error) => {
    console.error("Error loading SVG");
    console.error({error});
  });
}

module.exports = {
  scene: (selector) => {
    container = document.querySelector(selector);
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
    controls.enableZoom = false;
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
  },
	listController: (selector) => {
		var listContainer = document.querySelector(selector);
		let designs = [
			{name: 'Couple on Beach', image: '/svgs/l2.svg'},
			{name: 'House on Beach', image: 'svgs/l3.svg'},
			{name: 'Lighthouse', image: 'svgs/l4.svg'},
			{name: 'Sailboat', image: 'svgs/l5.svg'},
			{name: 'Mountainer', image: 'mountain1.svg'},
			{name: 'Forest', image: 'forest1.svg'}
		];
		var resetButton = yo`
			<button type="button" onclick=${clearScene} class="btn btn-warning">Reset</button>
		`;
		var generateGcodeBtn = yo`
			<button type="button" onclick=${_.noop} class="btn btn-success">Generate Gcode</button>
		`;

		listContainer.appendChild(resetButton);
		listContainer.appendChild(generateGcodeBtn);
		_.each(designs, (design) => {

			const numInput = yo`
				<input type="number" value="0.1" min="-2" max="1">
			`;
			const addLayer = function() {
				console.log("ADD LAYER!!");
				loadLayer(design.image, numInput.value);
			}

			const addLayerBtn = yo`
				<button type="button" onclick=${addLayer} class="btn btn-success">Add Layer</button>
			`;

			var style = `
				background: url(${design.image});
				background-size: 100%;
				background-repeat: no-repeat;
				width: 100px;
				height: 100px;
				marin: 0 auto;
			`;

			var row = yo`
				<div class="row">
					<div style="text-align: center; margin:2px; width: 100%;" ><div style="${style}"></div></div>
					<br/>
					<div>
						<b>${design.name}</b>
						${numInput}
						${addLayerBtn}
					</div>
				</div>
			`;
			listContainer.appendChild(row);
		});
	}
}
