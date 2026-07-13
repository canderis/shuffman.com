import type { Pointer } from 'fluid-canvas';

import { pairKey, randomRepelDuration } from './math';

/** End timestamps for active pairwise repulsions. */
const repelUntil = new Map<string, number>();

export const clearAllRepels = () => repelUntil.clear();

export const clearRepelsFor = (index: number) => {
	for (const key of [...repelUntil.keys()]) {
		const [a, b] = key.split(':').map(Number);
		if (a === index || b === index) repelUntil.delete(key);
	}
};

export const remapRepelsAfterRemoval = (removedIndex: number) => {
	const next = new Map<string, number>();

	for (const [key, until] of repelUntil) {
		const [a, b] = key.split(':').map(Number);
		if (a === removedIndex || b === removedIndex) continue;

		const nextA = a > removedIndex ? a - 1 : a;
		const nextB = b > removedIndex ? b - 1 : b;
		next.set(pairKey(nextA, nextB), until);
	}

	repelUntil.clear();
	for (const [key, until] of next) repelUntil.set(key, until);
};

export const seedRepelsFor = (index: number, pointers: Pointer[], now: number, durationScale = 1) => {
	for (let j = 0; j < pointers.length; j++) {
		if (j === index || !pointers[j] || Math.random() < 0.2) continue;
		repelUntil.set(pairKey(index, j), now + randomRepelDuration() * durationScale);
	}
};

export const seedInitialRepels = (pointers: Pointer[], now: number, durationScale = 0.2) => {
	for (let i = 0; i < pointers.length; i++) {
		for (let j = i + 1; j < pointers.length; j++) {
			if (Math.random() < 0.2) continue;
			repelUntil.set(pairKey(i, j), now + randomRepelDuration() * durationScale);
		}
	}
};

export const isRepelling = (a: number, b: number, now: number) => (repelUntil.get(pairKey(a, b)) ?? 0) > now;

export const startRepel = (a: number, b: number, now: number) => {
	repelUntil.set(pairKey(a, b), now + randomRepelDuration());
};

export const clearExpiredRepel = (a: number, b: number, now: number) => {
	const key = pairKey(a, b);
	if ((repelUntil.get(key) ?? 0) <= now) repelUntil.delete(key);
};

export const getRepelUntil = (a: number, b: number) => repelUntil.get(pairKey(a, b)) ?? 0;
