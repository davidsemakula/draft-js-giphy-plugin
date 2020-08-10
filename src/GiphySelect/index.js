import React, { Component } from 'react';
import _ from 'lodash';

import addGiphy from '../modifiers/addGiphy';
import GiphyGrid from "./grid";

const TYPE_GIFS = 'gifs',
    TYPE_STICKERS = 'stickers',
    TYPE_TEXT = 'text';

/**
 * Giphy Selector Component
 */
export default class GiphySelect extends Component {
  selectorRef = null;
  popoverRef = null;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      type: TYPE_GIFS,
      query: '',
      openUp: false,
      openRight: false,
    };
  }

  // When the selector is open and users click anywhere on the page,
  // the selector should close
  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);

    this.evaluatePosition();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { open } = this.state,
      hasOpenChanged = open !== prevState.open;

    if(open && hasOpenChanged) {
      this.evaluatePosition();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  evaluatePosition = () => {
    if(this.selectorRef) {
      const viewportOffset = this.selectorRef.getBoundingClientRect();

      const topOffset = viewportOffset.top,
        bottomOffset = window.innerHeight - viewportOffset.bottom,
        leftOffset = viewportOffset.left,
        rightOffset = window.innerWidth - viewportOffset.right;

      this.setState({
        openUp: topOffset > bottomOffset,
        openRight: rightOffset > leftOffset,
      })
    }
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
    this.setState({ type,  });
  };

  // Add a giphy to the editor
  addGif = (gif) => {
    const { editorState, onChange } = this.props,
      { id, url, slug, type, embed_url, title } = gif;

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
    const { theme = {} } = this.props,
      { type, query, open, openUp, openRight } = this.state;
    const popoverClassName = open
      ? `${theme.selectPopover}${openUp?` ${theme.selectPopoverUp}`:''}${openRight?` ${theme.selectPopoverRight}`:''}`
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

        <div className={popoverClassName}
             ref={node => (this.popoverRef = node)}>
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

          {open && (
            <GiphyGrid {...this.props}
                       type={type}
                       query={query}
                       onGifClick={(gif) => {
                         this.addGif(gif);
                       }} />
          )}
        </div>
      </div>
    );
  }
}
