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
        transparent: true, // torna o material transparente
        opacity: 1, // define o nível de transparência (0: completamente transparente, 1: opaco)
        wireframe: false, // não exibir wireframe
    }
);

const material2 = new THREE.MeshLambertMaterial(
    { 
        color: 0x222222,
        side: THREE.DoubleSide,
        wireframe: false
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
    //console.log("hcer = "+hcer);
    //console.log("dcer = "+dcer);
    let radianos = (graus * Math.PI) / 180;
    for ( let d = 0.0; d <= dpi; d=d+0.1 ) {
        cp = calcularPontos(d,raio, dpi, hcer, dcer, h);
        if(cp>=0){
            let v2_temp = new THREE.Vector2(d, cp); 
            let v3_temp = new THREE.Vector3(v2_temp.x, v2_temp.y, 0);
            v3_temp.applyAxisAngle(new THREE.Vector3(0,1,0), radianos)
            points.push(v3_temp);
            //console.log(cp);
        } 
    }
    
    return points;
}

const curve1 = new THREE.CatmullRomCurve3();
curve1.points = adicionarCorte(45, 9.5, 7, 39); // C
const curve2 = new THREE.CatmullRomCurve3();
curve2.points = adicionarCorte(45, 11.6, 7, 309); // B

function surfaceFunction1(u, v, target) {
    const point1 = curve1.getPointAt(u);
    const point2 = curve2.getPointAt(u);
  
    target.set(
      THREE.MathUtils.lerp(point1.x, point2.x, v),
      THREE.MathUtils.lerp(point1.y, point2.y, v),
      THREE.MathUtils.lerp(point1.z, point2.z, v)
    );
  }
const surfaceGeometry1 = new THREE.ParametricGeometry(surfaceFunction1, 50, 10);
const mesh1 = new THREE.Mesh(surfaceGeometry1, material);
scene.add(mesh1);

const curve3 = new THREE.CatmullRomCurve3();
curve3.points = adicionarCorte(45, 11.6, 7, 309); //B
const curve4 = new THREE.CatmullRomCurve3();
curve4.points = adicionarCorte(45, 15.5, 7, 216); //A

function surfaceFunction2(u, v, target) {
    const point1 = curve3.getPointAt(u);
    const point2 = curve4.getPointAt(u);
  
    target.set(
      THREE.MathUtils.lerp(point1.x, point2.x, v),
      THREE.MathUtils.lerp(point1.y, point2.y, v),
      THREE.MathUtils.lerp(point1.z, point2.z, v)
    );
  }
const surfaceGeometry2 = new THREE.ParametricGeometry(surfaceFunction2, 50, 10);
const mesh2 = new THREE.Mesh(surfaceGeometry2, material);
scene.add(mesh2);

const curve5 = new THREE.CatmullRomCurve3();
curve5.points = adicionarCorte(45, 15.5, 7, 216); // A
const curve6 = new THREE.CatmullRomCurve3();
curve6.points = adicionarCorte(45, 14, 7, 155);  // D

function surfaceFunction3(u, v, target) {
    const point1 = curve5.getPointAt(u);
    const point2 = curve6.getPointAt(u);
  
    target.set(
      THREE.MathUtils.lerp(point1.x, point2.x, v),
      THREE.MathUtils.lerp(point1.y, point2.y, v),
      THREE.MathUtils.lerp(point1.z, point2.z, v)
    );
  }
const surfaceGeometry3 = new THREE.ParametricGeometry(surfaceFunction3, 50, 10);
const mesh3 = new THREE.Mesh(surfaceGeometry3, material);
scene.add(mesh3);

const curve7 = new THREE.CatmullRomCurve3();
curve7.points = adicionarCorte(45, 14, 7, 155);  // D
const curve8 = new THREE.CatmullRomCurve3();
curve8.points = adicionarCorte(45, 9.5, 7, 39); // C

function surfaceFunction4(u, v, target) {
    const point1 = curve7.getPointAt(u);
    const point2 = curve8.getPointAt(u);
  
    target.set(
      THREE.MathUtils.lerp(point1.x, point2.x, v),
      THREE.MathUtils.lerp(point1.y, point2.y, v),
      THREE.MathUtils.lerp(point1.z, point2.z, v)
    );
  }
const surfaceGeometry4 = new THREE.ParametricGeometry(surfaceFunction4, 50, 10);
const mesh4 = new THREE.Mesh(surfaceGeometry4, material);
scene.add(mesh4);

const form = new THREE.PlaneGeometry(15,20);

const boxgeometry = new THREE.BoxGeometry(5,4,4);
const box = new THREE.Mesh(boxgeometry, material2);
box.position.z=1;
box.position.y=2;
box.position.x=-0.5;


//plane.rotation.x = Math.PI /2;

/*const corteCD = adicionarCorte(45, 6, 7, 90);
const corteD = adicionarCorte(45, 14, 7, 155);
const corteAD = adicionarCorte(45, 12.6, 7, 180);
const corteA = adicionarCorte(45, 15.5, 7, 216);
const corteAB = adicionarCorte(45, 9, 7, 270);
const corteX = adicionarCorte(45, 12.7, 7, 225);
const corteB = adicionarCorte(45, 11.6, 7, 309);*/

/*scene.add( corteCD );
scene.add( corteD );
scene.add( corteAD );
scene.add( corteA );
scene.add( corteAB );
scene.add( corteX );
scene.add( corteB );*/
scene.add(model);
scene.add( box );

x3.add(mesh1, { label: 'Corte1'});
x3.add(mesh2, { label: 'Corte2'});
x3.add(mesh3, { label: 'Corte3'});
x3.add(mesh4, { label: 'Corte4'});

renderer.setAnimationLoop(() => {

    x3.tick();

    x3.fps(() => {
        renderer.render(scene, camera)
    })
});

