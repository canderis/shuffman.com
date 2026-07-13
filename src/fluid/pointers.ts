import type Fluid from 'fluid-canvas';
import { Pointer, generateColor } from 'fluid-canvas';

import { INITIAL_POINTERS, SPAWN_SPREAD } from './constants';
import { randomSign } from './math';
import { clearAllRepels, seedInitialRepels } from './repel';

export const placePointer = (pointer: Pointer, width: number, height: number, clustered: boolean) => {
	pointer.down = true;
	pointer.color = generateColor();
	pointer.dx = 2.75 * Math.random() * randomSign();
	pointer.dy = 2.75 * Math.random() * randomSign();
	pointer.moved = true;

	if (clustered) {
		pointer.x = width * (0.5 + (Math.random() - 0.5) * SPAWN_SPREAD);
		pointer.y = height * (0.5 + (Math.random() - 0.5) * SPAWN_SPREAD);
	} else {
		pointer.x = Math.random() * width;
		pointer.y = Math.random() * height;
	}
};

export const createPointer = (width: number, height: number, clustered: boolean) => {
	const pointer = new Pointer();
	placePointer(pointer, width, height, clustered);
	return pointer;
};

export const createPointerAt = (x: number, y: number) => {
	const pointer = new Pointer();
	pointer.down = true;
	pointer.color = generateColor();
	pointer.dx = 2.75 * Math.random() * randomSign();
	pointer.dy = 2.75 * Math.random() * randomSign();
	pointer.moved = true;
	pointer.x = x;
	pointer.y = y;
	return pointer;
};

export const ensureDensePointers = (params: Fluid, now: number) => {
	// Drop holes / stale entries left by remounts or sparse writes
	params.pointers = params.pointers.filter(Boolean);

	if (params.pointers.length === 0) {
		clearAllRepels();

		for (let i = 0; i < INITIAL_POINTERS; i++) {
			params.pointers.push(createPointer(params.canvas.width, params.canvas.height, true));
		}

		seedInitialRepels(params.pointers, now);
	}

	if (!params.pointers[0]) {
		params.pointers.unshift(createPointer(params.canvas.width, params.canvas.height, true));
	} else {
		params.pointers[0].down = true;
	}
};
