import { IColorFormats } from '../model/IWebGL';

/**
 *  Get Formats:
 *  Enable color extensions, linear filtering extensions, and return usable color formats RGBA,
 *  RG (Red-Green), and R (Red).
 *
 * @returns {{formatRGBA: {internalFormat, format}, supportLinearFiltering: OES_texture_half_float_linear,
 * formatR: {internalFormat, format}, halfFloatTexType: *, formatRG: {internalFormat, format}}}
 */
export function getFormats(webGL: WebGL2RenderingContext, isWebGL2: boolean): IColorFormats {
	/** Get Supported Format
	 *  Using the specified internal format, we retrieve and return the desired color format to be
	 *  rendered with
	 *
	 * @param internalFormat: A GLenum that specifies the color components within the texture
	 * @param format: Another GLenum that specifies the format of the texel data.
	 * @returns {{internalFormat: *, format: *}|null|({internalFormat, format}|null)}
	 */
	function getSupportedFormat(
		internalFormat: number,
		format: number,
		type: number
	): { internalFormat: number; format: number } | null {
		const texture = webGL.createTexture();

		/* Set texture parameters */
		webGL.bindTexture(webGL.TEXTURE_2D, texture);
		webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.NEAREST);
		webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, webGL.NEAREST);
		webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
		webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);

		/* Specify a 2D texture image */
		webGL.texImage2D(webGL.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

		/* Attach texture to frame buffer */
		const fbo = webGL.createFramebuffer();
		webGL.bindFramebuffer(webGL.FRAMEBUFFER, fbo);
		webGL.framebufferTexture2D(webGL.FRAMEBUFFER, webGL.COLOR_ATTACHMENT0, webGL.TEXTURE_2D, texture, 0);

		/* Check if current format is supported */
		const status = webGL.checkFramebufferStatus(webGL.FRAMEBUFFER);
		const isSupportRenderTextureFormat = status === webGL.FRAMEBUFFER_COMPLETE;

		/* If not supported use fallback format, until we have no fallback */
		if (!isSupportRenderTextureFormat) {
			switch (internalFormat) {
				case webGL.R16F:
					return getSupportedFormat(webGL.RG16F, webGL.RG, type);
				case webGL.RG16F:
					return getSupportedFormat(webGL.RGBA16F, webGL.RGBA, type);
				default:
					return null;
			}
		}

		return { internalFormat, format };
	}
	/* Color Formats */
	let formatRGBA;
	let formatRG;
	let formatR;

	let halfFloat;
	let supportLinearFiltering;

	/* Enables webGL color extensions and get linear filtering extension */
	if (isWebGL2) {
		webGL.getExtension('EXT_color_buffer_float');
		supportLinearFiltering = webGL.getExtension('OES_texture_float_linear');
	} else {
		halfFloat = webGL.getExtension('OES_texture_half_float');
		supportLinearFiltering = webGL.getExtension('OES_texture_half_float_linear');
	}
	const HALF_FLOAT_TEXTURE_TYPE = isWebGL2 ? webGL.HALF_FLOAT : (halfFloat as OES_texture_half_float).HALF_FLOAT_OES;

	/* Set color to black for when color buffers are cleared */
	webGL.clearColor(0.0, 0.0, 0.0, 1.0);

	/* Retrieve color formats */
	if (isWebGL2) {
		formatRGBA = getSupportedFormat(webGL.RGBA16F, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
		formatRG = getSupportedFormat(webGL.RG16F, webGL.RG, HALF_FLOAT_TEXTURE_TYPE);
		formatR = getSupportedFormat(webGL.R16F, webGL.RED, HALF_FLOAT_TEXTURE_TYPE);
	} else {
		formatRGBA = getSupportedFormat(webGL.RGBA, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
		formatRG = getSupportedFormat(webGL.RGBA, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
		formatR = getSupportedFormat(webGL.RGBA, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
	}

	return {
		formatRGBA,
		formatRG,
		formatR,

		halfFloatTexType: HALF_FLOAT_TEXTURE_TYPE,
		supportLinearFiltering,
	};
}
