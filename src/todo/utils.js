/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import ViewUiElement from '@ckeditor/ckeditor5-engine/src/view/uielement';

const todoCheckboxSymbol = Symbol( 'todo-checkbox' );

export function createTodoCheckbox() {
	const checkBox = new ViewUiElement( 'input', { type: 'checkbox' } );
	checkBox.setCustomProperty( todoCheckboxSymbol, true );

	return checkBox;
}

export function isTodoCheckbox( element ) {
	return element instanceof ViewUiElement && element.getCustomProperty( todoCheckboxSymbol ) === true;
}

export function getCheckboxFromFigure( viewFigure ) {
	for ( const node of viewFigure.getChildren() ) {
		if ( isTodoCheckbox( node ) ) {
			return node;
		}
	}
}
