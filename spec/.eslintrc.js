module.exports = {
	extends : [
		'../.eslintrc.js',
	],

	env : {
		jasmine: true,
	},

	globals : {
		waitsForPromise: false,
	},

	rules : {
		'no-param-reassign' : 'off',
	},
};
