var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var productionConfig = [{
    entry: {
        page1: './client/page1/index.ts',
        cms: './client/cms/index.ts',
        site: './client/site/index.ts'
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.jpg','.png','.html','.svg','.eot','.ttf','.woff','.ts', '.webpack.js', '.web.js', '.js']
    },
    module: {
        rules: [{
            test: /\.(png|jpg)$/,
            use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
        },{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
            })
        },{
            test: /\.(html|svg)$/,
            use: 'file-loader?context=client&name=[path][name].[ext]'
        },{
            test: /\.ts$/,
            use: 'awesome-typescript-loader'
        },{ 
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
            loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]" 
        },{ 
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
            loader: "file-loader?&name=[path][name].[ext]" 
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['public']),
        new ExtractTextPlugin({
            filename: './[name]/index.css',
            allChunks: true
        })
    ]
}];

module.exports = productionConfig;
