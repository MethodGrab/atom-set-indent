'use babel';

import { CompositeDisposable } from 'atom';
import options from './options';
import { getCommand, getIndentConfigs } from './set-indent-config';
import { SetIndentListView } from './set-indent-list-view';
import { SetIndentStatusBarView } from './set-indent-status-bar-view';

export default {

	config: options,
	subscriptions : null,

	activate( state ) {
		this.subscriptions = new CompositeDisposable();
		this.indentConfigs = getIndentConfigs();

		this.indentConfigs.forEach( indentConfig => {
			this.subscriptions.add(atom.commands.add('atom-workspace', {
				[getCommand( indentConfig )]: _ => this.setIndent( indentConfig.softTabs, indentConfig.tabSize ),
			}));
		});

		this.subscriptions.add(
			atom.commands.add( 'atom-text-editor', 'set-indent:show', this.showMenu.bind( this ) )
		);

		this.showStatusBarOptionObserverSubscription = atom.config.observe('set-indent.showStatusBar', newValue => {
			if ( newValue === true ) {
				this.consumeStatusBar( this.statusBar );
			} else if ( this.statusBarView ) {
				this.statusBarView.destroy();
				this.statusBarView = null;
			}
		});
	},

	deactivate() {
		this.subscriptions.dispose();
		this.showStatusBarOptionObserverSubscription.dispose();

		if ( this.statusBar ) {
			this.statusBar = null;
		}

		if ( this.statusBarView ) {
			this.statusBarView.destroy();
			this.statusBarView = null;
		}

		if ( this.listView ) {
			this.listView.destroy();
			this.listView = null;
		}
	},

	consumeStatusBar( statusBar ) {
		const showStatusBar = atom.config.get( 'set-indent.showStatusBar' );

		if ( this.statusBarView ) {
			this.statusBarView.destroy();
		}

		if ( statusBar ) {
			this.statusBar = statusBar;
		}

		if ( this.statusBar && showStatusBar ) {
			this.statusBarView = new SetIndentStatusBarView( this.statusBar );
			this.statusBarView.attach();
		}
	},

	async showMenu(  ) {
		if ( !this.listView ) {
			this.listView = new SetIndentListView( this.indentConfigs );
		}

		await this.listView.toggle();
	},

	async setIndent( softTabs = false, length = 4 ) {
		const editor = atom.workspace.getActiveTextEditor();

		if ( editor ) {
			await Promise.all([
				editor.setSoftTabs( softTabs ),
				editor.setTabLength( length ),
			]);

			if ( this.statusBarView ) {
				this.statusBarView.refresh();
			}
		}
	},

};
