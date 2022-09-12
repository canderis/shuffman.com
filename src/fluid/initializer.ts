/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-classes-per-file */
import * as defualts from './defaults';

import { GLProgram } from './GLProgram';
import { Pointer } from './Pointer';
import { getResolution } from './util/get-resolution';
import { getFormats } from './util/get-formats';
import { compileShader } from './util/compile-shader';
import { IShader } from './model/IShader';
import { formShaderPrograms, IShaderPrograms } from './util/form-shader-programs';
import { createTextureAsync } from './util/create-texture';
import { createFBO } from './util/create-fbo';
import { createDoubleFBO } from './util/create-double-fbo';
import { DoubleFBO, IFBO } from './model/IFBO';
import { resizeFBO } from './util/resize-fbo';
import { IColorFormats } from './model/IWebGL';
import Fluid from './fluid';
import { Color } from './model/IColor';
import { generateColor } from './util/generate-color';

let active = false;
const cancel = false;
let ditherURL = './assets/texture.jpg';

interface ITexture {
	texture: WebGLTexture | null;
	width: number;
	height: number;
	attach(id: number): number;
}

let i = 0;

export function activator(
	canvas: HTMLCanvasElement,
	webGL: WebGL2RenderingContext,
	colorFormat: IColorFormats,
	PROGRAMS: IShaderPrograms,
	pointers: Pointer[],
	onLoop?: () => void
) {
	if (active) {
		const nPointers: Pointer[] = [];
		// nPointers.push(new Pointer());
		// eslint-disable-next-line no-param-reassign
		pointers = nPointers;
	}

	active = true;

	/* TODO: Retrieve haul style */
	const PARAMS = defualts.behavior;

	const bloomFrameBuffers: IFBO[] = [];
	const splatStack = [];

	let simWidth: number;
	let simHeight: number;
	let dyeWidth: number;
	let dyeHeight: number;
	let density: DoubleFBO;
	let velocity: DoubleFBO;
	let divergence: IFBO;
	let curl: IFBO;
	let pressure: DoubleFBO;
	let bloom: IFBO;

	const blit = (() => {
		webGL.bindBuffer(webGL.ARRAY_BUFFER, webGL.createBuffer());
		webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), webGL.STATIC_DRAW);

		webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, webGL.createBuffer());
		webGL.bufferData(webGL.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), webGL.STATIC_DRAW);

		webGL.vertexAttribPointer(0, 2, webGL.FLOAT, false, 0, 0);
		webGL.enableVertexAttribArray(0);

		return (destination: WebGLFramebuffer | null) => {
			webGL.bindFramebuffer(webGL.FRAMEBUFFER, destination);
			webGL.drawElements(webGL.TRIANGLES, 6, webGL.UNSIGNED_SHORT, 0);
		};
	})();

	/** Dithering Texture
	 *  Initialize fluid overlay/dither
	 *
	 * @type {{texture: WebGLTexture, width: number, attach(*): *, height: number}}
	 */
	const ditheringTexture = createTextureAsync(ditherURL, webGL);

	/**
	 * Initialize Fluid
	 *  Prepares frame buffers for rendering
	 *
	 */
	function init() {
		/* Color Formats */
		const texType = colorFormat.halfFloatTexType;
		const rgba = colorFormat.formatRGBA;
		const rg = colorFormat.formatRG;
		const r = colorFormat.formatR;
		const filtering = colorFormat.supportLinearFiltering ? webGL.LINEAR : webGL.NEAREST;

		/* Set simulation and pointer width and height */
		const simRes = getResolution(webGL, PARAMS.sim_resolution);
		const dyeRes = getResolution(webGL, PARAMS.dye_resolution);
		const bloomRes = getResolution(webGL, PARAMS.bloom_resolution);

		simWidth = simRes.width;
		simHeight = simRes.height;
		dyeWidth = dyeRes.width;
		dyeHeight = dyeRes.height;

		/* Density, Velocity, and Bloom Double Frame Buffers */
		density = !density
			? createDoubleFBO(dyeWidth, dyeHeight, rgba!.internalFormat, rgba!.format, texType, filtering, webGL)
			: resizeDoubleFBO(density, dyeWidth, dyeHeight, rgba!.internalFormat, rgba!.format, texType, filtering);
		velocity = !velocity
			? createDoubleFBO(simWidth, simHeight, rg!.internalFormat, rg!.format, texType, filtering, webGL)
			: resizeDoubleFBO(velocity, simWidth, simHeight, rg!.internalFormat, rg!.format, texType, filtering);

		bloom = createFBO(
			bloomRes.width,
			bloomRes.height,
			rgba!.internalFormat,
			rgba!.format,
			texType,
			filtering,
			webGL
		);

		/* Divergence, Curl, and Pressure Frame Buffers */
		divergence = createFBO(simWidth, simHeight, r!.internalFormat, r!.format, texType, webGL.NEAREST, webGL);
		curl = createFBO(simWidth, simHeight, r!.internalFormat, r!.format, texType, webGL.NEAREST, webGL);
		pressure = createDoubleFBO(simWidth, simHeight, r!.internalFormat, r!.format, texType, webGL.NEAREST, webGL);

		/* Populate bloom's frame buffer stack by iterating through bloom iterations
		 *  Each iteration, we offset the scale linearly at a constant rate */
		bloomFrameBuffers.length = 0;
		for (let i = 0; i < PARAMS.bloom_iterations; i++) {
			/* Offset scale by a factor of 1 plus our current iteration */
			const width = bloomRes.width >> (i + 1);
			const height = bloomRes.height >> (i + 1);

			/* Don't create frame buffer */
			if (width < 2 || height < 2) break;

			/* Create Frame Buffer for Bloom iterations */
			const fbo = createFBO(width, height, rgba!.internalFormat, rgba!.format, texType, filtering, webGL);
			bloomFrameBuffers.push(fbo);
		}
	}
	/* Initialize Fluid */
	init();
	// multipleSplats();

	/* Game Loop */
	let lastColorChangeTime = Date.now();
	update();

	/* Game Loop */

	function resizeDoubleFBO(
		target: DoubleFBO,
		w: number,
		h: number,
		internalFormat: number,
		format: number,
		type: number,
		param: number
	) {
		target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param, webGL, PROGRAMS, blit);
		target.write = createFBO(w, h, internalFormat, format, type, param, webGL);
		return target;
	}

	function update() {
		resizeCanvas();
		input();
		if (!PARAMS.paused) step(0.016);
		render(null);

		if (onLoop) {
			onLoop();
		}
		const callback = requestAnimationFrame(update);

		// /* Destroys if Deactivated */
		// if (cancelled.is) {
		//     webGL.clear(webGL.COLOR_BUFFER_BIT);
		//     cancelAnimationFrame(callback);
		// }
	}

	function input() {
		if (splatStack.length > 0) multipleSplats();

		for (let i = 0; i < pointers.length; i++) {
			const p = pointers[i];
			if (p.moved) {
				splat(p.x, p.y, p.dx, p.dy, p.color);
				if (i !== 1) p.moved = false;
			}
		}

		if (!PARAMS.multi_color) return;

		if (lastColorChangeTime + 100 < Date.now()) {
			lastColorChangeTime = Date.now();
			for (let i = 0; i < pointers.length; i++) {
				const p = pointers[i];
				p.color = generateColor();
			}
		}
	}

	function step(dt: number) {
		webGL.disable(webGL.BLEND);
		webGL.viewport(0, 0, simWidth, simHeight);

		PROGRAMS.curlProgram.bind();
		webGL.uniform2f(PROGRAMS.curlProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
		webGL.uniform1i(PROGRAMS.curlProgram.uniforms.uVelocity, velocity.read.attach(0));
		blit(curl.fbo);

		PROGRAMS.vorticityProgram.bind();
		webGL.uniform2f(PROGRAMS.vorticityProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
		webGL.uniform1i(PROGRAMS.vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
		webGL.uniform1i(PROGRAMS.vorticityProgram.uniforms.uCurl, curl.attach(1));
		webGL.uniform1f(PROGRAMS.vorticityProgram.uniforms.curl, PARAMS.curl);
		webGL.uniform1f(PROGRAMS.vorticityProgram.uniforms.dt, dt);
		blit(velocity.write.fbo);
		velocity.swap();

		PROGRAMS.divergenceProgram.bind();
		webGL.uniform2f(PROGRAMS.divergenceProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
		webGL.uniform1i(PROGRAMS.divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
		blit(divergence.fbo);

		PROGRAMS.clearProgram.bind();
		webGL.uniform1i(PROGRAMS.clearProgram.uniforms.uTexture, pressure.read.attach(0));
		webGL.uniform1f(PROGRAMS.clearProgram.uniforms.value, PARAMS.pressure);
		blit(pressure.write.fbo);
		pressure.swap();

		PROGRAMS.pressureProgram.bind();
		webGL.uniform2f(PROGRAMS.pressureProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
		webGL.uniform1i(PROGRAMS.pressureProgram.uniforms.uDivergence, divergence.attach(0));
		for (let i = 0; i < PARAMS.pressure_iteration; i++) {
			webGL.uniform1i(PROGRAMS.pressureProgram.uniforms.uPressure, pressure.read.attach(1));
			blit(pressure.write.fbo);
			pressure.swap();
		}

		PROGRAMS.gradientSubtractProgram.bind();
		webGL.uniform2f(PROGRAMS.gradientSubtractProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
		webGL.uniform1i(PROGRAMS.gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
		webGL.uniform1i(PROGRAMS.gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
		blit(velocity.write.fbo);
		velocity.swap();

		PROGRAMS.advectionProgram.bind();
		webGL.uniform2f(PROGRAMS.advectionProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
		if (!colorFormat.supportLinearFiltering)
			webGL.uniform2f(PROGRAMS.advectionProgram.uniforms.dyeTexelSize, 1.0 / simWidth, 1.0 / simHeight);
		const velocityId = velocity.read.attach(0);
		webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uVelocity, velocityId);
		webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uSource, velocityId);
		webGL.uniform1f(PROGRAMS.advectionProgram.uniforms.dt, dt);
		webGL.uniform1f(PROGRAMS.advectionProgram.uniforms.dissipation, PARAMS.velocity);
		blit(velocity.write.fbo);
		velocity.swap();

		webGL.viewport(0, 0, dyeWidth, dyeHeight);

		if (!colorFormat.supportLinearFiltering)
			webGL.uniform2f(PROGRAMS.advectionProgram.uniforms.dyeTexelSize, 1.0 / dyeWidth, 1.0 / dyeHeight);
		webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
		webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uSource, density.read.attach(1));
		webGL.uniform1f(PROGRAMS.advectionProgram.uniforms.dissipation, PARAMS.dissipation);
		blit(density.write.fbo);
		density.swap();
	}

	function render(target: any) {
		if (PARAMS.render_bloom) applyBloom(density.read, bloom);

		if (target == null || !PARAMS.transparent) {
			webGL.blendFunc(webGL.ONE, webGL.ONE_MINUS_SRC_ALPHA);
			webGL.enable(webGL.BLEND);
		} else {
			webGL.disable(webGL.BLEND);
		}

		const width = target == null ? webGL.drawingBufferWidth : dyeWidth;
		const height = target == null ? webGL.drawingBufferHeight : dyeHeight;

		webGL.viewport(0, 0, width, height);

		if (!PARAMS.transparent) {
			PROGRAMS.colorProgram.bind();
			const bc = PARAMS.background_color;
			webGL.uniform4f(PROGRAMS.colorProgram.uniforms.color, bc.r / 255, bc.g / 255, bc.b / 255, 1);
			blit(target);
		}

		if (target == null && PARAMS.transparent) {
			PROGRAMS.backgroundProgram.bind();
			webGL.uniform1f(PROGRAMS.backgroundProgram.uniforms.aspectRatio, canvas.width / canvas.height);
			blit(null);
		}

		if (PARAMS.render_shaders) {
			const program = PARAMS.render_bloom ? PROGRAMS.displayBloomShadingProgram : PROGRAMS.displayShadingProgram;
			program.bind();
			webGL.uniform2f(program.uniforms.texelSize, 1.0 / width, 1.0 / height);
			webGL.uniform1i(program.uniforms.uTexture, density.read.attach(0));
			if (PARAMS.render_bloom) {
				webGL.uniform1i(program.uniforms.uBloom, bloom.attach(1));
				webGL.uniform1i(program.uniforms.uDithering, ditheringTexture.attach(2));
				const scale = getTextureScale(ditheringTexture, width, height);
				webGL.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
			}
		} else {
			const program = PARAMS.render_bloom ? PROGRAMS.displayBloomProgram : PROGRAMS.displayProgram;
			program.bind();
			webGL.uniform1i(program.uniforms.uTexture, density.read.attach(0));
			if (PARAMS.render_bloom) {
				webGL.uniform1i(program.uniforms.uBloom, bloom.attach(1));
				webGL.uniform1i(program.uniforms.uDithering, ditheringTexture.attach(2));
				const scale = getTextureScale(ditheringTexture, width, height);
				webGL.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
			}
		}

		blit(target);
	}

	function applyBloom(source: IFBO, destination: IFBO) {
		if (bloomFrameBuffers.length < 2) return;

		let last = destination;

		webGL.disable(webGL.BLEND);
		PROGRAMS.bloomPreFilterProgram.bind();
		const knee = PARAMS.threshold * PARAMS.soft_knee + 0.0001;
		const curve0 = PARAMS.threshold - knee;
		const curve1 = knee * 2;
		const curve2 = 0.25 / knee;
		webGL.uniform3f(PROGRAMS.bloomPreFilterProgram.uniforms.curve, curve0, curve1, curve2);
		webGL.uniform1f(PROGRAMS.bloomPreFilterProgram.uniforms.threshold, PARAMS.threshold);
		webGL.uniform1i(PROGRAMS.bloomPreFilterProgram.uniforms.uTexture, source.attach(0));
		webGL.viewport(0, 0, last.width, last.height);
		blit(last.fbo);

		PROGRAMS.bloomBlurProgram.bind();
		for (let i = 0; i < bloomFrameBuffers.length; i++) {
			const dest = bloomFrameBuffers[i];
			webGL.uniform2f(PROGRAMS.bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
			webGL.uniform1i(PROGRAMS.bloomBlurProgram.uniforms.uTexture, last.attach(0));
			webGL.viewport(0, 0, dest.width, dest.height);
			blit(dest.fbo);
			last = dest;
		}

		webGL.blendFunc(webGL.ONE, webGL.ONE);
		webGL.enable(webGL.BLEND);

		for (let i = bloomFrameBuffers.length - 2; i >= 0; i--) {
			const baseTex = bloomFrameBuffers[i];
			webGL.uniform2f(PROGRAMS.bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
			webGL.uniform1i(PROGRAMS.bloomBlurProgram.uniforms.uTexture, last.attach(0));
			webGL.viewport(0, 0, baseTex.width, baseTex.height);
			blit(baseTex.fbo);
			last = baseTex;
		}

		webGL.disable(webGL.BLEND);
		PROGRAMS.bloomFinalProgram.bind();
		webGL.uniform2f(PROGRAMS.bloomFinalProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
		webGL.uniform1i(PROGRAMS.bloomFinalProgram.uniforms.uTexture, last.attach(0));
		webGL.uniform1f(PROGRAMS.bloomFinalProgram.uniforms.intensity, PARAMS.intensity);
		webGL.viewport(0, 0, destination.width, destination.height);
		blit(destination.fbo);
	}

	function splat(x: number, y: number, dx: number, dy: number, color: Color) {
		webGL.viewport(0, 0, simWidth, simHeight);
		PROGRAMS.splatProgram.bind();
		webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, velocity.read.attach(0));
		webGL.uniform1f(PROGRAMS.splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
		webGL.uniform2f(PROGRAMS.splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
		webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, dx, -dy, 1.0);
		webGL.uniform1f(PROGRAMS.splatProgram.uniforms.radius, PARAMS.emitter_size / 100.0);
		blit(velocity.write.fbo);
		velocity.swap();

		webGL.viewport(0, 0, dyeWidth, dyeHeight);
		webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, density.read.attach(0));
		webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, color.r, color.g, color.b);
		blit(density.write.fbo);
		density.swap();
	}

	function multipleSplats() {
		const color: Color = {
			r: 255,
			b: 0,
			g: 0,
		};

		splat(500, 500, 100, 0, color);
	}

	function resizeCanvas() {
		if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			init();
		}
	}

	function getTextureScale(texture: ITexture, width: number, height: number) {
		return {
			x: width / texture.width,
			y: height / texture.height,
		};
	}

	canvas.addEventListener('mousemove', (e) => {
		// pointers[0].moved = pointers[0].down;
		// pointers[0].dx = (e.offsetX - pointers[0].x) * 5.0;
		// pointers[0].dy = (e.offsetY - pointers[0].y) * 5.0;
		pointers[0].x = e.offsetX;
		pointers[0].y = e.offsetY;
	});

	// canvas.addEventListener('mousedown', () => {
	// 	pointers[0].down = true;
	// 	pointers[0].color = generateColor();
	// });

	// window.addEventListener('mouseup', () => {
	// 	pointers[0].down = false;
	// });

	window.addEventListener('keydown', (e) => {
		if (e.code === 'KeyP') PARAMS.paused = !PARAMS.paused;
		if (e.key === ' ') splatStack.push(parseInt(`${Math.random() * 20}`, 10) + 5);
	});
}

/**
 * Set Dither URL
 *  Sets the URL to an image to be used for dithering.
 *
 * @param url: Path to dither in root directory.
 */
export function setDitherURL(url: string) {
	ditherURL = url;
}
