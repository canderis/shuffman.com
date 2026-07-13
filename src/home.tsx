import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fluid from 'fluid-canvas';
import { memo, useLayoutEffect, useRef } from 'react';

import ditherUrl from './assets/texture.jpg';
import { fluidSim, spawnPointerAt } from './fluid';

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
		f.setDitherURL(ditherUrl);
		f.activate();

		const onMouseMove = (e: MouseEvent) => {
			f.pointers[0].x = e.offsetX;
			f.pointers[0].y = e.offsetY;
		};

		const onClick = (e: MouseEvent) => {
			if ((e.target as HTMLElement).closest('a, button')) return;

			const rect = canvas.getBoundingClientRect();
			spawnPointerAt(f.pointers, e.clientX - rect.left, e.clientY - rect.top);
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'KeyN') f.PARAMS.paused = !f.PARAMS.paused;
		};

		canvas.addEventListener('mousemove', onMouseMove);
		window.addEventListener('click', onClick);
		window.addEventListener('keydown', onKeyDown);

		return () => {
			f.deactivate();
			canvas.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('click', onClick);
			window.removeEventListener('keydown', onKeyDown);
		};
	}, []);

	return (
		<div id="home" className="grow h-screen flex flex-row p-8 relative">
			<div className="grid gap-3 my-auto mr-auto z-10 w-fit">
				<div className="h-7 w-11 border-l border-t border-grey-200" />
				<div className="rounded-2xl border border-white/10 ml-7 bg-white/5 px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150">
					<h1 className="text-white/90 text-6xl font-light mb-1">Scott Huffman</h1>
					<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-3">
						<h2 className="font-subtitle text-white/90 text-xl font-light pl-0.5 grow">
							ui/ux development
						</h2>
						<div className="flex items-center gap-5 sm:gap-3">
							<a
								href="https://www.linkedin.com/in/shuffman14/"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
								className="inline-flex items-center text-[1.6875rem] leading-none text-white/50 hover:text-white/90 transition-colors sm:text-lg"
							>
								<FontAwesomeIcon icon={faLinkedin} />
							</a>
							<a
								href="https://github.com/canderis"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								className="inline-flex items-center text-[1.6875rem] leading-none text-white/50 hover:text-white/90 transition-colors sm:text-lg"
							>
								<FontAwesomeIcon icon={faGithub} />
							</a>
						</div>
					</div>
				</div>
				<div className="h-7 w-11 border-l border-b border-grey-200" />
			</div>
			<p className="absolute bottom-8 left-8 z-10 text-black/20 text-sm font-light">press n</p>
			<canvas ref={ref} className="bg-green-50/10 absolute top-0 left-0 h-screen w-screen z-0" />
		</div>
	);
});
