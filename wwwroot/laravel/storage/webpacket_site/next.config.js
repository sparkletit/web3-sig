const JavaScriptObfuscator = require('webpack-obfuscator')

module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
    }
  },
  webpack: (config, { buildId, dev }) => {
    if (!dev) {
      config.plugins.push(
        new JavaScriptObfuscator(
          {
            rotateUnicodeArray: true,
          },
          ['bundles/**/**.js']
        )
      )
    }

    return config
  },
}
