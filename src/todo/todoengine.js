/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import ViewContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
import { createTodoCheckbox, getCheckboxFromFigure } from './utils';
import HeadingCommand from '@ckeditor/ckeditor5-heading/src/headingcommand';

export default class TodoEngine extends Plugin {
	init() {
		const editor = this.editor;
		const doc = editor.document;
		const schema = doc.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Schema.
		schema.registerItem( 'todo', '$block' );

		schema.allow( {
			name: 'todo',
			inside: '$root',
			attributes: [ 'completed' ]
		} );

		// Build converter from model to view for data and editing pipelines.
		buildModelConverter().for( data.modelToView, editing.modelToView )
			.fromElement( 'todo' )
			.toElement( data => {
				const modelElement = data.item;
				const viewElement = new ViewContainerElement( 'figure', { class: 'todo' } );
				const checkBox = createTodoCheckbox();
				const isCompleted = modelElement.getAttribute( 'checked' ) === true;

				if ( isCompleted ) {
					checkBox.setAttribute( 'checked', 'checked' );
					viewElement.addClass( 'checked' );
				}

				viewElement.insertChildren( 0, checkBox );

				return viewElement;
			} );

		createAttributeConverter( [ data.modelToView, editing.modelToView ], 'completed' );

		// Build converter from view to model for data pipeline.
		buildViewConverter().for( data.viewToModel )
			.from( { name: 'figure', class: 'todo' } )
			.toElement( 'todo' );

		editor.commands.add( 'todo', new HeadingCommand( editor, 'todo' ) );
	}
}

export function createAttributeConverter( dispatchers, attributeName ) {
	for ( const dispatcher of dispatchers ) {
		dispatcher.on( `addAttribute:${ attributeName }:todo`, modelToViewAttributeConverter() );
		dispatcher.on( `changeAttribute:${ attributeName }:todo`, modelToViewAttributeConverter() );
		dispatcher.on( `removeAttribute:${ attributeName }:todo`, modelToViewAttributeConverter() );
	}
}

function modelToViewAttributeConverter() {
	return ( evt, data, consumable, conversionApi ) => {
		const parts = evt.name.split( ':' );
		const consumableType = parts[ 0 ] + ':' + parts[ 1 ];
		const modelTodo = data.item;

		if ( !consumable.consume( modelTodo, consumableType ) ) {
			return;
		}

		const figure = conversionApi.mapper.toViewElement( modelTodo );
		const checkbox = getCheckboxFromFigure( figure );
		const type = parts[ 0 ];
		const newValue = data.attributeNewValue;

		if ( type == 'removeAttribute' || !newValue ) {
			checkbox.removeAttribute( 'checked' );
			figure.removeClass( 'checked' );
		} else {
			checkbox.setAttribute( 'checked', 'checked' );
			figure.addClass( 'checked' );
		}
	};
}
