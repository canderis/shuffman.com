import type Fluid from 'fluid-canvas';

import { updateForces } from './forces';
import { ensureDensePointers } from './pointers';
import { spawnPointerAt, updatePopulation } from './population';

export { spawnPointerAt };

export const fluidSim = (params: Fluid) => {
	const now = performance.now();

	ensureDensePointers(params, now);
	updatePopulation(params.pointers, params.canvas.width, params.canvas.height, now);
	updateForces(params.pointers, params.canvas.width, params.canvas.height, now);
};
