import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'

const extensions = ['.ts']

const babelOptions = {
  babelrc: false,
  extensions,
  exclude: '**/node_modules/**',
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        targets: '>0.5%, not dead, not ie 11, not op_mini all',
      },
    ],
    '@babel/preset-typescript',
  ],
}

export default [
  {
    input: `./src/cannon-es-debugger`,
    output: {
      file: `dist/cannon-es-debugger.js`,
      format: 'esm',
    },
    plugins: [resolve({ extensions }), babel(babelOptions)],
    external: ['cannon-es', 'three'],
  },
  {
    input: `./src/cannon-es-debugger`,
    output: {
      file: `dist/cannon-es-debugger.cjs.js`,
      format: 'cjs',
      exports: 'default',
    },
    plugins: [resolve({ extensions }), babel(babelOptions)],
    external: ['cannon-es', 'three'],
  },
]
