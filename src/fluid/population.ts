import type { Pointer } from 'fluid-canvas';

import {
	APPEAR_CHANCE,
	DISAPPEAR_CHANCE,
	MAX_POINTERS,
	MIN_POINTERS,
	POPULATION_CHANCE_FLOOR,
	POPULATION_CYCLE_MS,
} from './constants';
import { createPointer, createPointerAt } from './pointers';
import { clearRepelsFor, remapRepelsAfterRemoval, seedRepelsFor } from './repel';

export const getPopulationChances = (now: number) => {
	// cos is the slope of sin: positive while rising (favor appear), negative while falling (favor disappear)
	const populationPhase = (now / POPULATION_CYCLE_MS) * Math.PI * 2;
	const populationSlope = Math.cos(populationPhase);
	const appearWeight = POPULATION_CHANCE_FLOOR + (1 - POPULATION_CHANCE_FLOOR) * Math.max(0, populationSlope);
	const disappearWeight = POPULATION_CHANCE_FLOOR + (1 - POPULATION_CHANCE_FLOOR) * Math.max(0, -populationSlope);

	return {
		appearChance: APPEAR_CHANCE * appearWeight,
		disappearChance: DISAPPEAR_CHANCE * disappearWeight,
	};
};

export const spawnPointerAt = (pointers: Pointer[], x: number, y: number, now = performance.now()) => {
	if (pointers.length >= MAX_POINTERS) return false;

	pointers.push(createPointerAt(x, y));
	seedRepelsFor(pointers.length - 1, pointers, now, 0.2);
	return true;
};

export const updatePopulation = (pointers: Pointer[], width: number, height: number, now: number) => {
	const simCount = Math.max(0, pointers.length - 1);
	const { appearChance, disappearChance } = getPopulationChances(now);

	if (pointers.length < MAX_POINTERS && Math.random() < appearChance) {
		pointers.push(createPointer(width, height, false));
		seedRepelsFor(pointers.length - 1, pointers, now, 0.2);
	}

	if (pointers.length > MIN_POINTERS && Math.random() < disappearChance && simCount > 0) {
		const index = 1 + Math.floor(Math.random() * simCount);
		if (pointers[index]) {
			clearRepelsFor(index);
			pointers.splice(index, 1);
			remapRepelsAfterRemoval(index);
		}
	}
};
