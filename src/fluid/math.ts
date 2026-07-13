import { MAX_REPEL_MS, MAX_SPEED, MIN_REPEL_MS } from './constants';

export const randomSign = () => (Math.random() > 0.5 ? 1 : -1);

export const randomJitter = () => (Math.random() - 0.5) * 1.7;

export const clampSpeed = (value: number) => Math.max(-MAX_SPEED, Math.min(MAX_SPEED, value));

export const randomRepelDuration = () => MIN_REPEL_MS + Math.random() * (MAX_REPEL_MS - MIN_REPEL_MS);

export const pairKey = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`);

export const getActiveIndices = (pointers: Array<unknown>) =>
	pointers.map((pointer, index) => (pointer ? index : -1)).filter((index) => index !== -1);
