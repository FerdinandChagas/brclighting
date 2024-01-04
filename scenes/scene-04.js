function checkCollision(cube, mesh) {
    const cubeBox = new THREE.Box3().setFromObject(cube);
    const vertices = mesh.geometry.attributes.position.array;
    const margin = 0.5;

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
        color: 0x12ff7d,
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
    scene.add(predio);
});



function adicionarCorte( raio, dpi, h, graus){
    const points = [];
    let hcer = calculaHCE(h, dpi, raio);
    let dcer = calculaDPCE(dpi, raio, hcer);

    let radianos = (graus * Math.PI) / 180;
    for ( let d = 0.0; d <= dpi; d=d+0.1 ) {
        cp = calcularPontos(d,raio, dpi, hcer, dcer, h);
        if(cp>=0){
            let v2_temp = new THREE.Vector2(d, cp); 
            let v3_temp = new THREE.Vector3(v2_temp.x, v2_temp.y, 0);
            v3_temp.applyAxisAngle(new THREE.Vector3(0,1,0), radianos)
            points.push(v3_temp);
        } 
    }
    
    return points;
}

function adicionarCorteMod(raio, h, selectedPoint) {
    const points = [];
    const dpi = selectedPoint.length(); // Calcula a distância até a origem
    let hcer = calculaHCE(h, dpi, raio); 
    let dcer = calculaDPCE(dpi, raio, hcer);

    for (let d = 0.0; d <= dpi; d += 0.1) {
        const cp = calcularPontos(d, raio, dpi, hcer, dcer, h); 
        if (cp >= 0) {
            let v2_temp = new THREE.Vector2(d, cp);
            let v3_temp = new THREE.Vector3(v2_temp.x, v2_temp.y, 0);

            // Se um ponto selecionado pelo mouse for fornecido, ajusta o ponto de destino
            if (selectedPoint) {
                const angle = Math.atan2(selectedPoint.z, selectedPoint.x);
                v3_temp.applyAxisAngle(new THREE.Vector3(0, 1, 0), -angle);
            }

            points.push(v3_temp);
        }
    }

    return points;
}

function criarMesh(curve1, curve2, material) {
    function surfaceFunction1(u, v, target) {
        const point1 = curve1.getPointAt(u);
        const point2 = curve2.getPointAt(u);

        target.set(
            THREE.MathUtils.lerp(point1.x, point2.x, v),
            THREE.MathUtils.lerp(point1.y, point2.y, v),
            THREE.MathUtils.lerp(point1.z, point2.z, v)
        );
    }

    const surfaceGeometry = new THREE.ParametricGeometry(surfaceFunction1, 50, 10);
    const mesh = new THREE.Mesh(surfaceGeometry, material);

    return mesh;
}

const curve1 = new THREE.CatmullRomCurve3();
ponto1 = new THREE.Vector3(7, 0, -5.5);
curve1.points = adicionarCorteMod(45, 7, ponto1); // C
//curve1.points = adicionarCorte(45, 9.5, 7, 39); // C
const curve2 = new THREE.CatmullRomCurve3();
ponto2 = new THREE.Vector3(7, 0, 8.8);
curve2.points = adicionarCorteMod(45, 7, ponto2); // B
//curve2.points = adicionarCorte(45, 11.6, 7, 309); // B

//scene.add(criarMesh(curve1, curve2, material2));

const curve3 = new THREE.CatmullRomCurve3();
curve3.points = adicionarCorte(45, 11.6, 7, 309); //B
const curve4 = new THREE.CatmullRomCurve3();
curve4.points = adicionarCorte(45, 15.5, 7, 216); //A

//scene.add(criarMesh(curve3, curve4, material2));

const curve5 = new THREE.CatmullRomCurve3();
curve5.points = adicionarCorte(45, 15.5, 7, 216); // A
const curve6 = new THREE.CatmullRomCurve3();
curve6.points = adicionarCorte(45, 14, 7, 155);  // D

//scene.add(criarMesh(curve5, curve6, material2));

const curve7 = new THREE.CatmullRomCurve3();
curve7.points = adicionarCorte(45, 14, 7, 155);  // D
const curve8 = new THREE.CatmullRomCurve3();
curve8.points = adicionarCorte(45, 9.5, 7, 39); // C

//scene.add(criarMesh(curve7, curve8, material2));

const form = new THREE.PlaneGeometry(15,20);

const boxgeometry = new THREE.BoxGeometry(5,4,4);
const box = new THREE.Mesh(boxgeometry, material_box);
box.position.z=0.5;
box.position.y=2;
box.position.x=-0.5;




// Configurando o raio para interações do mouse
const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.1;  // Ajustar o limite para detecção de pontos
raycaster.far = 100;
const mouse = new THREE.Vector2();

// Evento de clique do mouse
window.addEventListener('dblclick', onMouseDoubleClick);
// Atualizações de tamanho da janela
window.addEventListener('resize', onWindowResize);

// Criando um plano no y=0
const planeGeometry1 = new THREE.PlaneGeometry(22, 17);
const planeMaterial1 = new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide, transparent: true, opacity: 0.2,});
const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.rotation.x = grausParaRadianos(90);
plane1.position.set(-2.5, 0, 1.5);
scene.add(plane1)


// Criando um plano no y=0
const planeGeometry2 = new THREE.PlaneGeometry(20, 15);
const planeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00FF00, side: THREE.DoubleSide, transparent: false, opacity: 0.4,});
const plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);

//plane2.position.set(-2.5, 4, 1.5);
//scene.add(plane2)

const alvos_cortes = [];
// Função de clique do mouse
function onMouseDoubleClick(event) {
    // Evite a duplicação do clique ao clicar em outros elementos
    if (event.target !== renderer.domElement) {
        return;
    }
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
        let temp = new THREE.Vector3(selectedPoint.x, 0, selectedPoint.z);
        alvos_cortes.push(temp);
        console.log('Coordenadas do ponto selecionado:', selectedPoint.x, 0, selectedPoint.z);
        console.log('Alvos:', alvos_cortes.length);
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
//x3.add(box, { label: 'Box'});
x3.add(plane1, { label: 'Corte'});

/*teste1 = checkCollision(box, mesh1);
teste2 = checkCollision(box, mesh2);
teste3 = checkCollision(box, mesh3);
teste4 = checkCollision(box, mesh4);*/

/*if (teste1) {
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
}*/

let num_cortes = 0;

renderer.setAnimationLoop(() => {

    x3.tick();
    if(alvos_cortes.length-num_cortes>=2){
        const curveA = new THREE.CatmullRomCurve3();
        curveA.points = adicionarCorteMod(45, 7, alvos_cortes[num_cortes]);  // D
        console.log("Ponto A: ", alvos_cortes[num_cortes].x, alvos_cortes[num_cortes].y, alvos_cortes[num_cortes].z);
        const curveB = new THREE.CatmullRomCurve3();
        curveB.points = adicionarCorteMod(45, 7, alvos_cortes[num_cortes+1]); // C
        console.log("Ponto B: ", alvos_cortes[num_cortes+1].x, alvos_cortes[num_cortes+1].y, alvos_cortes[num_cortes+1].z);

        scene.add(criarMesh(curveA, curveB, material2));
        console.log("Era para ter desenhado.");
        num_cortes+=1
    }
    x3.fps(() => {
        renderer.render(scene, camera)
    })
});

