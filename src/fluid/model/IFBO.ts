export interface IFBO {
	texture: WebGLTexture | null;
	fbo: WebGLFramebuffer | null;
	width: number;
	height: number;
	attach(id: number): number;
}

export type DoubleFBO = {
	/* Get and set Buffer Data */
	read: IFBO;
	write: IFBO;
	/* Swap data between buffers */
	swap(): void;
};
