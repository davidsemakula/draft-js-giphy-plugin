import React, { Component } from 'react';

export default class Giphy extends Component {

  remove = event => {
    // Note: important to avoid a content edit change
    event.preventDefault();
    event.stopPropagation();

    this.props.blockProps.onRemove(this.props.block.getKey());
  };

  render() {
    const { block, theme = {}, contentState } = this.props;

    const { gifUrl } = contentState.getEntity(block.getEntityAt(0)).getData();

    return (
      <figure
        contentEditable={false}
        data-offset-key={`${block.get('key')}-0-0`}
        className={theme.giphy}
      >
        <img src={gifUrl}
             className={theme.giphyImage}
             role="presentation"
        />
      </figure>
    );
  }
}
