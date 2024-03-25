import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";

import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "esm", // ES6 模块化方案
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "MapSdk",
    },
  ],
  plugins: [
    typescript({
      sourceMap: false,
    }),
    resolve(),
    postcss({
      extract: false,
      minimize: true,
      sourceMap: true,
    }),
    commonjs(),
    terser(),
  ],
};
