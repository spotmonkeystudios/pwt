module.exports = api => {
  api.cache(true)

  return {
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-export-default-from',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          bugfixes: true,
          modules: false,
          loose: true,
          corejs: {
            version: 3,
          },
          targets: {
            esmodules: process.env.BUILD_MODE === 'modern',
          },
          useBuiltIns: 'usage',
        },
      ],
    ],
  }
}
