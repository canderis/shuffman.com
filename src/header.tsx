import { FunctionComponent, memo, useState } from 'react';

export const Header: FunctionComponent = memo(() => {
	const [isExpanded, setisExpanded] = useState<boolean>(false);

	return (
		<div className="flex h-screen relative">
			<ul className="text-gray-700 text-lg flex flex-col w-16 text-center my-auto h-screen">
				<li className="h-16 absolute w-16">
					<button
						onClick={() => setisExpanded((existing) => !existing)}
						className="h-14 w-14 m-1 flex"
						type="button"
					>
						<span
							aria-label="menu"
							className={`${
								isExpanded ? 'rotate-90' : ''
							} fas fa-bars m-auto transform transition-transform`}
						/>
					</button>
				</li>
			</ul>

			<ul
				className={`${
					isExpanded ? 'bg-opacity-80 w-screen opacity-100 lg:w-56' : 'bg-opacity-0 opacity-0 w-0'
				} overflow-hidden flex flex-col ml-auto text-7xl z-10 font-extralight text-center pl-16 lg:pl-0 lg:text-right absolute h-screen bg-gray-900 lg:bg-opacity-0 right-16 transition-all`}
			>
				<>
					<li
						onClick={() => setisExpanded((existing) => !existing)}
						className="py-4 px-7 text-gray-200 font-serif mt-auto"
					>
						<a href="#home">Home</a>
					</li>
					<li
						onClick={() => setisExpanded((existing) => !existing)}
						className="py-4 px-7 text-gray-200 font-serif"
					>
						<a href="#tour">Coming Soon</a>
					</li>
				</>
			</ul>
		</div>
	);
});
