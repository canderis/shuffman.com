"use strict";

import smoke from "./images/cloud1.png";
import {
	Clock,
	WebGLRenderer,
	Scene,
	PlaneGeometry,
	TextureLoader,
	MeshLambertMaterial,
	Mesh,
	Color,
	PerspectiveCamera,
	PointLight,
	MeshPhongMaterial
} from "three";

class Background {
	constructor(hook) {
		this.runAnimate = true;
		this.hook = hook;

		this.width = window.innerWidth;
		this.height = window.innerHeight;
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
		renderer.setSize(this.width, this.height);

		const scene = new Scene();
		scene.background = new Color(0x000000);

		const camera = new PerspectiveCamera(
			60,
			this.width / this.height,
			0.1,
			10000
		);
		camera.position.set(0, 200, 1000);
		scene.add(camera);

		const light1 = new PointLight(0xbb32a1, 1, 3000, 2);
		light1.position.set(-800, 200, -300);
		scene.add(light1);

		const light2 = new PointLight(0xbb32a1, 1, 3000, 2);
		light2.position.set(800, 200, -300);
		scene.add(light2);

		const light4 = new PointLight(0x579d9c, 1, 3000, 2);
		light4.position.set(-400, 200, -400);
		scene.add(light4);

		const light5 = new PointLight(0x579d9c, 1, 3000, 2);
		light5.position.set(400, 200, -400);
		scene.add(light5);

		const light3 = new PointLight(0xf9557b, 1, 3000, 2);
		light3.position.set(0, 200, -500);
		scene.add(light3);

		const texture = new TextureLoader().load(smoke);

		const sphereMaterial = new MeshPhongMaterial({
			color: 0xbb32a1,
			shininess: 100,
			specular: 0x050505
		});

		const floor = new Mesh(new PlaneGeometry(10000, 10000), sphereMaterial);

		floor.rotateX(-Math.PI / 2);

		floor.position.z = 0;
		floor.position.y = 0;

		scene.add(floor);

		const colors = [
			0x579d9c,
			0xbb32a1,
			0xf9557b,
			0x579d9c,
			0xbb32a1,
			0xf9557b,
			0xfa9f6b
		];

		const materials = [];
		for (let i = 0; i < colors.length; i++) {
			materials.push(
				new MeshLambertMaterial({
					emissive: colors[i],
					color: colors[i],
					emissiveIntensity: 0.5,
					map: texture,
					transparent: true,
					opacity: 0.3
				})
			);
			materials.push(
				new MeshLambertMaterial({
					emissive: colors[i],
					color: colors[i],
					emissiveIntensity: 0.3,
					map: texture,
					transparent: true,
					opacity: 0.3
				})
			);
		}

		const lim = Math.floor(
			(x => {
				return 30 + 0.01190006 * x + 0.0000311615 * Math.pow(x, 2);
			})(this.width)
		);

		const particles = [];
		const geo = new PlaneGeometry(1024, 512);
		for (let p = 0; p < lim; p++) {
			const particle = new Mesh(geo, materials[p % materials.length]);

			particle.position.set(
				between(-this.width - 256, this.width + 256),
				between(0, 500),
				between(0, 1000)
			);

			particle.rotation.z = between(0, 360);
			scene.add(particle);
			particles.push(particle);
		}

		const clock = new Clock();
		this.animate = () => {
			if (this.runAnimate) {
				requestAnimationFrame(this.animate);

				const delta = clock.getDelta();
				particles.forEach(particle => {
					particle.rotation.z += delta * 0.2;
				});

				renderer.render(scene, camera);
			}
		};

		document.getElementById(this.hook).appendChild(renderer.domElement);

		this.animate();
	}
}

export default Background;
