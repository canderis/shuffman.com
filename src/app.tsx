import React, { FunctionComponent } from 'react';
import { Home } from './home';

export const App: FunctionComponent = () => {
	return (
		<div className="flex bg-grey-900 h-screen w-full overflow-hidden">
			<div className="h-full w-full font-sans overflow-auto z-10 smooth-scroll relative">
				<Home />
			</div>
		</div>
	);
};
