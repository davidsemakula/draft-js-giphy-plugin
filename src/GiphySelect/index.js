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

  selectorRef = null;
  popoverRef = null;

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

  // Toggle the popover
  togglePopover = () => {
    this.setState({
      open: !this.state.open
    });
  };

  // Close the popover
  closePopover = () => {
    if (this.state.open) {
      this.setState({
        open: false,
      });
    }
  };

  onOutsideClick = (e) => {
    if (this.popoverRef && !this.popoverRef.contains(e.target) &&
      this.selectorRef && !this.selectorRef.contains(e.target)) {
      // Ignore clicks inside popover or on selector
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

    this.closePopover();
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
          onMouseUp={this.togglePopover}
          type="button"
          ref={node => (this.selectorRef = node)}
        >
          {this.props.selectButtonContent}
        </button>

        {open && (
            <div className={popoverClassName} ref={node => (this.popoverRef = node)}>
              <div className={theme.searchWrapper}>
                <input className={theme.searchInput}
                       type="search"
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
