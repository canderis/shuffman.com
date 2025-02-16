/* eslint-disable no-underscore-dangle */
/* eslint-disable no-fallthrough */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-param-reassign */
/* Refs
https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
 */

import type { Behavior } from './defaults';
import { behavior, setBehaviors } from './defaults';
import type { Color } from './model/IColor';
import type { DoubleFBO, IFBO } from './model/IFBO';
import type { IColorFormats } from './model/IWebGL';
import type { Pointer } from './Pointer';
import { createDoubleFBO } from './util/create-double-fbo';
import { createFBO } from './util/create-fbo';
import { createTextureAsync } from './util/create-texture';
import type { IShaderPrograms } from './util/form-shader-programs';
import { generateColor } from './util/generate-color';
import { getResolution } from './util/get-resolution';
import { initWebGL } from './util/init-webgl';
import { resizeDoubleFBO } from './util/resize-double-fbo';

interface ITexture {
	texture: WebGLTexture | null;
	width: number;
	height: number;
	attach(id: number): number;
}

export default class Fluid {
	PARAMS: Behavior;

	canvas: HTMLCanvasElement;

	webGL: WebGL2RenderingContext;

	colorFormats: IColorFormats;

	pointers: Pointer[];

	ditherURL = './assets/texture.jpg';

	private onLoop: (params: Fluid) => void;
	lastColorChangeTime: number;

	/** Dithering Texture
		 *  Initialize fluid overlay/dither
		 *
		 * @type {{texture: WebGLTexture, width: number, attach(*): *, height: number}}
		 */
	ditheringTexture: {
		texture: WebGLTexture
		/* eslint-disable no-fallthrough */
		/* eslint-disable class-methods-use-this */
		/* eslint-disable @typescript-eslint/no-empty-function */
		/* eslint-disable no-param-reassign */
		/* Refs
		https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
		 */
		| null; width: number; height: number; attach(id: number): number;
	};

	constructor(canvas: HTMLCanvasElement, onLoop: (params: Fluid) => void) {
		this.PARAMS = behavior;
		this.canvas = canvas;

		this.onLoop = onLoop;

		/* Set canvas to desired width and height
           TODO: Change to dynamic sizing  */
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		const { programs, webGL, colorFormats, pointers } = initWebGL(this.canvas);
		this.PROGRAMS = programs;
		this.webGL = webGL;
		this.colorFormats = colorFormats;
		this.pointers = pointers;
		this.ditheringTexture = createTextureAsync(this.ditherURL, webGL);

		this.lastColorChangeTime = Date.now();
	}

	/**
	 * Activate Fluid Canvas
	 *  Initiates WebGL fluid loop.
	 *
	 *  TODO: Finish commenting
	 *
	 */
	activate() {
		this.activator();
	}

	/**
	 * Deactivate Fluid Canvas
	 *  Notifies active fluid canvas to clear buffers and erase fluid from call stack.
	 *
	 */
	deactivate() {}

	/**
	 * Reset Fluid Simulation
	 *  Re-initializes WebGL context and activates simulation based on new context.
	 *
	 */
	reset() {
		initWebGL(this.canvas);
		this.activate();
	}

	/**
	 * Map Fluid Behaviors
	 *  Uses spread operators to add parameter values only in the places specified.
	 *
	 * @param params: specific parameter value.
	 *
	 */
	mapBehaviors(params: Behavior) {
		this.PARAMS = { ...this.PARAMS, ...params };
		setBehaviors(this.PARAMS);
	}

	/**
	 * Set Fluid as Background
	 *  Pushes canvas back in z space and absolutely positions it.
	 *
	 * @param shouldSet: true sets it, false un-sets it. Defaults to true.
	 *
	 */
	setAsBackground(shouldSet = true) {
		/* Pushes back in Z Index */
		this.canvas.style.zIndex = shouldSet ? '-99' : '0';

		/* Position Absolutely */
		this.canvas.style.position = shouldSet ? 'absolute' : 'relative';
	}

