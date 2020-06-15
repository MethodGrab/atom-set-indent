'use babel';

import SelectList from 'atom-select-list';
import SetIndent from '../lib/set-indent';
import { getCommands } from '../lib/set-indent-config';
import { hasCommand } from './helpers';

const commands = getCommands();

const assertDefaultState = editor => {
	expect( editor.getSoftTabs() ).toEqual( false );
	expect( editor.getTabLength() ).toEqual( 4 );
};

const assertPackageActive = _ => {
	expect( atom.packages.activePackages[ 'set-indent' ] ).not.toBeUndefined();
};

const activatePackage = _ => {
	const activatePromise = Promise.all([
		atom.packages.activatePackage( 'status-bar' ),
		atom.packages.activatePackage( 'set-indent' ),
	]);

	waitsForPromise( _ => activatePromise );
};

const deactivatePackage = _ => {
	waitsForPromise( _ => atom.packages.deactivatePackage( 'set-indent' ) );
};

describe( 'set-indent', _ => {
	let workspaceElement;
	let editor;

	beforeEach( _ => {
		workspaceElement = atom.views.getView( atom.workspace );

		/*
		> ...the legacy spec environment... forces all editor DOM updates to be synchronous.... The problem is that the editor now only updates when it is visible. Since... [the] editor element isn't on the DOM, it isn't visible and therefore isn't getting updated.
		> If you need the editor element to update, [attach] it to the document....
		> -- https://github.com/atom/atom/issues/15447#issuecomment-341697201
		*/
		jasmine.attachToDOM( workspaceElement );

		waitsForPromise( _ => {
			return atom.workspace.open( 'sample-tabs.js' ).then( editor_ => {
				editor = editor_;

				editor.setSoftTabs( false );
				editor.setTabLength( 4 );
			});
		});

	});

	describe( 'activate', _ => {
		it( 'creates the commands', _ => {
			expect( commands.length ).toEqual( 16 );

			activatePackage();

			runs( _ => {
				commands.forEach( command => {
					expect( hasCommand( workspaceElement, command ) ).toBeTruthy();
				});
			});

		});
	});

	describe( 'deactivate', _ => {
		beforeEach( _ => {
			deactivatePackage();
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

			activatePackage();

			runs( _ => {
				atom.commands.dispatch( workspaceElement, 'set-indent:tabs-2' );

				expect( editor.getSoftTabs() ).toEqual( false );
				expect( editor.getTabLength() ).toEqual( 2 );
			});
		});
	});

	describe( 'when `set-indent:tabs-4` is triggered', _ => {
		it( 'updates the indentation size & style', _ => {
			assertDefaultState( editor );

			activatePackage();

			runs( _ => {
				atom.commands.dispatch( workspaceElement, 'set-indent:tabs-4' );

				expect( editor.getSoftTabs() ).toEqual( false );
				expect( editor.getTabLength() ).toEqual( 4 );
			});
		});
	});

	describe( 'when `set-indent:spaces-2` is triggered', _ => {
		it( 'updates the indentation size & style', _ => {
			assertDefaultState( editor );

			activatePackage();

			runs( _ => {
				atom.commands.dispatch( workspaceElement, 'set-indent:spaces-2' );

				expect( editor.getSoftTabs() ).toEqual( true );
				expect( editor.getTabLength() ).toEqual( 2 );
			});
		});
	});

	describe( 'when `set-indent:spaces-4` is triggered', _ => {
		it( 'updates the indentation size & style', _ => {
			assertDefaultState( editor );

			activatePackage();

			runs( _ => {
				atom.commands.dispatch( workspaceElement, 'set-indent:spaces-4' );

				expect( editor.getSoftTabs() ).toEqual( true );
				expect( editor.getTabLength() ).toEqual( 4 );
			});
		});
	});

	describe( 'when `set-indent:show` is triggered', _ => {
		it( 'shows a list of available indent configs', _ => {
			assertDefaultState( editor );

			activatePackage();

			runs( _ => {
				atom.commands.dispatch( editor.getElement(), 'set-indent:show' );
			});

			waitsForPromise( _ => SelectList.getScheduler().getNextUpdatePromise() );

			runs( _ => {
				const items = document.body.querySelectorAll( '.indent-config-selector li' );
				expect( items.length ).toEqual( 16 );
			});
		});

		it( 'adds a class to the active indent config', _ => {
			assertDefaultState( editor );

			activatePackage();

			runs( _ => {
				atom.commands.dispatch( editor.getElement(), 'set-indent:show' );
			});

			waitsForPromise( _ => SelectList.getScheduler().getNextUpdatePromise() );

			runs( _ => {
				const items = document.body.querySelectorAll( '.indent-config-selector li.active' );
				expect( items.length ).toEqual( 1 );
				expect( items[0].textContent ).toEqual( 'Tabs: 4' );
			});
		});

		describe( 'when activated -> deactivated -> activated', _ => {
			it( 'still works', _ => {
				assertDefaultState( editor );

				activatePackage();

				runs( _ => {
					deactivatePackage();
				});

				runs( _ => {
					activatePackage();
				});

				runs( _ => {
					atom.commands.dispatch( editor.getElement(), 'set-indent:show' );
				});

				waitsForPromise( _ => SelectList.getScheduler().getNextUpdatePromise() );

				runs( _ => {
					const items = document.body.querySelectorAll( '.indent-config-selector li' );
					expect( items.length ).toEqual( 16 );
				});
			});
		});
	});

	describe( 'status bar', _ => {
		const setIndentShowStatusBarDefaultConfig = atom.config.get( 'set-indent.showStatusBar' );

		const getSetIndentStatus = _ => document.querySelector( '.set-indent-status' );
		const getSetIndentStatusText = _ => getSetIndentStatus().querySelector( 'a' ).textContent;

		beforeEach( _ => {
			activatePackage();
			assertDefaultState( editor );
		});

		afterEach( _ => {
			atom.config.set( 'set-indent.showStatusBar', setIndentShowStatusBarDefaultConfig );
		});

		it( 'shows the current tab style & size in the status bar by default', _ => {
			expect( getSetIndentStatusText() ).toBe( 'Tabs: 4' );
		});

		describe( 'when the `showStatusBar` option is disabled', _ => {
			it( 'shows nothing in the status bar', _ => {
				atom.config.set( 'set-indent.showStatusBar', false );
				expect( getSetIndentStatus() ).toBeNull();
			});

			it( 'still applies the indent config', _ => {
				atom.config.set( 'set-indent.showStatusBar', false );
				expect( getSetIndentStatus() ).toBeNull();

				assertDefaultState( editor );

				runs( _ => {
					atom.commands.dispatch( workspaceElement, 'set-indent:tabs-2' );

					expect( editor.getSoftTabs() ).toEqual( false );
					expect( editor.getTabLength() ).toEqual( 2 );
				});
			});
		});

		describe( 'when activated -> deactivated -> activated', _ => {
			it( 'only shows a single instance', _ => {
				deactivatePackage();

				runs( _ => {
					activatePackage();
				});

				runs( _ => {
					assertPackageActive();
					const elements = document.querySelectorAll( '.set-indent-status' );
					expect( elements.length ).toEqual( 1 );
				});
			});
		});

		describe( 'when the tab style or size is changed by the package', _ => {
			it( 'shows the updated tab style & size (tabs-2)', _ => {
				atom.commands.dispatch( workspaceElement, 'set-indent:tabs-2' );
				waitsForPromise( _ => atom.views.getNextUpdatePromise() );

				runs( _ => {
					expect( getSetIndentStatusText() ).toBe( 'Tabs: 2' );
				});
			});

			it( 'shows the updated tab style & size (spaces-2)', _ => {
				atom.commands.dispatch( workspaceElement, 'set-indent:spaces-2' );
				waitsForPromise( _ => atom.views.getNextUpdatePromise() );

				runs( _ => {
					expect( getSetIndentStatusText() ).toBe( 'Spaces: 2' );
				});
			});
		});

		describe( 'when the active editor is changed', _ => {
			it( 'shows the updated tab style & size', _ => {
				assertDefaultState( editor );
				expect( getSetIndentStatusText() ).toBe( 'Tabs: 4' );

				waitsForPromise( _ => atom.workspace.open( 'sample-spaces-2.js' ) );
				waitsForPromise( _ => atom.views.getNextUpdatePromise() );

				runs( _ => {
					expect( getSetIndentStatusText() ).toBe( 'Spaces: 2' );
				});
			});
		});

		describe( 'when clicked', _ => {
			it( 'triggers the `set-indent:show` command', _ => {
				const eventHandler = jasmine.createSpy( 'eventHandler' );
				atom.commands.add( 'atom-text-editor', 'set-indent:show', eventHandler );

				getSetIndentStatus().click();

				expect( eventHandler ).toHaveBeenCalled();
			});
		});

		describe( 'when the package is deactivated', _ => {
			it( 'is removed from the view', _ => {
				deactivatePackage();

				runs( _ => {
					expect( getSetIndentStatus() ).toBeNull();
				});
			});
		});
	});
});
