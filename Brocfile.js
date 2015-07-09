var funnel = require('broccoli-funnel'),
  mergeTrees = require('broccoli-merge-trees'),
  autopref = require('broccoli-autoprefixer'),
  compileSass = require('broccoli-sass'),
  scssLint = require('broccoli-scss-lint'),
  cleanCSS = require('broccoli-clean-css'),
  replace = require('broccoli-string-replace'),
  uglifyJS = require('broccoli-uglify-sourcemap'),
  concat = require('broccoli-concat'),
  minImg = require('broccoli-imagemin'),
  svgo = require('broccoli-svgo'),
  zetzer = require('broccoli-zetzer');

var assets = 'assets/',
  app = 'app',
  img = 'img',
  svg = 'svg';
  fonts = 'fonts';

/**************************************************
 * FONTS
 **************************************************/
var fontsTree = funnel(assets+'/'+fonts, {
  destDir: 'assets/fonts'
});

/**************************************************
 * SASS
 **************************************************/


// Main Style
var sass = funnel(assets + 'sass/');


var appCss = compileSass([sass], 'style.scss', 'assets/style/style.css');
var autoPrefixCSS = autopref(appCss, {
  sourceMap: true,
  browsers: ['> 1%', 'last 2 versions', 'Chrome 5', 'Firefox 6']
});

var fullStyle = mergeTrees([autoPrefixCSS]);

// Concat autoPrefixCSS & svgicons
autoPrefixCSS = concat(fullStyle, {
  inputFiles: [
    'assets/style/*.css'
  ],
  outputFile: '/assets/style/style.css'
});

// Minify main stylesheet
var cleanedCSS = cleanCSS(autoPrefixCSS, {
  sourceMap: true,
  strict
  : true
});
// Rename main stylesheet ( style.css -> style.min.css )
cleanedCSS = funnel(cleanedCSS, {
  destDir: 'assets/style',
  getDestinationPath: function(relativePath) {
    return 'style.min.css';
  }
});


// Merge CSS
var fullCSS = mergeTrees([autoPrefixCSS, cleanedCSS]);


/**************************************************
 * JS
 **************************************************/
// Libraries
var concatLibJS = concat(funnel('assets/library/'), {
  inputFiles: ['**/*.js'],
  outputFile: '/assets/library/lib.min.js'
});
var uglifyLibJS = uglifyJS(concatLibJS, {
  compress: true,
  mangle: true,
  sourceMapConfig: {
    enabled: true
  }
});
var appJS = funnel('assets/app/');
var concatAppJS = concat(mergeTrees([appJS]), {
  inputFiles: ['**/*.js'],
  outputFile: '/assets/scripts/app.min.js'
});
var uglifyJS = uglifyJS(concatAppJS, {
  compress: true,
  mangle: true,
  sourceMapConfig: {
    enabled: true
  }
});


// Final JS
var fullJS = mergeTrees([uglifyLibJS, uglifyJS]);


/**************************************************
 * TEMPLATES
 **************************************************/
var htmls = zetzer({
  pages:     'assets/pages',
  partials:  'assets/partials',
  templates: 'assets/templates',
  dot_template_settings: {
    strip: false
  }
});
var destHtml5 = funnel(htmls, {
  destDir: 'html',
  getDestinationPath: function(relativePath) {
    // Remove path
    var levels = relativePath.split('/');
    // Change extensions
    return levels[levels.length - 1].replace('.dot', '');
  }
});

var fullHTML = mergeTrees([destHtml5]);

/**************************************************
 * PNG / JPG / SVG
 **************************************************/
var images = funnel(assets + img, {
  destDir: assets + 'img'
});
var svgs = funnel(assets + svg, {
  destDir: assets + 'svg'
});
var svgsTree = svgo(svgs);
var imgsTree = minImg(images);
var appImgs = mergeTrees([images, svgs/*svgsTree, imgsTree*/], {overwrite: true});

/**************************************************
 * EXPORTS
 **************************************************/
module.exports = mergeTrees([fullCSS, fullJS, fullHTML, appImgs, fontsTree]);
