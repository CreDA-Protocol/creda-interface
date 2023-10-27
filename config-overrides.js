const path = require('path');
const { addWebpackPlugin, override, fixBabelImports, addWebpackAlias } = require("customize-cra");
const webpack = require('webpack');
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isEnvProduction = process.env.NODE_ENV === "production";

//生产环境去除console.* functions
const dropConsole = () => {
    return config => {
        if (config.optimization.minimizer) {
            config.optimization.minimizer.forEach(minimizer => {
                if (minimizer.constructor.name === 'TerserPlugin') {
                    minimizer.options.terserOptions.compress.drop_console = true
                    minimizer.options.terserOptions.compress.drop_debugger = true
                }
            })
        }
        return config
    }
}

const addCompression = () => config => {
    if (isEnvProduction) {
        config.plugins.push(
            // gzip压缩
            new CompressionWebpackPlugin({
                test: /\.(css|js)$/,
                // 只处理比1kb大的资源
                threshold: 1024,
                // 只处理压缩率低于90%的文件
                minRatio: 0.9
            })
        );
    }

    return config;
};

const webpackOverride = () => config => {
    let fallback = config.resolve.fallback || {};

    // BPI IMPORTANT NOTE: For now until we better know which node dependency is really needed, they are all removed (false).
    // TODO: restore them one by one as runtime errors are found.
    fallback = {
        util: false, // util: require.resolve("util/"),
        os: false, //os: require.resolve("os-browserify/browser"),
        http: false,  //http: require.resolve("stream-http")
        https: false, // https: require.resolve("https-browserify")
        url: false, // "url": require.resolve("url/")
        stream: false, // "stream": require.resolve("stream-browserify")
    };
    config.resolve.fallback = fallback;

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({ process: 'process/browser', Buffer: ['buffer', 'Buffer'] }),
    ]);

    // Remove source map generation logs from the terminal during build.
    // https://github.com/facebook/create-react-app/pull/11752#issuecomment-1345231546
    config.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
            return (
                warning.module &&
                warning.module.resource.includes('node_modules') &&
                warning.details &&
                warning.details.includes('source-map-loader')
            )
        },
    ];

    return config;
}

// 查看打包后各包大小
const addAnalyzer = () => config => {
    if (process.env.ANALYZER) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};

module.exports = override(
    addWebpackAlias({
        '@abi': path.resolve(__dirname, 'src/assets/abi'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@utils': path.resolve(__dirname, 'src/utils'),
    }),
    fixBabelImports('antd', {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": true
    }),
    // addCompression(),
    // BPI commented out because terserOptions seems undefined on newer react scripts - dropConsole(),
    addAnalyzer(),
    addWebpackPlugin(
        //new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }), // Import @xxxx/ from source
        // 终端进度条显示
        new ProgressBarPlugin(),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    drop_debugger: true,
                    drop_console: true
                }
            }
        })
    ),
    webpackOverride(),
);
