import { IWebGL } from '../model/IWebGL';
import { Pointer } from '../Pointer';

import * as defaults from '../defaults';
import { getFormats } from './get-formats';
import { compileShader } from './compile-shader';
import { IShader } from '../model/IShader';
import { formShaderPrograms } from './form-shader-programs';
/**
 * Initiate WebGL Object
 *  Gets WebGL context and compiles shader programs.
 *
 */
export function initWebGL(canvas: HTMLCanvasElement): IWebGL {
	/* Add default pointer */
	const pointers: Pointer[] = [];
	// pointers.push(new Pointer());

	/* Get webGL context */
	let webGL = canvas.getContext('webgl2', defaults.DRAWING_PARAMS) as WebGL2RenderingContext;
	const isWebGL2 = !!webGL;
	if (!isWebGL2)
		webGL = (canvas.getContext('webgl', defaults.DRAWING_PARAMS) ||
			canvas.getContext('experimental-webgl', defaults.DRAWING_PARAMS)) as WebGL2RenderingContext;

	if (!webGL) throw new Error('failed to init webgl');

	/* Get color formats */
	const colorFormats = getFormats(webGL, isWebGL2);

	/* Worker Classes and Functions */
	/**
	 *  Is It Mobile?:
	 *  Detects whether or not a device is mobile by checking the user agent string
	 *
	 * @returns {boolean}
	 */
	function isMobile() {
		return /Mobi|Android/i.test(navigator.userAgent);
	}

	/* Case support adjustments */
	if (isMobile()) defaults.behavior.render_shaders = false;
	if (!colorFormats.supportLinearFiltering) {
		defaults.behavior.render_shaders = false;
		defaults.behavior.render_bloom = false;
	}

	/* Make our shaders and shader programs */
	const SHADER: IShader = {
		baseVertex: compileShader(webGL, webGL.VERTEX_SHADER, defaults.SHADER_SOURCE.vertex) as WebGLShader,

		clear: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.clear) as WebGLShader,
		color: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.color) as WebGLShader,
		background: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.background) as WebGLShader,
		display: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.display) as WebGLShader,
		displayBloom: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.displayBloom) as WebGLShader,
		displayShading: compileShader(
			webGL,
			webGL.FRAGMENT_SHADER,
			defaults.SHADER_SOURCE.displayShading
		) as WebGLShader,
		displayBloomShading: compileShader(
			webGL,
			webGL.FRAGMENT_SHADER,
			defaults.SHADER_SOURCE.displayBloomShading
		) as WebGLShader,
		bloomPreFilter: compileShader(
			webGL,
			webGL.FRAGMENT_SHADER,
			defaults.SHADER_SOURCE.bloomPreFilter
		) as WebGLShader,
		bloomBlur: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.bloomBlur) as WebGLShader,
		bloomFinal: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.bloomFinal) as WebGLShader,
		splat: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.splat) as WebGLShader,
		advectionManualFiltering: compileShader(
			webGL,
			webGL.FRAGMENT_SHADER,
			defaults.SHADER_SOURCE.advectionManualFiltering
		) as WebGLShader,
		advection: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.advection) as WebGLShader,
		divergence: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.divergence) as WebGLShader,
		curl: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.curl) as WebGLShader,
		vorticity: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.vorticity) as WebGLShader,
		pressure: compileShader(webGL, webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.pressure) as WebGLShader,
		gradientSubtract: compileShader(
			webGL,
			webGL.FRAGMENT_SHADER,
			defaults.SHADER_SOURCE.gradientSubtract
		) as WebGLShader,
	};

	const programs = formShaderPrograms(webGL, SHADER, colorFormats.supportLinearFiltering);

	return {
		programs,
		webGL,
		colorFormats,
		pointers,
	};
}
