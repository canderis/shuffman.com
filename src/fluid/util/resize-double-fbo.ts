import { DoubleFBO } from '../model/IFBO';
import { createFBO } from './create-fbo';
import { resizeFBO } from './resize-fbo';

export function resizeDoubleFBO(
	target: DoubleFBO,
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
	target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param, webGL, PROGRAMS, blit);
	target.write = createFBO(w, h, internalFormat, format, type, param, webGL);
	return target;
}
