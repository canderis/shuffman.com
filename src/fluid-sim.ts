import type Fluid from 'fluid-canvas';
import { Pointer, generateColor } from 'fluid-canvas';

const randomSign = () => {
	const n = Math.random();
	return n > 0.5 ? 1 : -1;
};

export const fluidSim = (params: Fluid) => {
	for (let i = 0; i < 10; i++) {
		if (!params.pointers[i]) {
			const pointer = (params.pointers[i] = new Pointer());
			pointer.down = true;
			pointer.color = generateColor();
			pointer.x = params.canvas.width / 2 + params.canvas.width / 4 + (Math.random() * params.canvas.width) / 4;
			pointer.y = params.canvas.height / 2 + (Math.random() * params.canvas.height) / 4;
			pointer.dx = 2.75 * Math.random() * randomSign();
			pointer.dy = 2.75 * Math.random() * randomSign();
		}
		const pointer = params.pointers[i];
		pointer.x += 0.55 * pointer.dx + Math.random() * 1.7;
		pointer.y += 0.55 * pointer.dy + Math.random() * 1.7;

		if (pointer.x >= params.canvas.width) {
			pointer.dx = -2.75;
		} else if (pointer.x <= 0) {
			pointer.dx = 2.75;
		} else if (Math.random() > 0.999) {
			pointer.dx = pointer.dx * -1;
		} else if (pointer.x < params.canvas.width / 2 && Math.random() > 0.97) {
			pointer.dx = 2.75;
		}

		if (pointer.y >= params.canvas.height) {
			pointer.dy = -2.75;
		} else if (pointer.y <= 0) {
			pointer.dy = 2.75;
		} else if (Math.random() > 0.999) {
			pointer.dy = pointer.dy * -1;
		}

		pointer.moved = true;
	}
};
