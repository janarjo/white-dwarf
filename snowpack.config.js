// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mode: 'development',
    plugins: [
        '@snowpack/plugin-typescript',
        [
            '@snowpack/plugin-run-script',
            {
                cmd: 'eslint src --ext .ts',
            },
        ],
    ],
    packageOptions: {
    },
    devOptions: {
    },
    buildOptions: {
        sourcemap: true
    }
}
