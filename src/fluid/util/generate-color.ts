import { Color } from '../model/IColor';

export function generateColor() {
	const c = HSVtoRGB(Math.random(), 1.0, 1);
	c.r *= 0.15;
	c.g *= 0.15;
	c.b *= 0.15;

	return c;
}

export function HSVtoRGB(h: number, s: number, v: number): Color {
	let r;
	let g;
	let b;
	let i;
	let f;
	let p;
	let q;
	let t;
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}

	return {
		r,
		g,
		b,
	} as Color;
}
