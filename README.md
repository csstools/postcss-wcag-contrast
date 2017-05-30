# WCAG Contrast [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[WCAG Contrast] checks CSS for [color contrast compliance] with
[Web Content Accessibility Guidelines (WCAG) 2.0].

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

Use [WCAG Contrast] to process your CSS:

```js
require('postcss-wcag-contrast').process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [WCAG Contrast] as a plugin:

```js
postcss([
  require('postcss-wcag-contrast')()
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [WCAG Contrast] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-wcag-contrast')()
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

Use [WCAG Contrast] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-wcag-contrast')()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### compliance

Type: `String`  
Default: `"AA"`

The `compliance` option specifies the WCAG compliance the CSS will be evaluated
against.

### wcag-params

Type: `CSS Comment`

The `wcag-params` specifies additional font size, font weight, background, and
foreground information about the rule.

[npm-url]: https://www.npmjs.com/package/postcss-wcag-contrast
[npm-img]: https://img.shields.io/npm/v/postcss-wcag-contrast.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-wcag-contrast
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-wcag-contrast.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-wcag-contrast
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-wcag-contrast.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[WCAG Contrast]: https://github.com/jonathantneal/postcss-wcag-contrast
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss

[color contrast compliance]: https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast
[Web Content Accessibility Guidelines (WCAG) 2.0]: https://www.w3.org/TR/WCAG20/
