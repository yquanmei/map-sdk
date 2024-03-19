import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";

import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.umd.js",
    format: "umd",
    name: "MapSdk",
    sourcemap: true,
  },
  plugins: [
    typescript(),
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
