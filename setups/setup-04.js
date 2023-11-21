const options = {
    targetSelector: '#scene',
    width: 1280, height: 900,
    backgroundColor: 0xeeeeee
}

const renderer = new THREE.WebGLRenderer(
    { antialias: true }
);

renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(options.width, options.height);

document.querySelector(options.targetSelector).appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(options.backgroundColor);

const camera = new THREE.PerspectiveCamera(
    50, options.width / options.height
);

camera.position.x = 8;
camera.position.y = 18.18;
camera.position.z = 2.6;

const light = new THREE.HemisphereLight(
    0xFFFFFF, 0xFFFFFF, 4.28
);

scene.add(light)

const x3 = new THREEx3(
    {
        THREE,
        OrbitControls: THREE.OrbitControls,
        camera,
        renderer,
        scene
    }
);

x3.add(camera, { open: false});
x3.add(light, { helper: { visible: false }});
