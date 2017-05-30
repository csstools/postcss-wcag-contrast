'use strict';

const onecolor = require('onecolor');
const postcss  = require('postcss');
const comma    = postcss.list.comma;
const space    = postcss.list.space;

const cssColorRegExp  = new RegExp('^(#(?:[\\da-f]{3}){1,2}|rgb\\((?:\\d{1,3},\\s*){2}\\d{1,3}\\)|rgba\\((?:\\d{1,3},\\s*){3}\\d*\\.?\\d+\\)|hsl\\(\\d{1,3}(?:,\\s*\\d{1,3}%){2}\\)|hsla\\(\\d{1,3}(?:,\\s*\\d{1,3}%){2},\\s*\\d*\\.?\\d+\\))$');
const cssLengthRegExp = new RegExp('^([-+]?0|[-+]?[0-9]*\.?[0-9]+(%|cm|in|mm|pc|pt|px|rem))$');
const cssWeightRegExp = new RegExp('^([1-9]00|bold|normal)$');
const cssParamsRegExp = new RegExp('^(\s*wcag-params:\s*(.+)\s*)$');

const cssLengthUnits = {
	cm:  0.3937 * 96,
	in:  96,
	mm:  0.3937 * 96 / 10,
	pc:  12 * 96 / 72,
	pt:  96 / 72,
	rem: 16
};

module.exports = postcss.plugin('postcss-wcag-contrast', (opts) => {
	// set options
	const compliance = opts && 'compliance' in opts ? String(opts.compliance).toUpperCase() : 'AA';

	if (compliance !== 'AAA' && compliance !== 'AA') {
		throw new Error('The `compliance` option must be "AA" or "AAA"');
	}

	// return wcag contrast plugin
	return (css, result) => {
		// walk each rule
		css.walkRules((rule) => {
			let fontsize;
			let fontweight;

			let foreground;
			let background;
			let fallbackcolor;
			let fallbacksize;
			let fallbackweight;

			// for each comment or declration of the rule
			rule.nodes.forEach((node) => {
				if (node.prop === 'color') {
					foreground = node.value;
				} else if (node.prop === 'background-color') {
					background = node.value;
				} else if (node.prop === 'font-size') {
					fontsize = getFontSize(node.value);
				} else if (node.prop === 'font-weight') {
					fontweight = getFontWeight(node.value);
				} else if (node.prop === 'font') {
					fontweight = 400;

					space(node.value.replace(/\/[^\s]+/, '')).forEach((spaceSplitValue) => {
						if (cssWeightRegExp.test(spaceSplitValue)) {
							fontweight = getFontWeight(spaceSplitValue);
						} else if (cssLengthRegExp.test(spaceSplitValue)) {
							fontsize = getFontSize(spaceSplitValue);
						}
					});
				} else if (node.prop === 'background') {
					// split background by comma and space
					comma(node.value).forEach((commaSplitValue) => {
						space(commaSplitValue).forEach((spaceSplitValue) => {
							// conditionally set the the background color
							if (cssColorRegExp.test(spaceSplitValue)) {
								background = spaceSplitValue;
							}
						});
					});
				} else if (node.type === 'comment') {
					if (cssParamsRegExp.test(node.text)) {
						// split comment by space
						space(node.text).forEach((spaceSplitValue) => {
							// conditionally define fallback values
							if (cssColorRegExp.test(spaceSplitValue)) {
								fallbackcolor = spaceSplitValue;
							} else if (cssWeightRegExp.test(spaceSplitValue)) {
								fallbackweight = getFontWeight(spaceSplitValue);
							} else if (cssLengthRegExp.test(spaceSplitValue)) {
								fallbacksize = getFontSize(spaceSplitValue);
							}
						});
					}
				}
			});

			// conditionally update foreground or background
			if (!foreground) {
				foreground = fallbackcolor;
			} else if (!background) {
				background = fallbackcolor;
			}

			// ignore rules without a foreground or background
			if (!foreground || !background) {
				return;
			}

			// conditionally update font size
			if (!fontsize) {
				fontsize = fallbacksize || 16;
			}

			// conditionally update font weight
			if (!fontweight) {
				fontweight = fallbackweight || 400;
			}

			const contrastRatio = getContrastRatio(foreground, background);

			// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#larger-scaledef
			const isLargeScale = fontsize >= 24 || fontsize >= 14 * (96 / 72) && fontweight >= 700;

			// conditionally warn of compliance
			if (compliance === 'AAA') {
				// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast7
				const minAAAContrastRatio = isLargeScale ? 4.5 : 7;
				const hasAAAContrast = contrastRatio >= minAAAContrastRatio;

				if (!hasAAAContrast) {
					rule.warn(result, contrastRatio.toFixed(2) + ':1 is an insufficient contrast ratio (WCAG 2.0 AAA requires ' + minAAAContrastRatio + ':1)');
				}
			} else if (compliance === 'AA') {
				// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast
				const minAAContrastRatio  = isLargeScale ? 3   : 4.5;
				const hasAAContrast  = contrastRatio >= minAAContrastRatio;

				if (!hasAAContrast) {
					rule.warn(result, contrastRatio.toFixed(2) + ':1 is an insufficient contrast ratio (WCAG 2.0 AA requires ' + minAAContrastRatio + ':1)');
				}
			}
		});
	};
});

