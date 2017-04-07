module.exports = {
	extends : [
		'@methodgrab/standard',
		'@methodgrab/standard/esnext',
	],

	env : {},

	globals : {
		atom: false,
	},

	rules : {
		'no-shadow': [ 'error', { allow: [ '_' ] } ],
	},
};
