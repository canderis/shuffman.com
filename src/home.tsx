import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fluid from 'fluid-canvas';
import { memo, useLayoutEffect, useRef } from 'react';

import { fluidSim } from './fluid-sim';

export const Home = memo(() => {
	const ref = useRef<HTMLCanvasElement>(null);

	useLayoutEffect(() => {
		const canvas = ref.current as HTMLCanvasElement;
		const f = new Fluid(canvas, fluidSim);

		f.mapBehaviors({
			dissipation: 0.96,
			velocity: 0.985,
			fluid_color: [
				[0.4, 0.2, 0.2],
				[0.4, 0.2, 0.2],
			],
			render_bloom: false,
			intensity: 0.1,
			background_color: { r: 15, g: 15, b: 15 },
		});
		f.setDitherURL('assets/texture.jpg');
		f.activate();

		const onMouseMove = (e: MouseEvent) => {
			f.pointers[0].x = e.offsetX;
			f.pointers[0].y = e.offsetY;
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'KeyP') f.PARAMS.paused = !f.PARAMS.paused;
			if (e.key === ' ') f.splatStack.push(parseInt(`${Math.random() * 20}`, 10) + 5);
		};

		canvas.addEventListener('mousemove', onMouseMove);
		window.addEventListener('keydown', onKeyDown);

		return () => {
			f.deactivate();
			canvas.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('keydown', onKeyDown);
		};
	}, []);

	return (
		<div id="home" className="grow h-screen flex flex-row p-8 relative">
			<div className="grid gap-10 my-auto mr-auto z-10">
				<div className="h-7 w-11 border-l border-t border-grey-200" />
				<div className="px-11">
					<h1 className="text-white/90 text-6xl font-extralight">Scott Huffman</h1>
					<div className="grid-fr-auto">
						<h2 className="text-white/90 text-xl font-light">ui/ux development</h2>
						<div className="flex gap-1 my-auto">
							<a
								href="https://www.linkedin.com/in/shuffman14/"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
								className="text-white/50 hover:text-white/90 transition-colors"
							>
								<FontAwesomeIcon icon={faLinkedin} size="lg" />
							</a>
							<a
								href="https://github.com/canderis"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								className="text-white/50 hover:text-white/90 transition-colors"
							>
								<FontAwesomeIcon icon={faGithub} size="lg" />
							</a>
						</div>
					</div>
				</div>
				<div className="h-7 w-11 border-l border-b border-grey-200" />
			</div>
			<canvas ref={ref} className="bg-green-50/10 absolute top-0  left-0  h-screen w-screen z-0" />
		</div>
	);
});
