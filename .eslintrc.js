module.exports = {
	extends : [
		'@methodgrab/standard',
		'@methodgrab/standard/browser',
		'@methodgrab/standard/esnext',
	],

	env : {},

	globals : {
		atom: false,
	},

	rules : {
		'comma-dangle': [ 'error', {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'always-multiline',
			exports: 'always-multiline',
			functions: 'never',
		}],
		'no-console': 'error',
		'no-shadow': [ 'error', { allow: [ '_' ] } ],
		'no-warning-comments': [ 'error', {
			terms: [ 'fixme', 'xxx' ],
			location: 'start',
		}],
	},
};
