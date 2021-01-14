const path = require('path');
module.exports = {
    entry: './core/cli/bin/core.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'core.js'
    },
    externals: {
        'import-local': `require("import-local")`
    },
    mode: 'development', // 'production'
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(dist)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ "@babel/preset-env" ],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                  "corejs": 3,
                                  "helpers": true,
                                  "regenerator": true,
                                  "useESModules": true
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    }
}