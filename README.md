# WCAG Contrast

<a href="https://github.com/postcss/postcss"><img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="80" height="80" align="right"></a>

[![NPM Version][npm-img]][npm] [![Build Status][ci-img]][ci]

[WCAG Contrast] checks CSS for [color contrast compliance] with [Web Content Accessibility Guidelines (WCAG) 2.0].

```css
.header {
	background-color: #444;
	color: #000; /* throws a warning for a low contrast of only 2.2 */
}

.footer {
	/* wcag-params: bold 14pt #777 */
	color: #000; /* throws no warning when text is bold 14pt and contrast is 4.7 */
}
```

## Usage

Add [WCAG Contrast] to your build tool:

```bash
npm install postcss-wcag-contrast --save-dev
```

#### Node

```js
require('postcss-wcag-contrast').process(YOUR_CSS, { /* options */ });
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [WCAG Contrast] as a PostCSS plugin:

```js
postcss([
	require('postcss-wcag-contrast')({ /* options */ })
]).process(YOUR_CSS, /* options */);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [WCAG Contrast] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
	return gulp.src('./src/*.css').pipe(
		postcss([
			require('postcss-wcag-contrast')({ /* options */ })
		])
	).pipe(
		gulp.dest('.')
	);
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Enable [WCAG Contrast] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			use: [
				require('postcss-wcag-contrast')({ /* options */ })
			]
		},
		dist: {
			src: '*.css'
		}
	}
});
```

## Options

##### `compliance`

Type: `String`  
Default: `"AA"`

Specifies the WCAG compliance the CSS will be evaluated against.

##### `wcag-params`

Type: `CSS Comment`

Specifies additional font size, font weight, background, and foreground information about the rule.

[ci]:      https://travis-ci.org/jonathantneal/postcss-wcag-contrast
[ci-img]:  https://img.shields.io/travis/jonathantneal/postcss-wcag-contrast.svg
[npm]:     https://www.npmjs.com/package/postcss-wcag-contrast
[npm-img]: https://img.shields.io/npm/v/postcss-wcag-contrast.svg

[Gulp PostCSS]:  https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]:       https://github.com/postcss/postcss

[color contrast compliance]: https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast
[Web Content Accessibility Guidelines (WCAG) 2.0]: https://www.w3.org/TR/WCAG20/

[WCAG Contrast]: https://github.com/jonathantneal/postcss-wcag-contrast
