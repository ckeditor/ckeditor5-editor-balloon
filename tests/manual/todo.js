/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals document, console */

import BalloonEditor from '../../src/ballooneditor';
import ArticlePluginSet from '@ckeditor/ckeditor5-core/tests/_utils/articlepluginset';
import Todo from '../../src/todo/todo';

BalloonEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ ArticlePluginSet, Todo ],
		toolbar: [ 'bold', 'italic', 'link', 'todo' ],
	} )
	.then( newEditor => {
		window.editor = newEditor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );

