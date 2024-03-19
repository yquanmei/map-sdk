import postcss from "rollup-plugin-postcss";
import { eslint } from "rollup-plugin-eslint";
// import commonjs from "@rollup/plugin-commonjs";
// import clear from "rollup-plugin-clear";
// import external from "rollup-plugin-peer-deps-external";
// import url from "rollup-plugin-url";

import babel from "@rollup/plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
// import json from "rollup-plugin-json";
import dts from "rollup-plugin-dts";

import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";
// import typescript from "@rollup/plugin-typescript";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

const env = process.env.NODE_ENV;

export default [
  {
    input: "src/index.ts",
    // output: {
    //   dir: "lib",
    //   format: "cjs",
    //   sourcemap: true,
    //   exports: "named",
    // },
    output: {
      file: "dist/index.umd.js",
      format: "umd", // UMD 模块化方案
      name: "MapSdk", // UMD 模块化方案需要指定全局变量名称
      globalObject: "this",
    },
    //告诉rollup不要将此lodash打包，而作为外部依赖
    external: ["lodash"],
    // 是否开启代码分割
    experimentalCodeSplitting: true,
    plugins: [
      // 将声明文件拷贝到输出目录
      copy({
        targets: [{ src: "src/**/*.d.ts", dest: "dist" }],
      }),
      typescript(),
      postcss({
        extensions: [".pcss", ".less", ".css"],
        plugins: [nested(), cssnext({ warnForDuplicates: false }), cssnano()],
        extract: false, // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
      }),

      // url(),
      babel({
        exclude: ["node_modules/**"],
      }),
      resolve(),
      // commonjs({
      //   include: ["node_modules/**"],
      // }),
      // json(),
      eslint({
        include: ["src/**/*.js"],
        exclude: ["src/styles/**"],
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify(env),
      }),
      env === "production" && uglify(),
    ],
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: {
      format: "umd",
      file: "dist/index.d.ts",
    },
  },
];
