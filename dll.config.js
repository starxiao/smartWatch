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
            path: 'manifest.json',                  // 生成独立的库文件
            name: 'lib',
            context: __dirname
        }),
        new webpack.DefinePlugin({                  //把react形成product文件，如同react.min.js
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({          //单纯的压缩文件
            compress: {
                warnings: false
            }
        })
    ]
};


//  webpack --config dll.config.js