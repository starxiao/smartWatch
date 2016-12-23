/**
 * Created by user on 2016/8/16.
 */

const webpack = require('webpack');

const vendors = [
    'react',
    'react-dom',
    'react-router',
    'weui',
];
module.exports = {
    entry: {
        "lib": vendors
    },
    output: {
        path: 'build',
        filename: 'lib.js',
        library: 'lib',
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: 'lib',
            context: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};


//  webpack --config dll.config.js