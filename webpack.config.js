var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3333/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
    entry: {
        page1: ['./client/page1/index.ts', hotMiddlewareScript],
        cms: ['./client/cms/index.ts', hotMiddlewareScript],
        site: ['./client/site/index.ts', hotMiddlewareScript]
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: publicPath
    },
    resolve: {
        extensions: ['.jpg','.png','.html','.ts', '.webpack.js', '.web.js', '.js']
    },
    devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.(png|jpg)$/,
            use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader?sourceMap',
                'resolve-url-loader',
                'sass-loader?sourceMap'
            ]
        },{
            test: /\.ts$/,
            use: 'awesome-typescript-loader'
        },{
            test: /\.html$/,
            use: 'file-loader'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

module.exports = devConfig;
