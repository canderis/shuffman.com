/* eslint-disable no-underscore-dangle */
/* eslint-disable no-fallthrough */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-param-reassign */
/* Refs
https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
 */

import { Behavior, behavior, setBehaviors } from './defaults';
import { activator, setDitherURL } from './initializer';
import { IColorFormats } from './model/IWebGL';
import { Pointer } from './Pointer';
import { IShaderPrograms } from './util/form-shader-programs';
import { initWebGL } from './util/init-webgl';

export default class Fluid {
	PARAMS: Behavior;

	canvas: HTMLCanvasElement;

	programs: IShaderPrograms;

	webGL: WebGL2RenderingContext;

	colorFormats: IColorFormats;

	pointers: Pointer[];

	private onLoop: (params: Fluid) => void;

	constructor(canvas: HTMLCanvasElement, onLoop: (params: Fluid) => void) {
		this.PARAMS = behavior;
		this.canvas = canvas;

		this.onLoop = onLoop;

		/* Set canvas to desired width and height
           TODO: Change to dynamic sizing  */
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		const { programs, webGL, colorFormats, pointers } = initWebGL(this.canvas);
		this.programs = programs;
		this.webGL = webGL;
		this.colorFormats = colorFormats;
		this.pointers = pointers;
	}

	/**
	 * Activate Fluid Canvas
	 *  Initiates WebGL fluid loop.
	 *
	 *  TODO: Finish commenting
	 *
	 */
	activate() {
		activator(this.canvas, this.webGL, this.colorFormats, this.programs, this.pointers, () => this.onLoop(this));
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
	applyBackground(type: string, value: string, options: any | null = null, canvas = this.canvas) {
		type = type.toLowerCase();

		/* Make transparent */
		this.PARAMS.transparent = true;

		/** Set to Gradient
		 *  Sets canvas background value to desired gradient.
		 */
		function gradient() {
			/** Gradient
			 *  Holds the gradient css statement.
			 *
			 * @type {string}
			 */
			let _gradient = '';

			/* Configure Gradient to Options */
			switch (options) {
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
		}

		/** Set to Image
		 *  Sets canvas background image value to desired image and configure styles.
		 */
		function image() {
			/* Set background image to desired URL, throw error if invalid URL */
			canvas.style.backgroundImage = `url('${value}')`;

			/* Modify CSS Properties */
			if (options) {
				/* Set Repeat */
				canvas.style.backgroundRepeat = options.repeat ? 'repeat' : 'no-repeat';

				/* Set Position */
				canvas.style.backgroundPosition = options.position ? options.position : 'center';

				/* Set Size */
				canvas.style.backgroundSize = options.size ? options.size : 'contain';

				/* Set Color */
				canvas.style.backgroundColor = options.color ? options.color : 'none';
			}
		}

		/* Check for Background Type */
		switch (type) {
			case 'gradient':
				gradient();
				break;
			case 'image':
				image();
				break;
			case 'solid':
			/* Make Opaque Background and Set Color
			 *  value must be in { r: red, b: blue, g: green } format
			 *
			 *  Best way to change background color:
			 *
			 *  yourFluid.PARAM.BACK_COLOR.R = red;
			 *  yourFluid.PARAM.BACK_COLOR.G = blue;
			 *  yourFluid.PARAM.BACK_COLOR.B = green;
			 *
			 *  or
			 *
			 *  let color = {
			 *       r: red,
			 *       b: blue,
			 *       g: green
			 *   };
			 *
			 *   yourFluid.PARAM.BACK_COLOR = color;
			 * */
			default:
				this.PARAMS.transparent = false;
				this.PARAMS.background_color = value as any;
		}

		/* Reset WebGL */
		this.reset();
	}

	/**
	 * Set Dither URL
	 *  Sets the URL to an image to be used for dithering. This method is only responsible for calling
	 *  the action in the initializer. The dither will not be applied until the next activation call.
	 *
	 * @param url: Path to dither in root directory.
	 */
	setDitherURL(url: string) {
		setDitherURL(url);
	}
}
