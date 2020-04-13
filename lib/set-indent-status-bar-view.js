'use babel';

import { Disposable } from 'atom';
import { pluralize } from './helper';
import { toLabel } from './set-indent-config';

export class SetIndentStatusBarView {

	constructor( statusBar ) {
		this.statusBar = statusBar;
		this.element = document.createElement( 'set-indent-status' );
		this.element.classList.add( 'set-indent-status', 'inline-block' );
		this.indentLink = document.createElement( 'a' );
		this.indentLink.classList.add( 'inline-block' );
		this.element.appendChild( this.indentLink );

		this.activeItemSubscription = atom.workspace.observeActiveTextEditor( this.refresh.bind( this ) );

		const clickHandler = e => {
			e.preventDefault();
			atom.commands.dispatch( atom.workspace.getActiveTextEditor().element, 'set-indent:show' );
		};

		this.element.addEventListener( 'click', clickHandler );
		this.clickSubscription = new Disposable( _ => this.element.removeEventListener( 'click', clickHandler ) );
	}

	destroy() {
		if ( this.activeItemSubscription ) {
			this.activeItemSubscription.dispose();
		}

		if ( this.clickSubscription ) {
			this.clickSubscription.dispose();
		}

		if ( this.tile ) {
			this.tile.destroy();
		}

		if ( this.tooltip ) {
			this.tooltip.dispose();
		}
	}

	attach() {
		this.tile = this.statusBar.addRightTile({ item: this.element, priority: 0 });
	}

	refresh() {
		this.updateIndentText();
	}

	updateIndentText() {
		atom.views.updateDocument(_ => {
			const editor = atom.workspace.getActiveTextEditor();

			if ( editor ) {
				const softTabs = editor.getSoftTabs();
				const tabSize = editor.getTabLength();

				const tabPlurals = { n: 'tabs', 1: 'tab' };
				const spacePlurals = { n: 'spaces', 1: 'space' };

				const indentStyle = pluralize( tabSize, softTabs ? spacePlurals : tabPlurals );

				this.indentLink.textContent = toLabel( softTabs, tabSize );
				this.element.style.display = '';

				if ( this.tooltip ) {
					this.tooltip.dispose();
				}

				this.tooltip = atom.tooltips.add( this.indentLink, { title: `This file uses ${tabSize} ${indentStyle} for indentation` } );
			} else {
				this.element.style.display = 'none';
			}
		});
	}

}
