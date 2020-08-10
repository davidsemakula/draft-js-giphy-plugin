import React, { Component } from 'react';
import _ from 'lodash';

import { giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow } from "../theme";

/**
 * Giphy Grid Component
 */
export default class GiphyGrid extends Component {
  gridWrapperRef = null;
  gridRef = null;

  constructor(props) {
    super(props);

    this.state = {
      version: null,
      gifs: [],
      count: 0,
      isLoading: false,
      isError: false,
      hasPacked: false,
      gridWidth: 0,
    };
  }

  componentDidMount() {
    if(this.gridWrapperRef) {
      this.gridWrapperRef.addEventListener('scroll', this.onGridScroll);
    }
    if(this.gridRef && this.gridRef.offsetWidth) {
      this.setState({gridWidth: this.gridRef.offsetWidth});
    }
    this.fetchGifs();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { gifs, gridWidth } = this.state,
      hasFiltered = this.props.type !== prevProps.type,
      hasSearched = this.props.query !== prevProps.query;

    if(hasFiltered || hasSearched) {
      if(hasSearched) {
        this.delayedFetchGifs(); // Debounced
      } else {
        this.fetchGifs(); // Immediate
      }
    }

    const actualGridWidth = this.gridRef && this.gridRef.offsetWidth || 0;
    if(actualGridWidth && actualGridWidth !== gridWidth) {
      this.setState({gridWidth: actualGridWidth});
    }
  }

  componentWillUnmount() {
    if(this.gridWrapperRef) {
      this.gridWrapperRef.removeEventListener('scroll', this.onGridScroll);
    }
  }

  onGridScroll = _.debounce((e) => {
    if(this.gridWrapperRef && this.gridRef) {
      const scrollTop = this.gridWrapperRef.scrollTop || 0,
        viewPortHeight = this.gridWrapperRef.offsetHeight || 0,
        contentHeight = this.gridRef.offsetHeight || 0;

      const scrollableSpace =  contentHeight - viewPortHeight,
        scrolledRatio = scrollTop && (scrollTop/scrollableSpace) || 0;

      const { isLoading } = this.state;

      if(scrolledRatio >= 0.8 && !isLoading) {
        // TODO: Enable load more
        // this.delayedFetchGifs();
      }
    }
  }, 100);

  fetchGifs = e => {
    if(e) {
      e.preventDefault();
    }

    const { type, query, apiClient, limit = 10 } = this.props,
      { count = 0, gifs = [], isLoading, version :prevVersion } = this.state,
      version = `${type}:${query || ''}`,
      isLoadMore = version === prevVersion;

    if(isLoading || (isLoadMore && count <= gifs.length && gifs.length)) {
      return; // Either already loading or we've reached the end of the list
    }

    const offset = isLoadMore && gifs.length || 0,
      filters = {type, limit, offset, rating: 'g'};

    const apiMethod = query && apiClient.search(query, {...filters, sort: 'relevant'}) || apiClient.trending(filters);
    const existingGifs = isLoadMore?gifs:[];

    this.setState({
      ...(isLoadMore?{}:{
        gifs: [],
        count: null,
      }),
      isLoading: true,
      isError: false,
    });

    if(!isLoadMore && this.gridWrapperRef) {
      this.gridWrapperRef.scrollTo(0, 0);
    }

    apiMethod.then(res => {
      this.setState({
        gifs: [...existingGifs, ...(res.data || [])],
        count: res.pagination && res.pagination.total_count || 0,
        isLoading: false,
        isError: false,
        version,
      });
    }).catch(e => {
      this.setState({
        isLoading: false,
        isError: true,
      });
    });
  };

  delayedFetchGifs = _.debounce(this.fetchGifs, 20);

  addGif = (gif, e) => {
    e.preventDefault();

    const { onGifClick } = this.props;
    if(onGifClick) {
      onGifClick(gif);
    }
  };

  parseColumns = () => {
    const { gridColumns = 2, gridGutter = 4 } = this.props,
      { gifs, gridWidth } = this.state;

    const gutterOffset = gridGutter * (gridColumns - 1);
    const gifWrapperWidth = Math.floor((gridWidth - gutterOffset)/gridColumns);

    let columns = [],
      columnsTracker = [];

    _.range(0, gridColumns).forEach(idx => {
      columns[idx] = [];
      columnsTracker[idx] = 0;
    });

    for (let gif of gifs.filter(gif => gif.images && gif.images.original)) {
      const { url, width, height } = gif.images.original;

      if(!url || !parseInt(width) || !parseInt(height)) {
        continue;
      }

      const gifWrapperHeight = Math.floor((gifWrapperWidth*parseInt(height))/parseInt(width));

      const minVal = Math.min(...columnsTracker);
      const minValIdx = columnsTracker.indexOf(minVal);

      columns[minValIdx].push(gif);
      columnsTracker[minValIdx] = minVal + gifWrapperHeight;
    }

    return {
      gutterOffset,
      gifWrapperWidth,
      columns
    };
  }

  render() {
    const { theme = {}, errorMessage = 'Error loading GIFs.' } = this.props,
      { isLoading, isError, gridWidth } = this.state;

    const colors = [giphyBlue, giphyGreen, giphyPurple, giphyRed, giphyYellow];
    const getRandomColor = () => colors[Math.floor(Math.random() * Math.floor(colors.length))];

    const { gutterOffset, gifWrapperWidth, columns } = this.parseColumns();

    return (
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
            {gridWidth && columns.map(column => {
              return (
                <div className={theme.gridColumn} style={{ width: gifWrapperWidth }}>
                  {column.map(gif => {
                    const { url, width, height } = gif.images.original;

                    if(!url || !parseInt(width) || !parseInt(height)) return null;

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
                  })}
                </div>
              );
            }) || null}
          </div>
        ))}
      </div>
    );
  }
}
