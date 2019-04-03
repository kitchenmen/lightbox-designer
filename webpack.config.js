var webConfig = {
  entry: './src/main.js',
  output: {
    filename: 'build.js',
    library: 'LightBoxBuilder',
    libraryTarget: 'var'
  },
  module: {
      rules: [
        { test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        }
      ]
    },
  devServer: {
    hot: true,
    compress: true,
    contentBase: '.',
    port: 6001,
    host: 'localhost',
    disableHostCheck: true,
    public: 'http://localhost:6001',
    publicPath: 'http://localhost:6001'
  }
};

module.exports = webConfig;
