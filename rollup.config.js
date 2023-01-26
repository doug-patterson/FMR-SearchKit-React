import styles from "rollup-plugin-styles"
const autoprefixer = require('autoprefixer')
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const input = 'src/index.js'
const client = 'src/client.js'

let MODE = [
  {
    format: 'cjs'
  },
  {
    format: 'esm'
  },
  {
    format: 'umd'
  }
]

let config = []

MODE.map((m) => {
    var conf = {
        input: input,
        output: {
            name: "fmr-searchkit-react",
            file: `dist/index.${m.format}.js`,
            format: m.format,
            exports: "auto",
        },
        external: ["react", /@babel\/runtime/],
        plugins: [
            babel({
                exclude: 'node_modules/**',
                plugins: ['@babel/transform-runtime'],
                babelHelpers: 'runtime'
            }),
            styles({
                postcss: {
                    plugins: [
                        autoprefixer()
                    ]
                }
            }),
            nodeResolve(),
            commonjs(),
        ]
    }

    var clientConf = {
      input: client,
      output: {
          name: "fmr-searchkit-react/client",
          file: `dist/client.${m.format}.js`,
          format: m.format,
          exports: "auto",
      },
      external: ["react", /@babel\/runtime/],
      plugins: [
          babel({
              exclude: 'node_modules/**',
              plugins: ['@babel/transform-runtime'],
              babelHelpers: 'runtime'
          }),
          styles({
              postcss: {
                  plugins: [
                      autoprefixer()
                  ]
              }
          }),
          nodeResolve(),
          commonjs(),
      ]
  }
    config.push(conf, clientConf)
})

export default [
  ...config,
]