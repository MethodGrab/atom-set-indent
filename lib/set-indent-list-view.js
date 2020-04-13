'use babel';

import SelectList from 'atom-select-list';
import { getCommand, toId } from './set-indent-config';

export class SetIndentListView {

	constructor( indentConfigs ) {
		this.indentConfigs = indentConfigs;

		this.selectListView = new SelectList({
			items: [],
			itemsClassList: [ 'mark-active' ],
			filterKeyForItem: indentConfig => indentConfig.label,
			elementForItem: indentConfig => {
				const element = document.createElement( 'li' );

				if ( indentConfig.id === this.currentIndentConfigId ) {
					element.classList.add( 'active' );
				}

				element.textContent = indentConfig.label;
				return element;
			},
			didConfirmSelection: indentConfig => {
				this.cancel();
				const workspaceElement = atom.views.getView( atom.workspace );
				atom.commands.dispatch( workspaceElement, getCommand( indentConfig ) );
			},
			didCancelSelection: () => {
				this.cancel();
			},
		});

		this.selectListView.element.classList.add( 'indent-config-selector' );
	}

	attach() {
		this.previouslyFocusedElement = document.activeElement;

		if ( !this.panel ) {
			this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
		}

		this.selectListView.focus();
		this.selectListView.reset();
	}

	destroy() {
		this.cancel();

		if ( this.selectListView ) {
			this.selectListView.destroy();
		}
	}

	cancel() {
		if ( this.panel ) {
			this.panel.destroy();
		}

		this.panel = null;
		this.currentIndentConfigId = null;

		if ( this.previouslyFocusedElement ) {
			this.previouslyFocusedElement.focus();
			this.previouslyFocusedElement = null;
		}
	}

	async toggle() {
		if ( this.panel ) {
			this.cancel();
		} else if ( atom.workspace.getActiveTextEditor() ) {
			const editor = atom.workspace.getActiveTextEditor();
			const softTabs = editor.getSoftTabs();
			const tabSize = editor.getTabLength();

			this.currentIndentConfigId = toId( softTabs, tabSize );

			// the items need to be added after `currentIndentConfigId` is set instead of when the `SelectList` is instantiated otherwise the `active` check will be wrong.
			await this.selectListView.update({ items: this.indentConfigs });

			this.attach();
		}
	}

}
