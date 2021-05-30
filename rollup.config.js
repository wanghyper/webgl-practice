import {babel} from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import glsl from 'rollup-plugin-glsl';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs' 

export default {
    input: 'src/main.js',
    output: {
        file: './dist/bundle.js',
        format: 'esm',
    },
    plugins: [
        resolve(),
        serve({contentBase: 'dist', port: 10001}),
        glsl({
            // By default, everything gets included
            include: '**/*.glsl',
            exclude: 'node_modules/**',
            // Source maps are on by default
            sourceMap: false,
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'runtime',
            plugins: [
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-transform-runtime', {'regenerator': true}],
            ],
            'presets': [['@babel/preset-env']],
        }),
        commonjs()
    ],
};
