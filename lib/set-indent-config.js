'use babel';

export const indentStyles = [ 'tabs', 'spaces' ];
export const indentSizes  = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

export const getCommands = _ => {
	const commands = [];

	indentStyles.forEach( style => {
		indentSizes.forEach( size => {
			commands.push( `set-indent:${style}-${size}` );
		});
	});

	return commands;
};
