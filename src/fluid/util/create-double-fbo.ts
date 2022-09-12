import { createFBO } from './create-fbo';
import { DoubleFBO, IFBO } from '../model/IFBO';
/**
 * Create Double Frame Buffer Object
 *  Creates an object with 2 frame buffers, one for reads and one for writes
 *
 * @param w: Width
 * @param h: Height
 * @param internalFormat: Internal color formats
 * @param format: Color format
 * @param type: Texture type
 * @param param: Extra parameters
 */
export function createDoubleFBO(
	w: number,
	h: number,
	internalFormat: number,
	format: number,
	type: number,
	param: number,
	webGL: WebGL2RenderingContext
): DoubleFBO {
	/* Create frame buffer objects */
	let fbo1 = createFBO(w, h, internalFormat, format, type, param, webGL);
	let fbo2 = createFBO(w, h, internalFormat, format, type, param, webGL);

	return {
		/* Get and set Buffer Data */
		get read() {
			return fbo1;
		},
		set read(value) {
			fbo1 = value;
		},
		get write() {
			return fbo2;
		},
		set write(value) {
			fbo2 = value;
		},

		/* Swap data between buffers */
		swap() {
			const temp = fbo1;
			fbo1 = fbo2;
			fbo2 = temp;
		},
	};
}
