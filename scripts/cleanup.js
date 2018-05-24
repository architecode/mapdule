const shell = require('shelljs');

const outDir = require('../tsconfig.json').compilerOptions.outDir;
shell.rm('-rf', outDir);
shell.rm('-rf', '.nyc_output');
shell.rm('-rf', 'typings');
shell.rm('-rf', 'index.js');
shell.rm('-rf', 'index.js.map');