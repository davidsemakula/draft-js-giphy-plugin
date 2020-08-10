import React from 'react';
import { Map } from 'immutable';
import { GiphyFetch } from '@giphy/js-fetch-api';

import addGiphy from './modifiers/addGiphy';
import removeGiphy from './modifiers/removeGiphy';
import cleanupEmptyGiphy from './modifiers/cleanupEmptyGiphy';
import blockRendererFn from './blockRendererFn';
import Giphy from './Giphy';
import GiphySelect from './GiphySelect';
import { defaultTheme } from './theme.js';

export default (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme;
  const selectButtonContent = config.selectButtonContent
    ? config.selectButtonContent
    : '☺';

  const hideAttribution = typeof config.hideAttribution === 'boolean'?config.hideAttribution:true,
      gridColumns = config.gridColumns || 2,
      gridGutter = config.gridGutter || 4,
      limit = config.limit || 10,
      errorMessage = config.errorMessage || 'Error loading GIFs.';

  const gf = new GiphyFetch(config.apiKey);

  const DecoratedGiphy = props => (
    <Giphy
      {...props}
      theme={theme}
    />
  );

  const DecoratedGiphySelect = props => (
    <GiphySelect
      {...props}
      apiClient={gf}
      selectButtonContent={selectButtonContent}
      gridColumns={gridColumns}
      gridGutter={gridGutter}
      theme={theme}
      hideAttribution={hideAttribution}
      limit={limit}
      errorMessage={errorMessage}
    />
  );
  const blockRendererConfig = {
    ...config,
    Giphy: DecoratedGiphy,
  };
  return {
    blockRendererFn: blockRendererFn(blockRendererConfig),
    onChange: cleanupEmptyGiphy,
    add: addGiphy,
    remove: removeGiphy,
    blockRenderMap: Map({ giphy: { element: 'div' } }),
    GiphySelect: DecoratedGiphySelect,
  };
};
