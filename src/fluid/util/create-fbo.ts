import { IFBO } from '../model/IFBO';

export function createFBO(
	w: number,
	h: number,
	internalFormat: number,
	format: number,
	type: number,
	param: number,
	webGL: WebGL2RenderingContext
): IFBO {
	webGL.activeTexture(webGL.TEXTURE0);
	const texture = webGL.createTexture();
	webGL.bindTexture(webGL.TEXTURE_2D, texture);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, param);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, param);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);
	webGL.texImage2D(webGL.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

	const fbo = webGL.createFramebuffer();
	webGL.bindFramebuffer(webGL.FRAMEBUFFER, fbo);
	webGL.framebufferTexture2D(webGL.FRAMEBUFFER, webGL.COLOR_ATTACHMENT0, webGL.TEXTURE_2D, texture, 0);
	webGL.viewport(0, 0, w, h);
	webGL.clear(webGL.COLOR_BUFFER_BIT);

	return {
		texture,
		fbo,
		width: w,
		height: h,
		attach(id: number) {
			webGL.activeTexture(webGL.TEXTURE0 + id);
			webGL.bindTexture(webGL.TEXTURE_2D, texture);
			return id;
		},
	};
}
