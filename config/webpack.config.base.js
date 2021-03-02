const path = require("path");
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  module: {
    rules: [
      {
        test: /(\.css|\.less)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: path.resolve(appDirectory, "src"),

        loader: require.resolve("babel-loader"),
        options: {
          customize: require.resolve(
            "babel-preset-react-app/webpack-overrides"
          ),

          plugins: [
            [
              "@babel/plugin-transform-react-jsx",
              {
                pragma: "h",
                pragmaFrag: "Fragment",
              },
            ],
            require.resolve("@babel/plugin-proposal-optional-chaining"),

            [
              require.resolve("babel-plugin-named-asset-import"),
              {
                loaderMap: {
                  svg: {
                    ReactComponent: "@svgr/webpack?-prettier,-svgo![path]",
                  },
                },
              },
            ],
          ],
          cacheDirectory: true,
          // Save disk space when time isn't as important
          cacheCompression: true,
          compact: true,
        },
      },
    ],
  },

  resolve: {
    alias: {
      "@/*": "src/*",
    },
  },
};
