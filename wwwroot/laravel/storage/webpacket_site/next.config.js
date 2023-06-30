const JavaScriptObfuscator = require("webpack-obfuscator");

module.exports = {
    webpack: (config, { buildId, dev }) => {
        if (!dev) {
            config.plugins.push(
                new JavaScriptObfuscator(
                    {
                        rotateUnicodeArray: true,
                    },
                    ["bundles/**/**.js"]
                )
            );
        }

        return config;
    },
};
