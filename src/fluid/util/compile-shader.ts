/**
	 *  Compile Shader:
	 *  Makes a new webGL shader of type `type` using the provided GLSL source. The `type` is either of
	 *  `VERTEX_SHADER` or `FRAGMENT_SHADER`
	 *
	 * @param type: Passed to `createShader` to define the shader type
	 * @param source: A GLSL source script, used to define the shader properties
	 * @returns {WebGLShader}: A webGL shader of the parameterized type and source
	 */
export function compileShader(webGL:WebGL2RenderingContext ,type: number, source: string) {
	/* Create shader, link the source, and compile the GLSL */
	const shader = webGL.createShader(type);
	if (shader) {
		webGL.shaderSource(shader, source);
		webGL.compileShader(shader);
		/* TODO: Finish error checking */
		if (!webGL.getShaderParameter(shader, webGL.COMPILE_STATUS)) throw webGL.getShaderInfoLog(shader);
	}

	return shader;
}
