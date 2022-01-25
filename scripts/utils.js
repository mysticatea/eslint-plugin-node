'use strict';

const pkg =  require('../package.json');
exports.pluginName = pkg.name.replace(/^eslint-plugin-/u, '');

