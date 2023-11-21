function posicionarObj( px, py, dx, dy, obj){
    obj.position.z= dx-(px/2);
    obj.position.x= dy-(py/2);
}

function calculaTheta(altura, dpi, raio){
    let alpha = Math.round(Math.atan(altura / dpi) * (180 / Math.PI) * 10000) / 10000;
    console.log("alpha = "+alpha);
    let beta = Math.round(Math.acos(Math.sqrt(Math.pow(altura, 2) + Math.pow(dpi, 2)) / (2 * raio)) * (180 / Math.PI) * 1000) / 1000;
    console.log("beta = "+beta);
    let theta = 180-(alpha+beta)
    return theta
}

function calculaHCE(altura, dpi, raio){
    let theta = calculaTheta(altura, dpi, raio);

    // Convertendo graus para radianos
    let theta_rad = (theta * Math.PI) / 180;

    // Calculando o resultado da fórmula
    return Math.round(raio * Math.sin(theta_rad) * 100) / 100;
}

function calculaDPCE(dpi, raio, hce){
    return Math.round((dpi + Math.sqrt(Math.pow(raio, 2) - Math.pow(hce, 2))) * 100) / 100;
}


function calcularPontos(d, raio, dp, hcer, dcer, h) {
    if (d === "") {
        return "";
    } else if (d === 0) {
        return h; 
    } else {
        let temp = hcer - Math.sqrt(Math.pow(raio, 2) - Math.pow((dcer - d), 2));
        if (d === dp || temp < 0) {
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

const material2 = new THREE.MeshLambertMaterial(
    { 
        color: 0x222222,
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

function adicionarCorte( raio, dpi, h, graus){
    const points = [];
    let hcer = calculaHCE(h, dpi, raio);
    let dcer = calculaDPCE(dpi, raio, hcer);
    console.log("hcer = "+hcer);
    console.log("dcer = "+dcer);
    for ( let d = 0.0; d <= dpi; d=d+0.1 ) {
        cp = calcularPontos(d,raio, dpi, hcer, dcer, h);
        if(cp>=0){
            points.push( new THREE.Vector2(d, cp));
            console.log(cp);
        } 
    }
    let radianos = (graus * Math.PI) / 180;
    const geometry = new THREE.LatheGeometry( points , 48, radianos, 0.001);
    const lathe = new THREE.Mesh( geometry, material );
    lathe.position.z=2.6;
    lathe.position.x=1.5;
    return lathe;
}

const form = new THREE.PlaneGeometry(15,20);
const plane = new THREE.Mesh(form, material2);

const boxgeometry = new THREE.BoxGeometry(4,4,5);
const box = new THREE.Mesh(boxgeometry, material2);
box.position.z=2;
box.position.x=0.5;
box.position.y=2;


plane.rotation.x = Math.PI /2;
const corteBC = adicionarCorte(45, 7.4, 7, 0);
const corteC = adicionarCorte(45, 9.5, 7, 39);
const corteCD = adicionarCorte(45, 6, 7, 90);
const corteD = adicionarCorte(45, 14, 7, 155);
const corteAD = adicionarCorte(45, 12.6, 7, 180);
const corteA = adicionarCorte(45, 15.5, 7, 216);
const corteAB = adicionarCorte(45, 9, 7, 270);
const corteX = adicionarCorte(45, 12.7, 7, 225);
const corteB = adicionarCorte(45, 11.6, 7, 309);

scene.add( corteBC );
scene.add( corteC );
scene.add( corteCD );
scene.add( corteD );
scene.add( corteAD );
scene.add( corteA );
scene.add( corteAB );
scene.add( corteX );
scene.add( corteB );
scene.add( plane );
scene.add( box );

//x3.add(model, { label: 'Prédio'});
x3.add(corteAB, { label: 'Corte1'});
x3.add(plane, { label: 'Plano'});

renderer.setAnimationLoop(() => {

    x3.tick();

    x3.fps(() => {
        renderer.render(scene, camera)
    })
});

