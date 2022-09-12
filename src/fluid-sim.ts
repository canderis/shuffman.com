import Fluid from './fluid/fluid';
import { Pointer } from './fluid/Pointer';
import { generateColor } from './fluid/util/generate-color';

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
			pointer.dx = 5 * Math.random() * randomSign();
			pointer.dy = 5 * Math.random() * randomSign();
		}
		const pointer = params.pointers[i];
		pointer.x += 1 * pointer.dx + Math.random() * 3;
		pointer.y += 1 * pointer.dy + Math.random() * 3;

		if (pointer.x >= params.canvas.width) {
			pointer.dx = -5;
		} else if (pointer.x <= 0) {
			pointer.dx = 5;
		} else if (Math.random() > 0.99) {
			pointer.dx = pointer.dx * -1;
		} else if (pointer.x < params.canvas.width / 2 && Math.random() > 0.97) {
			pointer.dx = 5;
		}

		if (pointer.y >= params.canvas.height) {
			pointer.dy = -5;
		} else if (pointer.y <= 0) {
			pointer.dy = 5;
		} else if (Math.random() > 0.99) {
			pointer.dy = pointer.dy * -1;
		}

		if (Math.random() > 0.95) {
		}

		pointer.moved = true;
	}
};
