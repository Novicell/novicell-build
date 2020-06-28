const path = require('path');
const root_folder = __dirname;

// ------------------------------------------------------------
// Fill in values for these variables

const mainSettings = {
    dist: './dist/',
    sourceRootFolder: './src/',
    modulesDir: './src/modules/**/*.js',
    assetsDir: './assets/',
    cssConfig: './config/styles/postcss.config.js',
};

// ------------------------------------------------------------
// ------------------------------------------------------------

module.exports = {
    root_folder,
    mainSettings,
    relativeDist: mainSettings.dist,
    fullConfigsPath: path.join(root_folder, '/config/'),
    componentsDir: {
        main: root_folder + '/src',
        atoms: '01-atoms',
        molecules: '02-molecules',
        organisms: '03-organisms',
        pages: '04-pages',
    },
};
