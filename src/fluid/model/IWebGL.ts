import { GLProgram } from '../GLProgram';
import { Pointer } from '../Pointer';
import { IShaderPrograms } from '../util/form-shader-programs';

export interface IColorFormats {
	formatRGBA: { internalFormat: number; format: number } | null;
	formatRG: { internalFormat: number; format: number } | null;
	formatR: { internalFormat: number; format: number } | null;
	halfFloatTexType: number;
	supportLinearFiltering: OES_texture_float_linear | null;
}

export interface IWebGL {
	programs: IShaderPrograms;
	webGL: WebGL2RenderingContext;
	colorFormats: IColorFormats;
	pointers: Pointer[];
}
