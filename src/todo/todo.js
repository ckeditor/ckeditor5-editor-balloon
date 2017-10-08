/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */


import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import TodoEngine from './todoengine';
import MouseObserver from '@ckeditor/ckeditor5-engine/src/view/observer/mouseobserver';
import { isTodoCheckbox } from './utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import todoIcon from '../../theme/icons/todo.svg';

export default class todo extends Plugin {
	static get requires() {
		return [ TodoEngine ];
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		const command = editor.commands.get( 'todo' );
		const viewDocument = editor.editing.view;

		viewDocument.addObserver( MouseObserver );
		this.listenTo( viewDocument, 'click', ( ...args ) => this._onMousedown( ...args ) );

		// Add bold button to feature components.
		editor.ui.componentFactory.add( 'todo', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Todo list' ),
				icon: todoIcon,
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => editor.execute( 'todo' ) );

			return view;
		} );
	}

	_onMousedown( eventInfo, domEventData ) {
		const element = domEventData.target;

		if ( isTodoCheckbox( element ) ) {
			const editor = this.editor;

			editor.document.enqueueChanges( () => {
				const figure = element.parent;
				const modelTodoElement = editor.editing.mapper.toModelElement( figure );
				const currentValue = !!modelTodoElement.getAttribute( 'completed' );

				const batch = editor.document.batch();
				batch.setAttribute( modelTodoElement, 'completed', !currentValue );
			} );
		}
	}
}

