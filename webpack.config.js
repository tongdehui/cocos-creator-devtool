const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const {
	VueLoaderPlugin
} = require("vue-loader");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV =
		process.argv.indexOf("-p") !== -1 ? "production" : "development";
}
const mode = process.env.NODE_ENV;

const baseConfig = {
	mode,
	entry: {
		'devtools-background': "./src/devtools-background.js",
		background: "./src/background.js",
		devtools: "./src/devtools.js",
		content: "./src/content.js"
	},
	output: {
		filename: "[name].bundle.js",
		path: path.join(__dirname, "/dist"),
		publicPath: "/"
	},
	module: {
		rules: [{
				test: /\.js$/,
				include: path.join(__dirname, "/src"),
				loader: "babel-loader"
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
				include: path.join(__dirname, "/src"),
				options: {
					loaders: {
						scss: ["style-loader", "css-loader", "sass-loader"]
					}
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf|png|jpg|jpeg)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 8192
				}
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
			},
			{
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new VueLoaderPlugin(),
		new CopyWebpackPlugin([{
			context: "src/chrome-extension",
			from: "**/*"
		}]),
		new UglifyJsPlugin()
	],
	performance: {
		hints: false
	}
};
let devConfig = baseConfig;
if (process.env.NODE_ENV === "development") {
	devConfig = merge(baseConfig, {
		devtool: "source-map",
		plugins: [new FriendlyErrorsPlugin()]
	});
}
module.exports = devConfig;