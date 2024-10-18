// config-overrides.js
module.exports = {
    webpack: function (config, env) {
      config.module.rules[1].oneOf.unshift({
        test: /\.m?js/,
        include: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            ['@babel/plugin-transform-runtime']
          ]
        }
      });
      return config;
    }
  };
  