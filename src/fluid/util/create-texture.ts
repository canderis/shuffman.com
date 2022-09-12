export function createTextureAsync(url: string, webGL: WebGL2RenderingContext) {
	const texture = webGL.createTexture();
	webGL.bindTexture(webGL.TEXTURE_2D, texture);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.LINEAR);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, webGL.LINEAR);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.REPEAT);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.REPEAT);
	webGL.texImage2D(
		webGL.TEXTURE_2D,
		0,
		webGL.RGB,
		1,
		1,
		0,
		webGL.RGB,
		webGL.UNSIGNED_BYTE,
		new Uint8Array([255, 255, 255])
	);

	const obj = {
		texture,
		width: 1,
		height: 1,
		attach(id: number) {
			webGL.activeTexture(webGL.TEXTURE0 + id);
			webGL.bindTexture(webGL.TEXTURE_2D, texture);
			return id;
		},
	};

	const image = new Image();

	image.src = url;

	image.onload = () => {
		obj.width = image.width;
		obj.height = image.height;
		webGL.bindTexture(webGL.TEXTURE_2D, texture);
		webGL.texImage2D(webGL.TEXTURE_2D, 0, webGL.RGB, webGL.RGB, webGL.UNSIGNED_BYTE, image);
	};

	return obj;
}
