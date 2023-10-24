import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
export default {
  input: "./src/commands/index.ts",
  output: [
    {
      file: "./dist/index.js",
      format: "commonjs",
    },
  ],
  plugins: [commonjs(), typescript()],
};
