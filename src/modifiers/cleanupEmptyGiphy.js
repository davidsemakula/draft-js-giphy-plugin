/**
 * Adds backspace support to giphy
 */

import { EditorState, Modifier, SelectionState } from 'draft-js';

const cleanupGiphy = (editorState, blockKey) => {
  const content = editorState.getCurrentContent();

  // get range of the broken giphy block
  const targetRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: 0,
  });

  // convert the giphy block to a unstyled block to make text editing work
  const withoutGiphy = Modifier.setBlockType(
    content,
    targetRange,
    'unstyled'
  );
  const newState = EditorState.push(
    editorState,
    withoutGiphy,
    'remove-giphy'
  );
  return EditorState.forceSelection(
    newState,
    withoutGiphy.getSelectionAfter()
  );
};

export default (editorState) => {
  let newEditorState = editorState;

  // If there is an empty giphy block we remove it.
  // This can happen if a user hits the backspace button and removes the giphy.
  // In this case the block will still be of type giphy.
  editorState
    .getCurrentContent()
    .get('blockMap')
    .forEach(block => {
      if (block.get('type') === 'giphy' && block.getEntityAt(0) === null) {
        newEditorState = cleanupGiphy(editorState, block.get('key'));
      }
    });
  return newEditorState;
};
