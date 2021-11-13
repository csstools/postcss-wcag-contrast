module.exports = {
	'postcss-wcag-contrast': {
		'basic': {
			message: 'supports basic usage',
			warning: 2,
			expect: 'basic.css'
		},
		'basic:aaa': {
			message: 'supports basic usage { compliance "AAA" }',
			warning: 4,
			options: {
				compliance: 'AAA'
			},
			expect: 'basic.css'
		},
		'sized': {
			message: 'supports font-size usage',
			warning: 3,
			expect: 'sized.css'
		},
		'sized:aaa': {
			message: 'supports font-size usage with { compliance "AAA" }',
			warning: 3,
			options: {
				compliance: 'AAA'
			},
			expect: 'sized.css'
		},
		'weighted': {
			message: 'supports font-size & font-weight usage',
			warning: 2,
			expect: 'weighted.css'
		},
		'weighted:aaa': {
			message: 'supports font-size & font-weight usage { compliance "AAA" }',
			warning: 3,
			options: {
				compliance: 'AAA'
			},
			expect: 'weighted.css'
		},
		'comment': {
			message: 'supports wcag-param usage',
			warning: 3,
			expect: 'comment.css'
		},
		'comment:aaa': {
			message: 'supports wcag-param usage',
			warning: 4,
			options: {
				compliance: 'AAA'
			},
			expect: 'comment.css'
		},
		'alpha': {
			message: 'supports alpha transparancy',
			warning: 4,
			expect: 'alpha.css'
		},
		'alpha:aaa': {
			message: 'supports alpha transparancy',
			warning: 6,
			options: {
				compliance: 'AAA'
			},
			expect: 'alpha.css'
		},
		'named-colors': {
			message: 'supports named colors',
			warning: 4,
			expect: 'named-colors.css'
		},
	}
};
