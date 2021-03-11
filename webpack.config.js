const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'webworker',
  plugins: [
    new webpack.ProvidePlugin({
      window: path.resolve(path.join(__dirname, './null.js'))
    })
  ],
  mode: 'production',
  optimization: {
    usedExports: true,
  },
}