	/** Set to Gradient
	 *  Sets canvas background value to desired gradient.
	 */
	applyGradientBackground(
		value: string,
		style: 'radial' | 'conic' | 'repeating-linear' | 'repeating-radial' | 'linear',
		canvas = this.canvas
	) {
		/* Make transparent */
		this.PARAMS.transparent = true;
		/** Gradient
		 *  Holds the gradient css statement.
		 *
		 * @type {string}
		 */
		let _gradient = '';
		//
		/* Configure Gradient to Options */
		switch (style) {
			case 'radial':
				_gradient = `radial-gradient(${value})`;
				break;
			case 'conic':
				_gradient = `conic-gradient(${value})`;
				break;
			case 'repeating-linear':
				_gradient = `repeating-linear-gradient(${value})`;
				break;
			case 'repeating-radial':
				_gradient = `repeating-radial-gradient(${value})`;
				break;
			case 'linear':
			default:
				_gradient = `linear-gradient(${value})`;
		}

		/* Set Gradient Dom Style */
		canvas.style.backgroundImage = _gradient;
		/* Reset WebGL */
		this.reset();
	}

	/** Set to Image
	 *  Sets canvas background image value to desired image and configure styles.
	 */
	applyImageBackground(
		value: string,
		options?: { repeat: boolean; position: string; size: string; color: string },
		canvas = this.canvas
	) {
		/* Make transparent */
		this.PARAMS.transparent = true;
		/* Set background image to desired URL, throw error if invalid URL */
		canvas.style.backgroundImage = `url('${value}')`;

		/* Modify CSS Properties */

		/* Set Repeat */
		canvas.style.backgroundRepeat = options?.repeat ? 'repeat' : 'no-repeat';

		/* Set Position */
		canvas.style.backgroundPosition = options?.position ? options.position : 'center';

		/* Set Size */
		canvas.style.backgroundSize = options?.size ? options.size : 'contain';

		/* Set Color */
		canvas.style.backgroundColor = options?.color ? options.color : 'none';

		/* Reset WebGL */
		this.reset();
	}

	/**
	 * Apply Background
	 *  Sets fluid canvas's background and resets view.
	 *
	 * @param type: Image, Gradient, or Solid. The type of background to be applied.
	 * @param value: The value to apply to the image type.
	 * @param options: Additional options to configure background (optional)
	 *
	 * @param canvas
	 */
	// applyBackground(type: 'gradient' | 'image' | 'solid', value: string, options: | null = null, canvas = this.canvas) {
	// 	/* Make transparent */
	// 	this.PARAMS.transparent = true;

	// 	/* Check for Background Type */
	// 	switch (type) {
	// 		case 'gradient':
	// 			gradient();
	// 			break;
	// 		case 'image':
	// 			image();
	// 			break;
	// 		case 'solid':
	// 		/* Make Opaque Background and Set Color
	// 		 *  value must be in { r: red, b: blue, g: green } format
	// 		 *
	// 		 *  Best way to change background color:
	// 		 *
	// 		 *  yourFluid.PARAM.BACK_COLOR.R = red;
	// 		 *  yourFluid.PARAM.BACK_COLOR.G = blue;
	// 		 *  yourFluid.PARAM.BACK_COLOR.B = green;
	// 		 *
	// 		 *  or
	// 		 *
	// 		 *  let color = {
	// 		 *       r: red,
	// 		 *       b: blue,
	// 		 *       g: green
	// 		 *   };
	// 		 *
	// 		 *   yourFluid.PARAM.BACK_COLOR = color;
	// 		 * */
	// 		default:
	// 			this.PARAMS.transparent = false;
	// 			this.PARAMS.background_color = value as any;
	// 	}

	// 	/* Reset WebGL */
	// 	this.reset();
	// }

	/**
	 * Set Dither URL
	 *  Sets the URL to an image to be used for dithering. This method is only responsible for calling
	 *  the action in the initializer. The dither will not be applied until the next activation call.
	 *
	 * @param url: Path to dither in root directory.
	 */
	setDitherURL(url: string) {
		this.ditherURL = url;
	}

