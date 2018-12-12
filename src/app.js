import smoke from './images/smoke4-min.png';
import {
    Clock,
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    PlaneGeometry,
    TextureLoader,
    MeshLambertMaterial,
    Mesh
} from 'three';

(function (){
    let m_w = 123456789;
    let m_z = 987654321;
    let mask = 0xffffffff;

    ((i) => {
        m_w = (123456789 + i) & mask;
        m_z = (987654321 - i) & mask;
    })(35);

    const random = () => {
        // Takes any integer
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

        let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    }

    const clock = new Clock();

    const renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );

    const scene = new Scene();

    const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );

    const light = new DirectionalLight(0xffffff,0.5);
    light.position.set(-1,0,1);
    scene.add(light);

    const smokeGeo = new PlaneGeometry(759, 383);
    const smokeParticles = [];
    const materialsTop = [];
    const materialsBottom = [];

    const texture = new TextureLoader().load(smoke);

    const colorsTop = [0x4c4261, 0x5b4e6e, 0x5d6088, 0x575b87, 0x656995, 0x4a5782, 0xb09fa2];
    const colorsBottom = [ 0xFFAFD7, 0x00D7D7, 0xaab0cd, 0x969ab4, 0x00AFFF, 0xFF5FD7, 0xFF5FD7, 0x00D7D7];


    for(let i = 0; i < 10; i++){
        materialsTop.push(new MeshLambertMaterial({color: colorsTop[i%colorsTop.length], map: texture, transparent: true}));
        materialsBottom.push(new MeshLambertMaterial({color: colorsBottom[i%colorsBottom.length], map: texture, transparent: true}));
    }

    for (let p = 0; p < 30; p++) {
        const particle = new Mesh(smokeGeo,materialsBottom[p%materialsBottom.length]);
        particle.position.set((random() * Math.cos(random()))*window.innerWidth-400,(random() * Math.cos(random()))*window.innerHeight-400,random()*700);
        particle.rotation.z = random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    for (let p = 0; p < 30; p++) {
        const particle = new Mesh(smokeGeo,materialsTop[p%materialsTop.length]);
        particle.position.set(random()*window.innerWidth-400,random()*window.innerHeight-400,random()*1000);
        particle.rotation.z = random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    let delta;
    const animate = () => {
        delta = clock.getDelta();
        requestAnimationFrame( animate );
        evolveSmoke();
        render();
    }
    
    const evolveSmoke = () => {
        let sp = smokeParticles.length;
        while(sp--) {
            smokeParticles[sp].rotation.z += (delta * 0.2);
        }
    }

    const render = () => {
        renderer.render( scene, camera );
    }

    document.getElementById("app").appendChild( renderer.domElement );

    animate();
})();

document.addEventListener('DOMContentLoaded', () => {
    // const app = document.getElementById("app");

    const list = document.getElementsByClassName("init");
    let i = 125;
    (() => {
        for (let item of list) {
            console.log(item);
            let int = setInterval(function () {
                item.classList.remove('init');
                clearInterval(int);
            }, i += 125);
        }
    })();

});