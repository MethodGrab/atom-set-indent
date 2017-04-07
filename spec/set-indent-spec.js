'use babel';

import SetIndent from '../lib/set-indent';
import { getCommands } from '../lib/set-indent-config';
import { hasCommand } from './helpers';

const commands = getCommands();

const assertDefaultState = editor => {
	expect( editor.getSoftTabs() ).toEqual( false );
	expect( editor.getTabLength() ).toEqual( 4 );
};

describe( 'set-indent', _ => {
	let workspaceElement;
	let activationPromise;
	let editor;

	beforeEach( _ => {
		workspaceElement = atom.views.getView( atom.workspace );
		activationPromise = atom.packages.activatePackage( 'set-indent' );

		waitsForPromise( _ => {
			return atom.workspace.open().then(e => {
				editor = e;

				editor.setSoftTabs( false );
				editor.setTabLength( 4 );
			});
		});

	});

	describe( 'activate', _ => {
		it( 'creates the commands', _ => {
			expect( commands.length ).toEqual( 16 );

			commands.forEach( command => {
				expect( hasCommand( workspaceElement, command ) ).toBeTruthy();
			});
		});
	});

	describe( 'deactivate', _ => {
		beforeEach( _ => {
			atom.packages.deactivatePackage( 'set-indent' );
		});

		it( 'destroys the commands', _ => {
			commands.forEach( command => {
				expect( hasCommand( workspaceElement, command ) ).toBeFalsy();
			});
		});
	});

	describe( 'when `set-indent:tabs-2` is triggered', _ => {
		it( 'updates the indentation size & style', _ => {
			assertDefaultState( editor );

			atom.commands.dispatch( workspaceElement, 'set-indent:tabs-2' );
			waitsForPromise( _ => activationPromise );

			runs( _ => {
				expect( editor.getSoftTabs() ).toEqual( false );
				expect( editor.getTabLength() ).toEqual( 2 );
			});
		});
	});

	describe( 'when `set-indent:tabs-4` is triggered', _ => {
		it( 'updates the indentation size & style', _ => {
			assertDefaultState( editor );

			atom.commands.dispatch( workspaceElement, 'set-indent:tabs-4' );
			waitsForPromise( _ => activationPromise );

			runs( _ => {
				expect( editor.getSoftTabs() ).toEqual( false );
				expect( editor.getTabLength() ).toEqual( 4 );
			});
		});
	});

	describe( 'when `set-indent:spaces-2` is triggered', _ => {
		it( 'updates the indentation size & style', _ => {
			assertDefaultState( editor );

			atom.commands.dispatch( workspaceElement, 'set-indent:spaces-2' );
			waitsForPromise( _ => activationPromise );

			runs( _ => {
				expect( editor.getSoftTabs() ).toEqual( true );
				expect( editor.getTabLength() ).toEqual( 2 );
			});
		});
	});

	describe( 'when `set-indent:spaces-4` is triggered', _ => {
		it( 'updates the indentation size & style', _ => {
			assertDefaultState( editor );

			atom.commands.dispatch( workspaceElement, 'set-indent:spaces-4' );
			waitsForPromise( _ => activationPromise );

			runs( _ => {
				expect( editor.getSoftTabs() ).toEqual( true );
				expect( editor.getTabLength() ).toEqual( 4 );
			});
		});
	});
});
