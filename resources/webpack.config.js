const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/quotes.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { modules: false }]],
              plugins: [
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-transform-modules-commonjs"
              ]
            }
          }
        ]
      }
    ]
  }
};
