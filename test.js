var tests = {
	'postcss-wcag-contrast': {
		'basic': {
			message: 'supports basic usage',
			warning: 2
		},
		'basic:aaa': {
			message: 'supports basic usage { compliance "AAA" }',
			warning: 4,
			options: {
				compliance: 'AAA'
			}
		},
		'sized': {
			message: 'supports font-size usage',
			warning: 3
		},
		'sized:aaa': {
			message: 'supports font-size usage with { compliance "AAA" }',
			warning: 3,
			options: {
				compliance: 'AAA'
			}
		},
		'weighted': {
			message: 'supports font-size & font-weight usage',
			warning: 2
		},
		'weighted:aaa': {
			message: 'supports font-size & font-weight usage { compliance "AAA" }',
			warning: 3,
			options: {
				compliance: 'AAA'
			}
		},
		'comment': {
			message: 'supports wcag-param usage',
			warning: 3
		},
		'comment:aaa': {
			message: 'supports wcag-param usage',
			warning: 4,
			options: {
				compliance: 'AAA'
			}
		},
		'alpha': {
			message: 'supports alpha transparancy',
			warning: 4
		},
		'alpha:aaa': {
			message: 'supports alpha transparancy',
			warning: 6,
			options: {
				compliance: 'AAA'
			}
		}
	}
};

var dir   = './test/';

var fs      = require('fs');
var path    = require('path');
var plugin  = require('./');
var test    = require('tape');

Object.keys(tests).forEach(function (name) {
	var parts = tests[name];

	test(name, function (t) {
		var fixtures = Object.keys(parts);

		t.plan(fixtures.length * 2);

		fixtures.forEach(function (fixture) {
			var message    = parts[fixture].message;
			var options    = Object(parts[fixture].options);
			var warning    = parts[fixture].warning || 0;
			var warningMsg = message + ' (# of warnings)';

			var baseName   = fixture.split(':')[0];

			var inputPath  = path.resolve(dir + baseName + '.css');

			options.from = inputPath;

			var inputCSS = '';
			var expectCSS = '';

			try {
				inputCSS = expectCSS = fs.readFileSync(inputPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(inputPath, inputCSS);
			}

			plugin.process(inputCSS, options).then(function (result) {
				var actualCSS = result.css;

				t.equal(actualCSS, expectCSS, message);

				t.equal(result.warnings().length, warning, warningMsg);
			});
		});
	});
});