	active: boolean = false;
	bloomFrameBuffers: IFBO[] = [];
	splatStack: number[] = [];

	simWidth: number = 0;
	simHeight: number = 0;
	dyeWidth: number = 0;
	dyeHeight: number = 0;

	density: DoubleFBO;
	velocity: DoubleFBO;
	divergence?: IFBO;
	curl?: IFBO;
	pressure?: DoubleFBO;
	bloom?: IFBO;

	// PARAMS = defualts.behavior;

	blit = (() => {
		this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, this.webGL.createBuffer());
		this.webGL.bufferData(
			this.webGL.ARRAY_BUFFER,
			new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
			this.webGL.STATIC_DRAW
		);

		this.webGL.bindBuffer(this.webGL.ELEMENT_ARRAY_BUFFER, this.webGL.createBuffer());
		this.webGL.bufferData(
			this.webGL.ELEMENT_ARRAY_BUFFER,
			new Uint16Array([0, 1, 2, 0, 2, 3]),
			this.webGL.STATIC_DRAW
		);

		this.webGL.vertexAttribPointer(0, 2, this.webGL.FLOAT, false, 0, 0);
		this.webGL.enableVertexAttribArray(0);

		return (destination: WebGLFramebuffer | null) => {
			this.webGL.bindFramebuffer(this.webGL.FRAMEBUFFER, destination);
			this.webGL.drawElements(this.webGL.TRIANGLES, 6, this.webGL.UNSIGNED_SHORT, 0);
		};
	})();

	update() {
		this.resizeCanvas();
		this.input();
		if (!this.PARAMS.paused) this.step(0.016);
		this.render(null);

		if (this.onLoop) {
			this.onLoop(this);
		}
		const callback = requestAnimationFrame(this.update);

		// /* Destroys if Deactivated */
		// if (cancelled.is) {
		//     webGL.clear(webGL.COLOR_BUFFER_BIT);
		//     cancelAnimationFrame(callback);
		// }
	}

	input() {
		if (this.splatStack.length > 0) this.multipleSplats();

		for (let i = 0; i < this.pointers.length; i++) {
			const p = this.pointers[i];
			if (p.moved) {
				this.splat(p.x, p.y, p.dx, p.dy, p.color);
				if (i !== 1) p.moved = false;
			}
		}

		if (!this.PARAMS.multi_color) return;

		if (this.lastColorChangeTime + 100 < Date.now()) {
			this.lastColorChangeTime = Date.now();
			for (let i = 0; i < this.pointers.length; i++) {
				const p = this.pointers[i];
				p.color = generateColor();
			}
		}
	}

	step(dt: number) {
		this.webGL.disable(this.webGL.BLEND);
		this.webGL.viewport(0, 0, this.simWidth, this.simHeight);

		this.PROGRAMS.curlProgram.bind();
		this.webGL.uniform2f(this.PROGRAMS.curlProgram.uniforms.texelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
		this.webGL.uniform1i(this.PROGRAMS.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0));
		this.blit(this.curl.fbo);

		this.PROGRAMS.vorticityProgram.bind();
		this.webGL.uniform2f(
			this.PROGRAMS.vorticityProgram.uniforms.texelSize,
			1.0 / this.simWidth,
			1.0 / this.simHeight
		);
		this.webGL.uniform1i(this.PROGRAMS.vorticityProgram.uniforms.uVelocity, this.velocity.read.attach(0));
		this.webGL.uniform1i(this.PROGRAMS.vorticityProgram.uniforms.uCurl, this.curl.attach(1));
		this.webGL.uniform1f(this.PROGRAMS.vorticityProgram.uniforms.curl, this.PARAMS.curl);
		this.webGL.uniform1f(this.PROGRAMS.vorticityProgram.uniforms.dt, dt);
		this.blit(this.velocity.write.fbo);
		this.velocity.swap();

		this.PROGRAMS.divergenceProgram.bind();
		this.webGL.uniform2f(
			this.PROGRAMS.divergenceProgram.uniforms.texelSize,
			1.0 / this.simWidth,
			1.0 / this.simHeight
		);
		this.webGL.uniform1i(this.PROGRAMS.divergenceProgram.uniforms.uVelocity, this.velocity.read.attach(0));
		this.blit(this.divergence.fbo);

		this.PROGRAMS.clearProgram.bind();
		this.webGL.uniform1i(this.PROGRAMS.clearProgram.uniforms.uTexture, this.pressure.read.attach(0));
		this.webGL.uniform1f(this.PROGRAMS.clearProgram.uniforms.value, this.PARAMS.pressure);
		this.blit(this.pressure.write.fbo);
		this.pressure.swap();

		this.PROGRAMS.pressureProgram.bind();
		this.webGL.uniform2f(
			this.PROGRAMS.pressureProgram.uniforms.texelSize,
			1.0 / this.simWidth,
			1.0 / this.simHeight
		);
		this.webGL.uniform1i(this.PROGRAMS.pressureProgram.uniforms.uDivergence, this.divergence.attach(0));
		for (let i = 0; i < this.PARAMS.pressure_iteration; i++) {
			this.webGL.uniform1i(this.PROGRAMS.pressureProgram.uniforms.uPressure, this.pressure.read.attach(1));
			this.blit(this.pressure.write.fbo);
			this.pressure.swap();
		}

		this.PROGRAMS.gradientSubtractProgram.bind();
		this.webGL.uniform2f(
			this.PROGRAMS.gradientSubtractProgram.uniforms.texelSize,
			1.0 / this.simWidth,
			1.0 / this.simHeight
		);
		this.webGL.uniform1i(this.PROGRAMS.gradientSubtractProgram.uniforms.uPressure, this.pressure.read.attach(0));
		this.webGL.uniform1i(this.PROGRAMS.gradientSubtractProgram.uniforms.uVelocity, this.velocity.read.attach(1));
		this.blit(this.velocity.write.fbo);
		this.velocity.swap();

		this.PROGRAMS.advectionProgram.bind();
		this.webGL.uniform2f(
			this.PROGRAMS.advectionProgram.uniforms.texelSize,
			1.0 / this.simWidth,
			1.0 / this.simHeight
		);
		if (!colorFormat.supportLinearFiltering)
			this.webGL.uniform2f(
				this.PROGRAMS.advectionProgram.uniforms.dyeTexelSize,
				1.0 / this.simWidth,
				1.0 / this.simHeight
			);
		const velocityId = this.velocity.read.attach(0);
		this.webGL.uniform1i(this.PROGRAMS.advectionProgram.uniforms.uVelocity, velocityId);
		this.webGL.uniform1i(this.PROGRAMS.advectionProgram.uniforms.uSource, velocityId);
		this.webGL.uniform1f(this.PROGRAMS.advectionProgram.uniforms.dt, dt);
		this.webGL.uniform1f(this.PROGRAMS.advectionProgram.uniforms.dissipation, this.PARAMS.velocity);
		this.blit(this.velocity.write.fbo);
		this.velocity.swap();

		this.webGL.viewport(0, 0, this.dyeWidth, this.dyeHeight);

		if (!colorFormat.supportLinearFiltering)
			this.webGL.uniform2f(
				this.PROGRAMS.advectionProgram.uniforms.dyeTexelSize,
				1.0 / this.dyeWidth,
				1.0 / this.dyeHeight
			);
		this.webGL.uniform1i(this.PROGRAMS.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
		this.webGL.uniform1i(this.PROGRAMS.advectionProgram.uniforms.uSource, this.density.read.attach(1));
		this.webGL.uniform1f(this.PROGRAMS.advectionProgram.uniforms.dissipation, this.PARAMS.dissipation);
		this.blit(this.density.write.fbo);
		this.density.swap();
	}

	render(target: any) {
		if (this.PARAMS.render_bloom) this.applyBloom(this.density.read, this.bloom);

		if (target == null || !this.PARAMS.transparent) {
			this.webGL.blendFunc(this.webGL.ONE, this.webGL.ONE_MINUS_SRC_ALPHA);
			this.webGL.enable(this.webGL.BLEND);
		} else {
			this.webGL.disable(this.webGL.BLEND);
		}

		const width = target == null ? this.webGL.drawingBufferWidth : this.dyeWidth;
		const height = target == null ? this.webGL.drawingBufferHeight : this.dyeHeight;

		this.webGL.viewport(0, 0, width, height);

		if (!this.PARAMS.transparent) {
			this.PROGRAMS.colorProgram.bind();
			const bc = this.PARAMS.background_color;
			this.webGL.uniform4f(this.PROGRAMS.colorProgram.uniforms.color, bc.r / 255, bc.g / 255, bc.b / 255, 1);
			this.blit(target);
		}

		if (target == null && this.PARAMS.transparent) {
			this.PROGRAMS.backgroundProgram.bind();
			this.webGL.uniform1f(
				this.PROGRAMS.backgroundProgram.uniforms.aspectRatio,
				this.canvas.width / this.canvas.height
			);
			this.blit(null);
		}

		if (this.PARAMS.render_shaders) {
			const program = this.PARAMS.render_bloom
				? this.PROGRAMS.displayBloomShadingProgram
				: this.PROGRAMS.displayShadingProgram;
			program.bind();
			this.webGL.uniform2f(program.uniforms.texelSize, 1.0 / width, 1.0 / height);
			this.webGL.uniform1i(program.uniforms.uTexture, this.density.read.attach(0));
			if (this.PARAMS.render_bloom) {
				this.webGL.uniform1i(program.uniforms.uBloom, this.bloom.attach(1));
				this.webGL.uniform1i(program.uniforms.uDithering, ditheringTexture.attach(2));
				const scale = this.getTextureScale(ditheringTexture, width, height);
				this.webGL.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
			}
		} else {
			const program = this.PARAMS.render_bloom ? this.PROGRAMS.displayBloomProgram : this.PROGRAMS.displayProgram;
			program.bind();
			this.webGL.uniform1i(program.uniforms.uTexture, this.density.read.attach(0));
			if (this.PARAMS.render_bloom) {
				this.webGL.uniform1i(program.uniforms.uBloom, this.bloom.attach(1));
				this.webGL.uniform1i(program.uniforms.uDithering, ditheringTexture.attach(2));
				const scale = this.getTextureScale(ditheringTexture, width, height);
				this.webGL.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
			}
		}

		this.blit(target);
	}

	applyBloom(source: IFBO, destination: IFBO) {
		if (this.bloomFrameBuffers.length < 2) return;

		let last = destination;

		this.webGL.disable(this.webGL.BLEND);
		this.PROGRAMS.bloomPreFilterProgram.bind();
		const knee = this.PARAMS.threshold * this.PARAMS.soft_knee + 0.0001;
		const curve0 = this.PARAMS.threshold - knee;
		const curve1 = knee * 2;
		const curve2 = 0.25 / knee;
		this.webGL.uniform3f(this.PROGRAMS.bloomPreFilterProgram.uniforms.curve, curve0, curve1, curve2);
		this.webGL.uniform1f(this.PROGRAMS.bloomPreFilterProgram.uniforms.threshold, this.PARAMS.threshold);
		this.webGL.uniform1i(this.PROGRAMS.bloomPreFilterProgram.uniforms.uTexture, source.attach(0));
		this.webGL.viewport(0, 0, last.width, last.height);
		this.blit(last.fbo);

		this.PROGRAMS.bloomBlurProgram.bind();
		for (let i = 0; i < this.bloomFrameBuffers.length; i++) {
			const dest = this.bloomFrameBuffers[i];
			this.webGL.uniform2f(
				this.PROGRAMS.bloomBlurProgram.uniforms.texelSize,
				1.0 / last.width,
				1.0 / last.height
			);
			this.webGL.uniform1i(this.PROGRAMS.bloomBlurProgram.uniforms.uTexture, last.attach(0));
			this.webGL.viewport(0, 0, dest.width, dest.height);
			this.blit(dest.fbo);
			last = dest;
		}

		this.webGL.blendFunc(this.webGL.ONE, this.webGL.ONE);
		this.webGL.enable(this.webGL.BLEND);

		for (let i = this.bloomFrameBuffers.length - 2; i >= 0; i--) {
			const baseTex = this.bloomFrameBuffers[i];
			this.webGL.uniform2f(
				this.PROGRAMS.bloomBlurProgram.uniforms.texelSize,
				1.0 / last.width,
				1.0 / last.height
			);
			this.webGL.uniform1i(this.PROGRAMS.bloomBlurProgram.uniforms.uTexture, last.attach(0));
			this.webGL.viewport(0, 0, baseTex.width, baseTex.height);
			this.blit(baseTex.fbo);
			last = baseTex;
		}

		this.webGL.disable(this.webGL.BLEND);
		this.PROGRAMS.bloomFinalProgram.bind();
		this.webGL.uniform2f(this.PROGRAMS.bloomFinalProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
		this.webGL.uniform1i(this.PROGRAMS.bloomFinalProgram.uniforms.uTexture, last.attach(0));
		this.webGL.uniform1f(this.PROGRAMS.bloomFinalProgram.uniforms.intensity, this.PARAMS.intensity);
		this.webGL.viewport(0, 0, destination.width, destination.height);
		this.blit(destination.fbo);
	}

	PROGRAMS: IShaderPrograms;

	activator() {
		if (this.active) {
			const nPointers: Pointer[] = [];
			// nPointers.push(new Pointer());
			// eslint-disable-next-line no-param-reassign
			this.pointers = nPointers;
		}

		this.active = true;

		/* TODO: Retrieve haul style */



		/* Initialize Fluid */
		this.init();
		// multipleSplats();

		/* Game Loop */
		this.lastColorChangeTime = Date.now();
		this.update();

		/* Game Loop */

		// canvas.addEventListener('mousedown', () => {
		// 	pointers[0].down = true;
		// 	pointers[0].color = generateColor();
		// });

		// window.addEventListener('mouseup', () => {
		// 	pointers[0].down = false;
		// });
	}

	/**
	 * Initialize Fluid
	 *  Prepares frame buffers for rendering
	 *
	 */
	init() {
		/* Color Formats */
		const texType = this.colorFormats.halfFloatTexType;
		const rgba = this.colorFormats.formatRGBA;
		const rg = this.colorFormats.formatRG;
		const r = this.colorFormats.formatR;
		const filtering = this.colorFormats.supportLinearFiltering ? this.webGL.LINEAR : this.webGL.NEAREST;

		/* Set simulation and pointer width and height */
		const simRes = getResolution(this.webGL, this.PARAMS.sim_resolution);
		const dyeRes = getResolution(this.webGL, this.PARAMS.dye_resolution);
		const bloomRes = getResolution(this.webGL, this.PARAMS.bloom_resolution);

		this.simWidth = simRes.width;
		this.simHeight = simRes.height;
		this.dyeWidth = dyeRes.width;
		this.dyeHeight = dyeRes.height;

		/* Density, Velocity, and Bloom Double Frame Buffers */
		this.density = !this.density
			? createDoubleFBO(
					this.dyeWidth,
					this.dyeHeight,
					rgba!.internalFormat,
					rgba!.format,
					texType,
					filtering,
					this.webGL
			  )
			: resizeDoubleFBO(
					this.density,
					this.dyeWidth,
					this.dyeHeight,
					rgba!.internalFormat,
					rgba!.format,
					texType,
					filtering,
					this.webGL,
					this.PROGRAMS,
					this.blit
			  );
		this.velocity = !this.velocity
			? createDoubleFBO(
					this.simWidth,
					this.simHeight,
					rg!.internalFormat,
					rg!.format,
					texType,
					filtering,
					this.webGL
			  )
			: resizeDoubleFBO(
					this.velocity,
					this.simWidth,
					this.simHeight,
					rg!.internalFormat,
					rg!.format,
					texType,
					filtering,
					this.webGL,
					this.PROGRAMS,
					this.blit
			  );

		this.bloom = createFBO(
			bloomRes.width,
			bloomRes.height,
			rgba!.internalFormat,
			rgba!.format,
			texType,
			filtering,
			this.webGL
		);

		/* Divergence, Curl, and Pressure Frame Buffers */
		this.divergence = createFBO(
			this.simWidth,
			this.simHeight,
			r!.internalFormat,
			r!.format,
			texType,
			this.webGL.NEAREST,
			this.webGL
		);
		this.curl = createFBO(
			this.simWidth,
			this.simHeight,
			r!.internalFormat,
			r!.format,
			texType,
			this.webGL.NEAREST,
			this.webGL
		);
		this.pressure = createDoubleFBO(
			this.simWidth,
			this.simHeight,
			r!.internalFormat,
			r!.format,
			texType,
			this.webGL.NEAREST,
			this.webGL
		);

		/* Populate bloom's frame buffer stack by iterating through bloom iterations
		 *  Each iteration, we offset the scale linearly at a constant rate */
		this.bloomFrameBuffers.length = 0;
		for (let i = 0; i < this.PARAMS.bloom_iterations; i++) {
			/* Offset scale by a factor of 1 plus our current iteration */
			const width = bloomRes.width >> (i + 1);
			const height = bloomRes.height >> (i + 1);

			/* Don't create frame buffer */
			if (width < 2 || height < 2) break;

			/* Create Frame Buffer for Bloom iterations */
			const fbo = createFBO(width, height, rgba!.internalFormat, rgba!.format, texType, filtering, this.webGL);
			this.bloomFrameBuffers.push(fbo);
		}
	}

	splat(x: number, y: number, dx: number, dy: number, color: Color) {
		this.webGL.viewport(0, 0, this.simWidth, this.simHeight);
		this.PROGRAMS.splatProgram.bind();
		this.webGL.uniform1i(this.PROGRAMS.splatProgram.uniforms.uTarget, this.velocity.read.attach(0));
		this.webGL.uniform1f(this.PROGRAMS.splatProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
		this.webGL.uniform2f(
			this.PROGRAMS.splatProgram.uniforms.point,
			x / this.canvas.width,
			1.0 - y / this.canvas.height
		);
		this.webGL.uniform3f(this.PROGRAMS.splatProgram.uniforms.color, dx, -dy, 1.0);
		this.webGL.uniform1f(this.PROGRAMS.splatProgram.uniforms.radius, this.PARAMS.emitter_size / 100.0);
		this.blit(this.velocity.write.fbo);
		this.velocity.swap();

		this.webGL.viewport(0, 0, this.dyeWidth, this.dyeHeight);
		this.webGL.uniform1i(this.PROGRAMS.splatProgram.uniforms.uTarget, this.density.read.attach(0));
		this.webGL.uniform3f(this.PROGRAMS.splatProgram.uniforms.color, color.r, color.g, color.b);
		this.blit(this.density.write.fbo);
		this.density.swap();
	}

	multipleSplats() {
		const color: Color = {
			r: 255,
			b: 0,
			g: 0,
		};

		this.splat(500, 500, 100, 0, color);
	}

	getTextureScale(texture: ITexture, width: number, height: number) {
		return {
			x: width / texture.width,
			y: height / texture.height,
		};
	}

	resizeCanvas() {
		if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
			this.canvas.width = this.canvas.clientWidth;
			this.canvas.height = this.canvas.clientHeight;
			this.init();
		}
	}
}
