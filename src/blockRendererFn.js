import removeGiphy from './modifiers/removeGiphy';

export default config => (contentBlock, { getEditorState, setEditorState }) => {
  const type = contentBlock.getType();
  if (type === 'giphy') {
    return {
      component: config.Giphy,
      props: {
        onRemove: blockKey => {
          setEditorState(removeGiphy(getEditorState(), blockKey));
        },
      },
    };
  }

  return undefined;
};
