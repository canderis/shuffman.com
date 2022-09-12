import { IFBO } from '../model/IFBO';
import { createFBO } from './create-fbo';

export function resizeFBO(
	target: IFBO,
	w: number,
	h: number,
	internalFormat: number,
	format: number,
	type: number,
	param: number,
	webGL: WebGL2RenderingContext,
	PROGRAMS: any,
	blit: (destination: WebGLFramebuffer | null) => void
) {
	const newFBO = createFBO(w, h, internalFormat, format, type, param, webGL);
	PROGRAMS.clearProgram.bind();
	webGL.uniform1i(PROGRAMS.clearProgram.uniforms.uTexture, target.attach(0));
	webGL.uniform1f(PROGRAMS.clearProgram.uniforms.value, 1);
	blit(newFBO.fbo);
	return newFBO;
}
