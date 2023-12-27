function checkCollision(cube, mesh) {
    const cubeBox = new THREE.Box3().setFromObject(cube);
    const vertices = mesh.geometry.attributes.position.array;
    const margin = 0.02;

    // Loop through all vertices of the mesh and check for collision
    
    
    for (let i = 0; i < vertices.length; i+=3) {
        const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
      
        const expandedCubeBox = new THREE.Box3().copy(cubeBox).expandByScalar(margin);

        if (expandedCubeBox.containsPoint(vertex)) {
          console.log("Colisão detectada! no", vertex);
          return true; // Collision detected
        }
    }
    
    return false; // No collision
  }

function posicionarObj( px, py, dx, dy, obj){
    obj.position.z= dx-(px/2);
    obj.position.x= dy-(py/2);
}

function grausParaRadianos(graus) {
    return (graus * Math.PI) / 180;
}

function calculaTheta(altura, dpi, raio){
    let alpha = Math.round(Math.atan(altura / dpi) * (180 / Math.PI) * 10000) / 10000;
    //console.log("alpha = "+alpha);
    let beta = Math.round(Math.acos(Math.sqrt(Math.pow(altura, 2) + Math.pow(dpi, 2)) / (2 * raio)) * (180 / Math.PI) * 1000) / 1000;
    //console.log("beta = "+beta);
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
        transparent: true, 
        opacity: 0.6, 
        wireframe: false, 
    }
);

const material1 = new THREE.MeshLambertMaterial(
    { 
        color: 0x12127d,
        side: THREE.DoubleSide,
        transparent: true, 
        opacity: 0.6, 
        wireframe: false, 
    }
);

const material2 = new THREE.MeshLambertMaterial(
    { 
        color: 0x12127d,
        side: THREE.DoubleSide,
        transparent: true, 
        opacity: 0.6, 
        wireframe: false, 
    }
);

const material3 = new THREE.MeshLambertMaterial(
    { 
        color: 0x12127d,
        side: THREE.DoubleSide,
        transparent: true, 
        opacity: 0.6, 
        wireframe: false, 
    }
);

const material4 = new THREE.MeshLambertMaterial(
    { 
        color: 0x12127d,
        side: THREE.DoubleSide,
        transparent: true, 
        opacity: 0.6, 
        wireframe: false, 
    }
);

const material_box = new THREE.MeshLambertMaterial(
    { 
        color: 0x222222,
        side: THREE.DoubleSide,
        wireframe: false
    }
);

const loader = new THREE.STLLoader();

let model = new THREE.Object3D();

let predio = new  THREE.Object3D();

loader.load('buildings/predio_georeferenciado.stl', (geometry) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x141414, wireframe: false, }); // Cor do material
    const predio = new THREE.Mesh(geometry, material);
    predio.rotation.x = grausParaRadianos(-90);
    predio.rotation.z = grausParaRadianos(-68);
    predio.position.y = -29.4;
    predio.position.z = 3.4;
    predio.position.x = -13.6;
    predio.scale.set(0.98, 0.98, 0.98);
    //scene.add(predio);
});



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
const mesh1 = new THREE.Mesh(surfaceGeometry1, material1);
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
const mesh2 = new THREE.Mesh(surfaceGeometry2, material2);
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
const mesh3 = new THREE.Mesh(surfaceGeometry3, material3);
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
const mesh4 = new THREE.Mesh(surfaceGeometry4, material4);
scene.add(mesh4);

const form = new THREE.PlaneGeometry(15,20);

const boxgeometry = new THREE.BoxGeometry(5,4,4);
const box = new THREE.Mesh(boxgeometry, material_box);
box.position.z=-1.5;
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
//scene.add(model);
scene.add( box );

// Configurando o raio para interações do mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Evento de clique do mouse
window.addEventListener('click', onMouseClick);

// Atualizações de tamanho da janela
window.addEventListener('resize', onWindowResize);

// Criando um plano no y=0
const planeGeometry1 = new THREE.PlaneGeometry(20, 15);
const planeMaterial1 = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide, transparent: true, opacity: 0.4,});
const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.rotation.x = grausParaRadianos(90);
plane1.position.set(-2.5, 0, 1.5);
//scene.add(plane1)


// Criando um plano no y=0
const planeGeometry2 = new THREE.PlaneGeometry(20, 15);
const planeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00FF00, side: THREE.DoubleSide, transparent: false, opacity: 0.4,});
const plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);

//plane2.position.set(-2.5, 4, 1.5);
//scene.add(plane2)

// Função de clique do mouse
function onMouseClick(event) {
    // Calcula as coordenadas do mouse em relação ao tamanho da janela
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Atualiza o raio com as novas coordenadas do mouse
    raycaster.setFromCamera(mouse, camera);

    // Encontra objetos intersectados pelo raio
    const intersects = raycaster.intersectObjects([plane1]);

    // Verifica se há interseções e imprime as coordenadas do ponto selecionado
    if (intersects.length > 0) {
        const selectedPoint = intersects[0].point;
        //console.log('Coordenadas do ponto selecionado:', selectedPoint.x, selectedPoint.y, selectedPoint.z);
    }
}

// Atualiza o tamanho da tela ao redimensionar a janela
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


/*x3.add(mesh1, { label: 'Corte1'});
x3.add(mesh2, { label: 'Corte2'});
x3.add(mesh3, { label: 'Corte3'});
x3.add(mesh4, { label: 'Corte4'});
x3.add(predio, {label: 'Prédio'});*/
x3.add(box, { label: 'Box'});
//x3.add(plane2, { label: 'Corte'});

teste1 = checkCollision(box, mesh1);
teste2 = checkCollision(box, mesh2);
teste3 = checkCollision(box, mesh3);
teste4 = checkCollision(box, mesh4);

if (teste1) {
    // Handle collision here
    mesh1.material.color.set(0xff0000); // Change parametric mesh color on collision
}

if (teste2) {
    // Handle collision here
    mesh2.material.color.set(0xff0000); // Change parametric mesh color on collision
}

if (teste3) {
    // Handle collision here
    mesh3.material.color.set(0xff0000); // Change parametric mesh color on collision
}

if (teste4) {
    // Handle collision here
    mesh4.material.color.set(0xff0000); // Change parametric mesh color on collision
}

renderer.setAnimationLoop(() => {

    x3.tick();
    
    x3.fps(() => {
        renderer.render(scene, camera)
    })
});

