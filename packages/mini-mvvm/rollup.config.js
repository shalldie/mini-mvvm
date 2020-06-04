// eslint-disable-next-line
const rollupGenerator = require('../../node_modules/@nosaid/rollup').rollupGenerator;

const ifProduction = process.env.NODE_ENV === 'production';

export default rollupGenerator([
    {
        input: ifProduction ? 'src/core/MVVM.ts' : 'src/dev.ts',
        output: {
            file: 'dist/mini-mvvm.js',
            format: 'umd',
            name: 'MiniMvvm'
        },
        uglify: ifProduction,
        serve: !ifProduction
            ? {
                  open: true
              }
            : null
    }
]);
