export class GLProgram {
	webGL: WebGL2RenderingContext;

	program: WebGLProgram;

	uniforms: { [key: string]: WebGLUniformLocation };

	constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader, webGL: WebGL2RenderingContext) {
		this.uniforms = {};
		this.webGL = webGL;
		this.program = webGL.createProgram() as WebGLProgram;

		webGL.attachShader(this.program, vertexShader);
		webGL.attachShader(this.program, fragmentShader);
		webGL.linkProgram(this.program);

		if (!webGL.getProgramParameter(this.program, webGL.LINK_STATUS)) throw webGL.getProgramInfoLog(this.program);

		const uniformCount = webGL.getProgramParameter(this.program, webGL.ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			const uniformName = webGL.getActiveUniform(this.program, i)?.name;
			if (uniformName)
				this.uniforms[uniformName] = webGL.getUniformLocation(
					this.program,
					uniformName
				) as WebGLUniformLocation;
		}
	}

	bind() {
		this.webGL.useProgram(this.program);
	}
}
