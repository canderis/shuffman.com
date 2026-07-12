import { Home } from './home';

export const App = () => {
	return (
		<div className="flex bg-grey-900 h-screen w-full overflow-hidden">
			<div className="h-full w-full font-sans overflow-auto z-10 smooth-scroll relative">
				<Home />
			</div>
		</div>
	);
};
