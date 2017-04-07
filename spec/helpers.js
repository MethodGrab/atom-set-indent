'use babel';

// :: (element: HTMLElement, name: String) → Boolean
// Indicates whether `element` has a command named `name`
export function hasCommand( element, name ) {
	const commands = atom.commands.findCommands({ target: element });

	for ( const command of commands ) {
		if ( command.name === name ) {
			return true;
		}
	}

	return false;
}
