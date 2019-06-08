"use strict";

import smoke from "./images/cloud1.png";
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
} from "three";

class Background {
	constructor(hook) {
		this.runAnimate = true;
		this.hook = hook;
	}

	build() {
		const between = (function() {
			const SEED = 5;

			let mw = 123456789;
			let mz = 987654321;
			const mask = 0xffffffff;

			(i => {
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
				return Math.floor(random() * (max - min + 1) + min);
			};
		})();

		const renderer = new WebGLRenderer({ alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		const scene = new Scene();

		const camera = new PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			1,
			10000
		);

		camera.position.z = 1000;
		scene.add(camera);

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
			0x0096d1
		];

		const materials = [];
		for (let i = 0; i < colors.length; i++) {
			materials.push(
				new MeshLambertMaterial({
					emissive: colors[i],
					color: colors[i],
					emissiveIntensity: 0.5,
					map: texture,
					transparent: true
				})
			);
			materials.push(
				new MeshLambertMaterial({
					emissive: colors[i],
					color: colors[i],
					emissiveIntensity: 0.3,
					map: texture,
					transparent: true
				})
			);
		}

		const lim = Math.floor(
			(x => {
				return 30 + 0.01190006 * x + 0.0000311615 * Math.pow(x, 2);
			})(window.innerWidth)
		);

		const particles = [];
		const geo = new PlaneGeometry(1024, 512);
		for (let p = 0; p < lim; p++) {
			const particle = new Mesh(geo, materials[p % materials.length]);

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
			requestAnimationFrame(animate);

			if (this.runAnimate) {
				const delta = clock.getDelta();
				particles.forEach(particle => {
					particle.rotation.z += delta * 0.2;
				});
			}
			renderer.render(scene, camera);
		};

		document.getElementById(this.hook).appendChild(renderer.domElement);

		animate();
	}
}

export default Background;
