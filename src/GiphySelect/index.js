import React, { Component } from 'react';
import { Grid } from '@giphy/react-components';
import _ from 'lodash';

import addGiphy from '../modifiers/addGiphy';

const TYPE_GIFS = 'gifs',
    TYPE_STICKERS = 'stickers',
    TYPE_TEXT = 'text';

/**
 * Giphy Selector Component
 */
export default class GiphySelect extends Component {
  // Start the selector closed
  state = {
    open: false,
    type: TYPE_GIFS,
    query: '',
    version: `${TYPE_GIFS}:`,
  };

  // When the selector is open and users click anywhere on the page,
  // the selector should close
  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.type !== prevState.type || this.state.query !== prevState.query) {
      this.updateVersion();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  // Open the popover
  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  // Close the popover
  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  setPopoverRef = (node) => {
    this.popoverRef = node;
  };

  onOutsideClick = (e) => {
    if (this.popoverRef && !this.popoverRef.contains(e.target)) {
      this.closePopover();
    }
  };

  changeQuery = e => {
    e.preventDefault();

    this.setState({query: e.target.value || ''});
  };

  changeFilter = (type, e) => {
    e.preventDefault();
    this.setState({ type });
  };

  updateVersion = _.debounce(() => {
    const { type, query } = this.state,
        self = this;

    this.setState({ version: null });

    setTimeout(() => {
      self.setState({ version: `${type}:${query}` });
    }, 20);
  }, 200);

  // Add a giphy to the editor
  addGif = (gif, e) => {
    e.preventDefault();

    const { editorState, onChange } = this.props;
    const { id, url, slug, type, embed_url, title } = gif;

    const media = gif.images && gif.images.original || null,
        user = gif.user && _.pick(gif.user, ['username', 'display_name', 'avatar_url', 'profile_url']) || null;

    onChange(
        addGiphy(editorState, {
          id, gifUrl: media && media.url || '',
          type, url, slug, title,
          embedUrl: embed_url,
          media, user,
        })
    );
  };

  render() {
    const { apiClient, theme = {}, gridWidth=800, gridColumns=3, gridGutter=6, hideAttribution=true } = this.props;
    const { type, query, open, version } = this.state;
    const popoverClassName = open
      ? theme.selectPopover
      : theme.selectClosedPopover;
    const buttonClassName = open
      ? theme.selectPressedButton
      : theme.selectButton;

    return (
      <div className={theme.select}>
        <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type="button"
        >
          {this.props.selectButtonContent}
        </button>

        {open && (
            <div className={popoverClassName} ref={this.setPopoverRef}>
              <div className={theme.searchWrapper}>
                <input className={theme.searchInput}
                       type="text"
                       placeholder="Search GIPHY"
                       value={query}
                       onChange={this.changeQuery} />
              </div>

              <div className={theme.filterButtonWrapper}>
                {[
                  [TYPE_GIFS, 'GIFs'],
                  [TYPE_STICKERS, 'Stickers'],
                  [TYPE_TEXT, 'Text']
                ].map(([giphyType, label]) => (
                    <button className={type === giphyType?theme.filterPressedButton:theme.filterButton}
                            onClick={e => {this.changeFilter(giphyType, e)}}>{label}</button>
                ))}
              </div>

              <div className={theme.gridWrapper} style={{minWidth: gridWidth}}>
                {version && (
                    <Grid width={gridWidth}
                          columns={gridColumns}
                          gutter={gridGutter}
                          hideAttribution={hideAttribution}
                          fetchGifs={(offset) => {
                            let filters = { type, limit: 10, offset, rating: 'g' };
                            if(query) {
                              return apiClient.search(query, {...filters, sort: 'relevant'});
                            } else {
                              return apiClient.trending(filters);
                            }
                          }}
                          onGifClick={this.addGif} />
                )}
              </div>
            </div>
        )}
      </div>
    );
  }
}
