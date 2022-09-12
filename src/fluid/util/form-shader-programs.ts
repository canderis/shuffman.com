import { GLProgram } from '../GLProgram';
import { IShader } from '../model/IShader';

export interface IShaderPrograms {
	clearProgram: GLProgram;
	colorProgram: GLProgram;
	backgroundProgram: GLProgram;
	displayProgram: GLProgram;
	displayBloomProgram: GLProgram;
	displayShadingProgram: GLProgram;
	displayBloomShadingProgram: GLProgram;
	bloomPreFilterProgram: GLProgram;
	bloomBlurProgram: GLProgram;
	bloomFinalProgram: GLProgram;
	splatProgram: GLProgram;
	advectionProgram: GLProgram;
	divergenceProgram: GLProgram;
	curlProgram: GLProgram;
	vorticityProgram: GLProgram;
	pressureProgram: GLProgram;
	gradientSubtractProgram: GLProgram;
}

/**
 *  Form Shader Programs:
 *  Assembles shaders into a webGl program we can use to write to our context
 *
 * @param supportLinearFiltering: A bool letting us know if we support linear filtering
 * @returns {{displayBloomProgram: GLProgram, vorticityProgram: GLProgram, displayShadingProgram: GLProgram,
 * displayBloomShadingProgram: GLProgram, gradientSubtractProgram: GLProgram, advectionProgram: GLProgram,
 * bloomBlurProgram: GLProgram, colorProgram: GLProgram, divergenceProgram: GLProgram, clearProgram: GLProgram,
 * splatProgram: GLProgram, displayProgram: GLProgram, bloomPreFilterProgram: GLProgram, curlProgram: GLProgram,
 * bloomFinalProgram: GLProgram, pressureProgram: GLProgram, backgroundProgram: GLProgram}}: Programs used to
 * render shaders
 *
 */
export function formShaderPrograms(
	webGL: WebGL2RenderingContext,
	SHADER: IShader,
	supportLinearFiltering?: OES_texture_float_linear | null
): IShaderPrograms {
	return {
		clearProgram: new GLProgram(SHADER.baseVertex, SHADER.clear, webGL),
		colorProgram: new GLProgram(SHADER.baseVertex, SHADER.color, webGL),
		backgroundProgram: new GLProgram(SHADER.baseVertex, SHADER.background, webGL),
		displayProgram: new GLProgram(SHADER.baseVertex, SHADER.display, webGL),
		displayBloomProgram: new GLProgram(SHADER.baseVertex, SHADER.displayBloom, webGL),
		displayShadingProgram: new GLProgram(SHADER.baseVertex, SHADER.displayShading, webGL),
		displayBloomShadingProgram: new GLProgram(SHADER.baseVertex, SHADER.displayBloomShading, webGL),
		bloomPreFilterProgram: new GLProgram(SHADER.baseVertex, SHADER.bloomPreFilter, webGL),
		bloomBlurProgram: new GLProgram(SHADER.baseVertex, SHADER.bloomBlur, webGL),
		bloomFinalProgram: new GLProgram(SHADER.baseVertex, SHADER.bloomFinal, webGL),
		splatProgram: new GLProgram(SHADER.baseVertex, SHADER.splat, webGL),
		advectionProgram: new GLProgram(
			SHADER.baseVertex,
			supportLinearFiltering ? SHADER.advection : SHADER.advectionManualFiltering,
			webGL
		),
		divergenceProgram: new GLProgram(SHADER.baseVertex, SHADER.divergence, webGL),
		curlProgram: new GLProgram(SHADER.baseVertex, SHADER.curl, webGL),
		vorticityProgram: new GLProgram(SHADER.baseVertex, SHADER.vorticity, webGL),
		pressureProgram: new GLProgram(SHADER.baseVertex, SHADER.pressure, webGL),
		gradientSubtractProgram: new GLProgram(SHADER.baseVertex, SHADER.gradientSubtract, webGL),
	};
}
