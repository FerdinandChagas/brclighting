
const material = new THREE.MeshLambertMaterial({ color: 0x777777});

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1,1,1), 
    material
);

scene.add(cube);

const circle = new THREE.Mesh(
    new THREE.CircleBufferGeometry(
        0.5, 20    
    ),
    material
);

circle.position.x= -2;
circle.rotation.x = THREE.MathUtils.degToRad(-90);
scene.add(circle);

const cone = new THREE.Mesh(
    new THREE.ConeBufferGeometry(
        0.3, 0.5    
    ),
    material
);

cone.position.x= -2;
cone.position.y = 2


scene.add(cone);

const esfera = new THREE.Mesh(
    new THREE.SphereGeometry(
        1, 32, 32
    ),
    material
)

esfera.position.x = -3
esfera.position.y = 3

scene.add(esfera)

const cilindro = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(
        0.5, 0.5, 1
    ),
    material
)

cilindro.position.x = 2;
cilindro.position.y = 0;
scene.add(cilindro)

x3.add(cube, { label: 'cube'});
x3.add(cone, { label: 'cone'});
x3.add(esfera, { label: 'esfera'});
x3.add(cilindro, { label: 'cilindo'});

renderer.setAnimationLoop(() => {

    x3.tick();

    x3.fps(() => {
        renderer.render(scene, camera)
    })
});

