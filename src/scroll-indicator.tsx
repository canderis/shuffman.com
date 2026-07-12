import { memo } from 'react';

export const ScrollIndicator = memo(({ isScrolled }: { isScrolled: boolean }) => {
	return (
		<div className="mx-auto fixed w-screen bottom-4 text-white py-4 text-sm font-serif uppercase tracking-widest grid z-50 pr-16">
			<div className="w-full mr-16 grid gap-3">
				<div className="animate-bounce mx-auto">
					<i
						className={`${
							isScrolled ? 'rotate-180' : 'rotate-0'
						} fas fa-arrow-down transform-gpu transition-transform`}
					/>
				</div>

				<span className="mx-auto">{isScrolled ? 'Scroll Up' : 'Scroll Down'}</span>
			</div>
		</div>
	);
});
