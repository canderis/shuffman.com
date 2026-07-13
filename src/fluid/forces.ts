import type { Pointer } from 'fluid-canvas';

import {
	ATTRACT_CHANCE,
	ATTRACT_STRENGTH,
	CLOSE_DISTANCE,
	GROUP_RADIUS,
	MAX_GROUP_SIZE,
	MIN_ATTRACT_DISTANCE,
	OVERCROWD_REPEL_STRENGTH,
	REPEL_CHANCE,
	REPEL_STRENGTH,
} from './constants';
import { clampSpeed, getActiveIndices, randomJitter } from './math';
import { clearExpiredRepel, getRepelUntil, startRepel } from './repel';

const getCenter = (pointers: Pointer[], activeIndices: number[]) => {
	let centerX = 0;
	let centerY = 0;

	for (const i of activeIndices) {
		centerX += pointers[i].x;
		centerY += pointers[i].y;
	}

	return {
		centerX: centerX / activeIndices.length,
		centerY: centerY / activeIndices.length,
	};
};

const applyOvercrowdOrAttract = (
	pointer: Pointer,
	pointers: Pointer[],
	activeIndices: number[],
	index: number,
	centerX: number,
	centerY: number,
) => {
	const nearby: number[] = [];
	let localX = pointer.x;
	let localY = pointer.y;

	for (const j of activeIndices) {
		if (j === index) continue;

		const other = pointers[j];
		if (!other) continue;

		const distance = Math.hypot(pointer.x - other.x, pointer.y - other.y);

		if (distance < GROUP_RADIUS) {
			nearby.push(j);
			localX += other.x;
			localY += other.y;
		}
	}

	const localSize = nearby.length + 1;

	if (localSize > MAX_GROUP_SIZE) {
		localX /= localSize;
		localY /= localSize;

		const offsetX = pointer.x - localX;
		const offsetY = pointer.y - localY;
		const distance = Math.hypot(offsetX, offsetY) || 1;
		const overflow = localSize - MAX_GROUP_SIZE;
		const force = OVERCROWD_REPEL_STRENGTH * overflow;

		pointer.dx = clampSpeed(pointer.dx + (offsetX / distance) * force);
		pointer.dy = clampSpeed(pointer.dy + (offsetY / distance) * force);
		return;
	}

	if (Math.random() < ATTRACT_CHANCE) {
		const offsetX = centerX - pointer.x;
		const offsetY = centerY - pointer.y;
		const distance = Math.hypot(offsetX, offsetY);

		if (distance > MIN_ATTRACT_DISTANCE) {
			pointer.dx = clampSpeed(pointer.dx + (offsetX / distance) * ATTRACT_STRENGTH);
			pointer.dy = clampSpeed(pointer.dy + (offsetY / distance) * ATTRACT_STRENGTH);
		}
	}
};

const applyPairwiseRepels = (
	pointer: Pointer,
	pointers: Pointer[],
	activeIndices: number[],
	index: number,
	now: number,
) => {
	for (const j of activeIndices) {
		if (j === index) continue;

		const other = pointers[j];
		if (!other) continue;

		const offsetX = pointer.x - other.x;
		const offsetY = pointer.y - other.y;
		const distance = Math.hypot(offsetX, offsetY);

		if (distance <= 0) continue;

		const activelyRepelling = getRepelUntil(index, j) > now;

		if (!activelyRepelling && distance < CLOSE_DISTANCE && Math.random() < REPEL_CHANCE) {
			startRepel(index, j, now);
		}

		if (getRepelUntil(index, j) > now) {
			const force = REPEL_STRENGTH * Math.max(0.2, 1 - distance / Math.max(GROUP_RADIUS, distance));
			pointer.dx = clampSpeed(pointer.dx + (offsetX / distance) * force);
			pointer.dy = clampSpeed(pointer.dy + (offsetY / distance) * force);
		} else {
			clearExpiredRepel(index, j, now);
		}
	}
};

const integrateMotion = (pointer: Pointer, width: number, height: number) => {
	pointer.x += 0.55 * pointer.dx + randomJitter();
	pointer.y += 0.55 * pointer.dy + randomJitter();

	if (pointer.x >= width) {
		pointer.dx = -Math.abs(pointer.dx || 2.75);
		pointer.x = width;
	} else if (pointer.x <= 0) {
		pointer.dx = Math.abs(pointer.dx || 2.75);
		pointer.x = 0;
	} else if (Math.random() > 0.998) {
		pointer.dx *= -1;
	}

	if (pointer.y >= height) {
		pointer.dy = -Math.abs(pointer.dy || 2.75);
		pointer.y = height;
	} else if (pointer.y <= 0) {
		pointer.dy = Math.abs(pointer.dy || 2.75);
		pointer.y = 0;
	} else if (Math.random() > 0.998) {
		pointer.dy *= -1;
	}
};

export const updateForces = (pointers: Pointer[], width: number, height: number, now: number) => {
	const activeIndices = getActiveIndices(pointers);
	if (activeIndices.length === 0) return;

	const { centerX, centerY } = getCenter(pointers, activeIndices);

	for (const i of activeIndices) {
		const pointer = pointers[i];
		if (!pointer) continue;

		applyOvercrowdOrAttract(pointer, pointers, activeIndices, i, centerX, centerY);
		applyPairwiseRepels(pointer, pointers, activeIndices, i, now);

		// Mouse pointer position is overwritten externally; still keep it live
		if (i !== 0) {
			integrateMotion(pointer, width, height);
		}

		pointer.down = true;
		pointer.moved = true;
	}
};
