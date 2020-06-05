import React, { Component } from 'react';
import _ from 'lodash';
import Bricks from 'bricks.js'

import addGiphy from '../modifiers/addGiphy';
import {giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow} from "../theme";

const TYPE_GIFS = 'gifs',
    TYPE_STICKERS = 'stickers',
    TYPE_TEXT = 'text';

/**
 * Giphy Selector Component
 */
export default class GiphySelect extends Component {
  selectorRef = null;
  popoverRef = null;
  gridWrapperRef = null;
  gridRef = null;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      type: TYPE_GIFS,
      query: '',
      version: `${TYPE_GIFS}:`,
      gifs: [],
      count: 0,
      isLoading: false,
      isError: false,
      hasPacked: false,
      gridWidth: 0,
    };
  }

  // When the selector is open and users click anywhere on the page,
  // the selector should close
  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
    if(this.gridWrapperRef) {
      this.gridWrapperRef.addEventListener('scroll', this.onGridScroll);
    }
    if(this.gridRef && this.gridRef.offsetWidth) {
      this.setState({gridWidth: this.gridRef.offsetWidth});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { open, gifs, version, gridWidth } = this.state,
      hasToggledOpen = open !== prevState.open,
      hasFiltered = this.state.type !== prevState.type,
      hasSearched = this.state.query !== prevState.query,
      hasChangedVersion = version !== prevState.version,
      hasChangedWidth = gridWidth !== prevState.gridWidth;

    if(open && (hasToggledOpen || hasFiltered || hasSearched)) {
      if(hasSearched) {
        this.delayedFetchGifs(); // Debounced
      } else {
        this.fetchGifs(); // Immediate
      }

      if(hasToggledOpen && this.gridRef && this.gridRef.offsetWidth) {
        this.setState({gridWidth: this.gridRef.offsetWidth || 0});
      }
    }

    if(open && gifs.length) {
      if(!this.bricksInstance || hasChangedVersion || hasChangedWidth) {
        this.initializeBricks();
        if(this.gridWrapperRef) {
          this.gridWrapperRef.scrollTo(0, 0);
        }
      } else if(this.bricksInstance && !_.isEqual(gifs, prevState.gifs)) {
        this.updateBricks();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
    if(this.gridWrapperRef) {
      this.gridWrapperRef.removeEventListener('scroll', this.onGridScroll);
    }
    this.closeBricks();
  }

  initializeBricks = () => {
    const { theme = {}, gridColumns = 2, gridGutter = 4 } = this.props,
      { type, query } = this.state,
      container = document.querySelector(`.${theme.grid}`);

    if(container) {
      this.bricksInstance = Bricks({
        position: false,
        container,
        packed: `data-packed-${type || ''}-${(query || '').replace(/[^A-Za-z]/ig, '-')}`,
        sizes: [
          {columns: gridColumns, gutter: gridGutter},
        ]
      });

      this.bricksInstance.resize(true);
      this.bricksInstance.pack();
    }
  }

  updateBricks = () => {
    const { gifs } = this.state;
    if(gifs.length && this.bricksInstance) {
      this.bricksInstance.update();
    }
  };

  updateBrick = (e) => {
    const { gifs } = this.state;
    if(gifs.length && this.bricksInstance && e && e.target) {
      const target = e.target;
      target.removeAttribute('data-packed');
      if(target.parentElement) {
        target.parentElement.removeAttribute('data-packed');
      }
      this.bricksInstance.update();
    }
  };

  closeBricks = () => {
    if(this.bricksInstance) {
      this.bricksInstance.resize(false);
      this.bricksInstance = null;
    }
  };

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

  onGridScroll = _.debounce((e) => {
    if(this.gridWrapperRef && this.gridRef) {
      const scrollTop = this.gridWrapperRef.scrollTop || 0,
        viewPortHeight = this.gridWrapperRef.offsetHeight || 0,
        contentHeight = this.gridRef.offsetHeight || 0;

      const scrollableSpace =  contentHeight - viewPortHeight,
        scrolledRatio = scrollTop && (scrollTop/scrollableSpace) || 0;

      if(scrolledRatio >= 0.7) {
        // TODO: Enable load more
        //this.delayedFetchGifs();
      }
    }
  }, 100);

  changeQuery = e => {
    e.preventDefault();
    this.setState({query: e.target.value || ''});
  };

  changeFilter = (type, e) => {
    e.preventDefault();
    this.setState({ type,  });
  };

  fetchGifs = (e) => {
    if(e) {
      e.preventDefault();
    }

    const { apiClient, limit = 100 } = this.props,
      { type, query, count = 0, gifs = [], version :prevVersion, isLoading } = this.state,
      version =`${type}:${query}`,
      isLoadMore = prevVersion === version;

    if(isLoading || (isLoadMore && count <= gifs.length && gifs.length)) {
      return; // Either already loading or we've reached the end of the list
    }

    const offset = isLoadMore && gifs.length || 0,
      filters = {type, limit, offset, rating: 'g'};

    const apiMethod = query && apiClient.search(query, {...filters, sort: 'relevant'}) || apiClient.trending(filters);
    const existingGifs = isLoadMore?gifs:[];

    this.setState({
      gifs: existingGifs,
      isLoading: true,
      isError: false,
      version: isLoadMore && version || null,
    });

    apiMethod.then(res => {
      this.setState({
        gifs: [...existingGifs, ...(res.data || [])],
        isLoading: false,
        version,
        count: res.pagination && res.pagination.total_count || 0
      });
    }).catch(e => {
      this.setState({
        gifs: existingGifs,
        isLoading: false,
        isError: true,
        version
      });
    });
  };

  delayedFetchGifs = _.debounce(this.fetchGifs, 200);

  // Add a giphy to the editor
  addGif = (gif, e) => {
    e.preventDefault();

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
    const { theme = {}, errorMessage = 'Error loading GIFs.', gridColumns = 2, gridGutter = 4 } = this.props,
      { type, query, open, gifs, isLoading, isError, gridWidth } = this.state;
    const popoverClassName = open
      ? theme.selectPopover
      : theme.selectClosedPopover;
    const buttonClassName = open
      ? theme.selectPressedButton
      : theme.selectButton;

    const colors = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow];
    const getRandomColor = () => {
      return colors[Math.floor(Math.random() * Math.floor(colors.length))];
    };

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

          <div className={theme.gridWrapper}
               ref={node => (this.gridWrapperRef = node)}>
            {isLoading?(
              <div className={theme.gridLoader}>
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
            ):(isError?(
              <div className={theme.gridFetchError}>
                {errorMessage} <a onClick={this.fetchGifs}>Try again?</a>
              </div>
            ):(
              <div className={theme.grid} ref={node => (this.gridRef = node)}>
                {gridWidth && _.filter(gifs, gif => gif.images && gif.images.original).map(gif => {
                  const { url, width, height } = gif.images.original;

                  if(!url || !parseInt(width) || !parseInt(height)) return null;

                  const gutterOffset = gridGutter * (gridColumns - 1);
                  const gifWrapperWidth = Math.floor((gridWidth - gutterOffset)/gridColumns);
                  const gifWrapperHeight = Math.floor((gifWrapperWidth*parseInt(height))/parseInt(width));

                  return (
                    <div className={theme.gridImageWrapper}
                         style={{width: gifWrapperWidth, height: gifWrapperHeight, backgroundColor: getRandomColor()}}>
                      <img src={url}
                           className={theme.gridImage}
                           onClick={e => this.addGif(gif, e)}
                           onLoad={e => {
                             const parent = e.target && e.target.parentElement || null;
                             if(parent) {
                               parent.classList.add('image-loaded');
                             }
                           }}
                      />
                    </div>
                  );
                }) || null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
