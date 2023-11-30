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

const light = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(light)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(0, 2, 0);
scene.add(directionalLight);

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
