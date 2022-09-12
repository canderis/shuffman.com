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
							className={`${isExpanded ? 'rotate-90' : ''} m-auto transform transition-transform`}
						>
							<svg
								width="24"
								height="16"
								viewBox="0 0 24 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g opacity="0.6">
									<path
										d="M22.5 0H1.5C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3H22.5C23.3284 3 24 2.32843 24 1.5C24 0.671573 23.3284 0 22.5 0Z"
										fill="#979797"
									/>
									<path
										d="M22.5 6.5H1.5C0.671573 6.5 0 7.17157 0 8C0 8.82843 0.671573 9.5 1.5 9.5H22.5C23.3284 9.5 24 8.82843 24 8C24 7.17157 23.3284 6.5 22.5 6.5Z"
										fill="#979797"
									/>
									<path
										d="M22.5 13H1.5C0.671573 13 0 13.6716 0 14.5C0 15.3284 0.671573 16 1.5 16H22.5C23.3284 16 24 15.3284 24 14.5C24 13.6716 23.3284 13 22.5 13Z"
										fill="#979797"
									/>
								</g>
							</svg>
						</span>
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
