// eslint-disable-next-line
const rollupGenerator = require('../../node_modules/@nosaid/rollup').rollupGenerator;

const ifProduction = process.env.NODE_ENV === 'production';

export default rollupGenerator([
    {
        input: ifProduction ? 'src/index.ts' : 'src/dev.ts',
        output: {
            file: 'dist/mini-vdom.js',
            format: 'umd',
            name: 'MiniVdom'
        },
        uglify: ifProduction,
        serve: !ifProduction
            ? {
                  open: true
              }
            : null
    }
]);
