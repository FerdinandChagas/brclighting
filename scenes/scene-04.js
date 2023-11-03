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
	scene.add( model );

}, undefined, function ( error ) {

	console.error( error );

} );

const points = [];
for ( let i = 0; i < 11; i ++ ) {
	points.push( new THREE.Vector2( (Math.cos( i * 0.2 ) * 10 + 5)*(-1), ( i - 5 ) * 2 ));
}
const geometry = new THREE.LatheGeometry( points );
const lathe = new THREE.Mesh( geometry, material );

lathe.scale.set(0.1,0.1,0.1);
lathe.position.set(1.25,6.2,-1.7);

scene.add( lathe );

x3.add(model, { label: 'Prédio'});
x3.add(lathe, { label: 'Campo'});

renderer.setAnimationLoop(() => {

    x3.tick();

    x3.fps(() => {
        renderer.render(scene, camera)
    })
});

