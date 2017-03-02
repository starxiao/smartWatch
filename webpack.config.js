/**
 * Created by user on 2016/8/1.
 */



//output build.html

var path = require('path');
var webpack = require('webpack');
var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {

    entry: {
        main:'./index.js',
    },
    output: {
        path: BUILD_PATH,
        publicPath: '../build/',
        filename: 'build.js',
        chunkFilename: '[name].chunk.js',   // 添加 chunkFilename
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                
                test: /\.woff|\.svg|.eot|\.ttf/,
                loader: 'url'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./manifest.json')
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
