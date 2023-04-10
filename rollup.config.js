'use strict';

import copyfiles from 'copyfiles';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

const dir = 'build';
const tsconfig = {
  paths: {
    "@em-ui/*": ["src/em-ui/*"],
  }
};

export default {
  input: 'src/index.ts',
  output: {
    dir: dir + '/scripts',
    entryFileNames: 'bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(tsconfig),
    {
      name: 'copy-assets',
      buildEnd(error) {
        if (error) {
          console.error(error);
        } else {
          copyfiles(['assets/**/*', dir], {up: 1} , (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('\x1b[32m' + `assets/**/* were copied to ${dir}` + '\x1b[0m');
            }
          });
        }
      }
    },
  ],
};