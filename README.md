# DraftJS Giphy Plugin

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin allows you to add gifs and stickers from [Giphy](https://giphy.com/) to your editor!

Usage:

```js
import createGiphyPlugin from '@davidsemakula/draft-js-giphy-plugin';

const giphyPlugin = createGiphyPlugin({});
const { GiphySelect } = giphyPlugin;
```

## Importing the default styles

The plugin ships with a default styling available at this location in the installed package:
`node_modules/@davidsemakula/draft-js-giphy-plugin/lib/plugin.css`.

### Webpack Usage
Follow the steps below to import the css file by using Webpack's `style-loader` and `css-loader`. 

1. Install Webpack loaders: `npm install style-loader css-loader --save-dev`
2. Add the below section to Webpack config (if your Webpack already has loaders array, simply add the below loader object(`{test:foo, loaders:bar[]}`) as an item in the array).

    ```js
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: [
          'style-loader', 'css'
        ]
      }]
    }
    ```

3. Add the below import line to your component to tell Webpack to inject style to your component.

    ```js
    import '@davidsemakula/draft-js-giphy-plugin/lib/plugin.css';
    ```
4. Restart Webpack.

## Exported functions

| Props                                          | Description
| -----------------------------------------------|------------:|
| add(editorState: Object, gif: Object) | add a Giphy ContentBlock after the current Selection|
| remove(editorState: Object, blockKey: String) | removes a Giphy ContentBlock|
| Giphy | the default Giphy Component |
| GiphySelect | a basic GiphySelector |
