'use babel';

import { CompositeDisposable } from 'atom';
import { indentStyles, indentSizes, getCommands } from './set-indent-config';

export default {

	subscriptions : null,

	activate( state ) {
		this.subscriptions = new CompositeDisposable();

		indentStyles.forEach( style => {
			indentSizes.forEach( size => {
				const softTabs = ( style === 'spaces' );

				this.subscriptions.add(atom.commands.add('atom-workspace', {
					[`set-indent:${style}-${size}`]: _ => this.setIndent( softTabs, size ),
				}));
			});
		});
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	setIndent( softTabs = false, length = 4 ) {
		const editor = atom.workspace.getActiveTextEditor();

		if ( editor ) {
			return Promise.all([
				editor.setSoftTabs( softTabs ),
				editor.setTabLength( length ),
			]);
		}

		return Promise.resolve();
	},

};