function getRelativeLuminance(cssColor) {
	// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	const color = onecolor(cssColor);

	const R = color._red   <= 0.03928 ? color._red   / 12.92 : Math.pow((color._red   + 0.055) / 1.055, 2.4);
	const G = color._green <= 0.03928 ? color._green / 12.92 : Math.pow((color._green + 0.055) / 1.055, 2.4);
	const B = color._blue  <= 0.03928 ? color._blue  / 12.92 : Math.pow((color._blue  + 0.055) / 1.055, 2.4);

	const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

	return L;
}

function alphaBlend(cssForeground, cssBackground) {
	const foreground = onecolor(cssForeground);
	const background = onecolor(cssBackground);
	const result = onecolor('#fff');
	const a = foreground.alpha();

	result._red   = foreground._red   * a + background._red   * (1 - a);
	result._green = foreground._green * a + background._green * (1 - a);
	result._blue  = foreground._blue  * a + background._blue  * (1 - a);

	return result;
}

function getContrastRatioOpaque(foreground, background) {
	const L1 = getRelativeLuminance(background);
	const L2 = getRelativeLuminance(alphaBlend(foreground, background));

	// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
	return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function getContrastRatio(foreground, background) {
	const backgroundOnWhite = alphaBlend(background, '#fff');
	const backgroundOnBlack = alphaBlend(background, '#000');

	const LWhite = getRelativeLuminance(backgroundOnWhite);
	const LBlack = getRelativeLuminance(backgroundOnBlack);
	const LForeground = getRelativeLuminance(foreground);

	if (LWhite < LForeground) {
		return getContrastRatioOpaque(foreground, backgroundOnWhite);
	} else if (LBlack > LForeground) {
		return getContrastRatioOpaque(foreground, backgroundOnBlack);
	} else {
		return 1;
	}
}

function getFontSize(cssLength) {
	const fontSizeMatch = cssLength.match(cssLengthRegExp);

	const fontSize = fontSizeMatch && parseFloat(fontSizeMatch[0]);
	const fontSizeUnit = fontSizeMatch && fontSizeMatch[2];

	const fontSizeScale = fontSizeUnit in cssLengthUnits ? cssLengthUnits[fontSizeUnit] : 1;

	return fontSize ? fontSize * fontSizeScale : 16;
}

function getFontWeight(cssWeight) {
	return cssWeight === 'bold' ? 700 : cssWeight === 'normal' ? 400 : parseInt(cssWeight) || 400;
}
