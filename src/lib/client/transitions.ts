import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function typewriter(node: HTMLElement, { speed = 1 }: { speed?: number }) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		throw new Error(`This transition only works on elements with a single text node child`);
	}

	const text = node.textContent;
	if (text == null) return;
	const duration = text.length / (speed * 0.01);

	return {
		duration,
		tick: (t: number) => {
			const i = ~~(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}

/** @param {number | string} value
 * @returns {[number, string]}
 */
function split_css_unit(value: string | number): [number, string] {
	const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return split ? [parseFloat(split[1]), split[2] || 'px'] : [value as number, 'px'];
}

export function float(
	node: Element,
	{
		delay = 0,
		duration = 400,
		easing = cubicOut,
		x = 0,
		y = 0,
		opacity = 0,
		out = false
	}: {
		delay?: number;
		duration?: number;
		easing?: (t: number) => number;
		x?: number | string;
		y?: number | string;
		opacity?: number;
		out?: boolean;
	} = {}
): TransitionConfig {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const od = target_opacity * (1 - opacity);
	const [x_value, x_unit] = split_css_unit(x);
	const [y_value, y_unit] = split_css_unit(y);
	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
      ${out ? 'position: absolute;' : ''}
			transform: ${transform} translate(${(1 - t) * x_value}${x_unit}, ${(1 - t) * y_value}${y_unit});
			opacity: ${target_opacity - od * u}`
	};
}
