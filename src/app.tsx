import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useScroll } from 'react-use';
import { Header } from './header';
import { Home } from './home';
import { ScrollIndicator } from './scroll-indicator';

export const App: FunctionComponent = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	const ref = useRef<HTMLDivElement>(null);
	const { y } = useScroll(ref);

	useEffect(() => {
		setIsScrolled(y - (ref.current?.scrollHeight ?? 0) + window.innerHeight > -100);
	}, [y]);

	return (
		<div className="flex bg-gray-900 h-screen w-full overflow-hidden">
			<ScrollIndicator isScrolled={isScrolled} />

			<div ref={ref} className="h-full w-full font-sans overflow-auto z-10 smooth-scroll relative">
				<Home />

				<footer className="text-xs text-white p-2 text-center opacity-50">
					© 2022 Scott Huffman, All Rights Reserved
				</footer>
			</div>
			<Header />
		</div>
	);
};
