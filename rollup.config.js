import typescript from 'rollup-plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const config = {
    input: 'src/stackmat.ts',
    output: {
        file: 'dist/umd/stackmat.js',
        format: 'umd',
        name: 'Stackmat'
    },
    plugins: [
        typescript({
            typescript: require('typescript')
        })
    ]
}

if (process.env.BUILD === 'minify') {
    config.output.file = 'dist/umd/stackmat.min.js'
    config.plugins.push(terser())
}

export default config
