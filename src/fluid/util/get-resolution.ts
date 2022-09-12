export function getResolution(webGL: WebGL2RenderingContext, resolution: number) {
	let aspectRatio = webGL.drawingBufferWidth / webGL.drawingBufferHeight;
	if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;

	const max = Math.round(resolution * aspectRatio);
	const min = Math.round(resolution);

	if (webGL.drawingBufferWidth > webGL.drawingBufferHeight) return { width: max, height: min };
	return { width: min, height: max };
}
