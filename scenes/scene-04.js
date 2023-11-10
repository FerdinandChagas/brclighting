function calcularValor(A2, I1, I2, F2, F3, H8) {
    if (A2 === "") {
        return "";
    } else if (A2 === 0) {
        return H8; // Substitua 'dadosEntrada.DE.H8' pelo valor adequado do seu objeto de dados
    } else {
        let temp = F2 - Math.sqrt(Math.pow(I1, 2) - Math.pow((F3 - A2), 2));
        if (A2 === I2 || temp < 0) {
            return 0;
        } else {
            return temp.toFixed(2);
        }
    }
}


const material = new THREE.MeshLambertMaterial(
    { 
        color: 0x12127d,
        side: THREE.DoubleSide,
        wireframe: true
    }
);

const loader = new THREE.GLTFLoader();

let model = new THREE.Object3D();

loader.load( 'buildings/complex_building/scene.gltf', function ( gltf ) {
    model = gltf.scene
    model.scale.set(0.2,0.2,0.2)
	

}, undefined, function ( error ) {

	console.error( error );

} );

const points = [];
let I1 = 30;
let I2 = 15;
let F2 = 28.19;
let F3 = 25.25;
let H8 = 12;
for ( let d = 0.0; d <= 15.0; d=d+0.1 ) {
	points.push( new THREE.Vector2(d, calcularValor(d,I1, I2, F2, F3)));
}
const geometry = new THREE.LatheGeometry( points , 48);
const lathe = new THREE.Mesh( geometry, material );

lathe.scale.set(0.1,0.1,0.1);


scene.add( lathe );

//x3.add(model, { label: 'Prédio'});
x3.add(lathe, { label: 'Campo'});

renderer.setAnimationLoop(() => {

    x3.tick();

    x3.fps(() => {
        renderer.render(scene, camera)
    })
});

