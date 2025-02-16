import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FunctionComponent, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMountedState } from 'react-use';
import { fluidSim } from './fluid-sim';
import Fluid from './fluid/fluid';
import { Pointer } from './fluid/Pointer';
import { generateColor } from './fluid/util/generate-color';

let x = 0;
let y = 0;

export const Home: FunctionComponent = memo(() => {
	const ref = useRef<HTMLCanvasElement>(null);

	const [fluid, setFluid] = useState<Fluid>();

	useLayoutEffect(() => {
		const canvas = ref.current as HTMLCanvasElement;
		const f = new Fluid(canvas, fluidSim);
		f.activate();

		// f.applyImageBackground('assets/texture.jpg');s
		// f.setDitherURL('assets/texture.jpg');

		canvas.addEventListener('mousemove', (e) => {
			// pointers[0].moved = pointers[0].down;
			// pointers[0].dx = (e.offsetX - pointers[0].x) * 5.0;
			// pointers[0].dy = (e.offsetY - pointers[0].y) * 5.0;
			f.pointers[0].x = e.offsetX;
			f.pointers[0].y = e.offsetY;
		});

		window.addEventListener('keydown', (e) => {
			if (e.code === 'KeyP') f.PARAMS.paused = !f.PARAMS.paused;
			if (e.key === ' ') f.splatStack.push(parseInt(`${Math.random() * 20}`, 10) + 5);
		});

		setFluid(f);
	}, []);

	return (
		<div id="home" className="flex-grow h-screen flex flex-row p-8 relative">
			<div className="grid gap-12 my-auto mr-auto z-10">
				<div className="h-7 w-11 border-l border-t border-grey-200" />
				<div className="px-11">
					<h1 className="text-white/90 text-6xl font-extralight">Scott Huffman</h1>
					<h2 className="text-white/90 text-xl italic ml-4 font-light">ui.ux development</h2>
					<a href=""></a>
				</div>
				<div className="h-7 w-11 border-l border-b border-grey-200" />
			</div>
			<canvas ref={ref} className="bg-green-50/10 absolute top-0  left-0  h-screen w-screen z-0" />
		</div>
	);
});
