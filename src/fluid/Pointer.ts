import { Color } from './model/IColor';
import { generateColor } from './util/generate-color';

export class Pointer {
	/** Identifier for the pointer object
	 *
	 *  @type {number} valid IDs are always either zero or a positive integer (-1 is invalid and should
	 *  be managed upon creation of a new pointer object.)
	 */
	id: number;

	/** Horizontal (x) and vertical (y) position of the pointer
	 *
	 *  @type {number}
	 */
	x: number;

	y: number;

	/** Velocity data describing the positional change in the horizontal (x) and vertical (y) axis of
	 *  this pointer
	 *
	 * @type {number}
	 */
	dx: number;

	dy: number;

	/** Boolean data member used to store whether or not the pointer is in a clicked state and/or a
	 *  moving state
	 *
	 *  @type {boolean}
	 */
	down: boolean;

	moved: boolean;

	/** The color the pointer will render as
	 *
	 * @type {number[]}
	 */
	color: Color;

	constructor() {
		this.id = -1;

		this.x = 0;
		this.y = 0;

		this.dx = 0;
		this.dy = 0;

		this.down = false;
		this.moved = false;

		this.color = generateColor();
	}
}
