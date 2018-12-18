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

const runAnimate = true;
(function() {
    const between = (function() {
        const SEED = 5;

        let mw = 123456789;
        let mz = 987654321;
        const mask = 0xffffffff;

        ((i) => {
            mw = (123456789 + i) & mask;
            mz = (987654321 - i) & mask;
        })(SEED);

        const random = () => {
            // Takes any integer
            mz = (36969 * (mz & 65535) + (mz >> 16)) & mask;
            mw = (18000 * (mw & 65535) + (mw >> 16)) & mask;

            let result = ((mz << 16) + (mw & 65535)) >>> 0;
            result /= 4294967296;
            return result;
        };

        return (min, max) => {
            return Math.floor(random()*(max-min+1)+min);
        };
    })();

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

    const texture = new TextureLoader().load(smoke);

    const colors = [
        0xf1697f,
        0xf97859,
        0x7d47b6,
        0xf58b59,
        0xcb85a9,
        0xff8866,
        0xda7cba,
        0xb8a4eb,
        0x6c3fa8,
        0xfd995d,
        0x4987d2,
        0x3c6f8c,
        0x4987d2,
        0x0096d1,
    ];

    const materials = [];
    for (let i = 0; i < colors.length; i++) {
        materials.push(
            new MeshLambertMaterial({
                emissive: colors[i],
                color: colors[i],
                emissiveIntensity: 0.5,
                map: texture, transparent: true,
            }));
        materials.push(
            new MeshLambertMaterial({
                emissive: colors[i],
                color: colors[i],
                emissiveIntensity: 0.3,
                map: texture, transparent: true,
            }));
    }

    const lim = Math.floor(
        ((x) => {
            return -3.167849 + 0.01190006*x + 0.0000311615*(Math.pow(x, 2));
        })(window.innerWidth)
    );

    const particles = [];
    const geo = new PlaneGeometry(1024, 512);
    for (let p = 0; p < lim; p++) {
        const particle = new Mesh(
            geo,
            materials[p%materials.length]
        );

        particle.position.set(
            between(-1024, window.innerWidth + 256),
            between(-1024, window.innerHeight),
            between(0, 700)
        );

        particle.rotation.z = between(0, 360);
        scene.add(particle);
        particles.push(particle);
    }

    const clock = new Clock();
    const animate = () => {
        requestAnimationFrame( animate );

        if (runAnimate) {
            const delta = clock.getDelta();
            particles.forEach((particle) => {
                particle.rotation.z += (delta * 0.2);
            });
        }
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
            }, i += 500);
        }
    })();
});

(() => {
    const aboutLink = document.getElementById('about-link');
    let open = false;
    aboutLink.addEventListener('click', () => {
        if (!open) {
            document.getElementById('about-page').classList.add('show');
            document.getElementById('title').classList.add('init');
            document.getElementById('subtitle').classList.add('init');
            aboutLink.innerText = 'close';
            aboutLink.classList.add('-active');
        } else {
            document.getElementById('about-page').classList.remove('show');
            document.getElementById('title').classList.remove('init');
            document.getElementById('subtitle').classList.remove('init');
            aboutLink.innerText = 'about';
            aboutLink.classList.remove('-active');
        }
        open = !open;
    });

    // const links = document.getElementsByClassName('nav-link');
    // let active = document.getElementById('home-link');
    // let pg = document.getElementById('home-page');
    // const rmActive = (newPgLink, newPg) => {
    //     newPgLink.classList.add('-active');
    //     pg.classList.remove('top');
    //     if (newPg.getAttribute('id') !== 'home-page') {
    //         const oldPg = pg;
    //         const int = setInterval(() => {
    //             // runAnimate = false;
    //             oldPg.classList.remove('show' );
    //             clearInterval(int);
    //         }, 1000);
    //     } else {
    //         // runAnimate = true;
    //         pg.classList.remove('show' );
    //     }

    //     pg = newPg;
    //     active.classList.remove('-active');
    //     active = newPgLink;
    // };


    // for (const link of links) {
    //     console.log();
    //     link.addEventListener('click', () => {
    //         const pgEl =
    //    document.getElementById(`${link.getAttribute('_target')}-page`);
    //         pgEl.classList.add('show', 'top');
    //         rmActive(link, pgEl);
    //     });
    // }
})();
