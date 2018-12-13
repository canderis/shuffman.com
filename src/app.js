import smoke from './images/cloud1.png';
import {
    Clock,
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    PlaneGeometry,
    TextureLoader,
    MeshLambertMaterial,
    Mesh,
} from 'three';

'use strict';

(function() {
    let mw = 123456789;
    let mz = 987654321;
    const mask = 0xffffffff;

    ((i) => {
        mw = (123456789 + i) & mask;
        mz = (987654321 - i) & mask;
    })(26);

    const random = () => {
        // Takes any integer
        mz = (36969 * (mz & 65535) + (mz >> 16)) & mask;
        mw = (18000 * (mw & 65535) + (mw >> 16)) & mask;

        let result = ((mz << 16) + (mw & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    };

    const renderer = new WebGLRenderer( {alpha: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );

    const scene = new Scene();

    const camera = new PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 1, 10000
    );

    camera.position.z = 1000;
    scene.add( camera );

    const light = new DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, 0, 1);
    scene.add(light);

    const smokeGeo = new PlaneGeometry(1024, 512);
    const smokeParticles = [];
    const materialsTop = [];
    const materialsBottom = [];

    const texture = new TextureLoader().load(smoke);

    const colorsTop = [
        0x4c4261,
        0x5b4e6e,
        0x5d6088,
        0x575b87,
        0x656995,
        0x4a5782,
        0xb09fa2,
    ];

    const colorsBottom = [
        0xFFAFD7,
        0x00D7D7,
        0xaab0cd,
        0x969ab4,
        0x00AFFF,
        0xFF5FD7,
        0xFF5FD7,
        0x00D7D7,
    ];


    for (let i = 0; i < 10; i++) {
        materialsTop.push(
            new MeshLambertMaterial({
                color: colorsTop[i%colorsTop.length],
                map: texture, transparent: true,
            }));
        materialsBottom.push(
            new MeshLambertMaterial({
                color: colorsBottom[i%colorsBottom.length],
                map: texture, transparent: true,
            }));
    }

    for (let p = 0; p < 30; p++) {
        const particle = new Mesh(
            smokeGeo,
            materialsBottom[p%materialsBottom.length]
        );

        particle.position.set(
            (random() * Math.cos(random()))*window.innerWidth-500,
            (random() * Math.cos(random()))*window.innerHeight-400,
            random()*700
        );

        particle.rotation.z = random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    for (let p = 0; p < 30; p++) {
        const particle = new Mesh(
            smokeGeo,
            materialsTop[p%materialsTop.length]
        );

        particle.position.set(
            (random() * Math.cos(random()))*window.innerWidth-400,
            (random() * Math.cos(random()))*window.innerHeight-400,
            random()*700
        );

        particle.rotation.z = random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    const clock = new Clock();
    const animate = () => {
        const delta = clock.getDelta();
        requestAnimationFrame( animate );
        smokeParticles.forEach((particle) => {
            particle.rotation.z += (delta * 0.2);
        });
        renderer.render( scene, camera );
    };

    document.getElementById('app').appendChild( renderer.domElement );

    animate();
})();

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementsByClassName('init');
    let i = 125;
    (() => {
        for (const item of list) {
            const int = setInterval(() => {
                item.classList.remove('init');
                clearInterval(int);
            }, i += 125);
        }
    })();
});
