const {
  dest, src, watch, series,
} = require('gulp');
const { EventEmitter } = require('events');

const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const postcssFixes = require('postcss-fixes');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// const remove = require('gulp-html-remove');
const sitemap = require('gulp-sitemap');

const handleError = (error) => {
  const emitter = new EventEmitter();
  emitter.emit('end');
  console.error(error.toString());
};

const buildStyles = async () => src('src/assets/styles/main.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(
    postcss([
      postcssFixes,
      autoprefixer,
      cssnano({
        safe: true,
        calc: false,
      }),
    ]),
  )
  .pipe(rename('style.min.css'))
  .pipe(dest('public/assets/styles'))
  .pipe(browserSync.stream());

const buildPug = async () => src('src/markup/pages/**/*.pug')
  .pipe(plumber())
  .pipe(
    pug({
      pretty: true,
    }),
  )
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(dest('public'))
  .pipe(browserSync.stream());

// task('exported-html-cleaner', () => src('src/markup/blocks/metabaza/ChatExport/messages.html');
//   .pipe(remove('head, .page_header, .sticker, .photo'))
//   .pipe(rename('index.html'))
//   .pipe(dest('src/markup/blocks/metabaza')));

const buildJs = async () => src('src/assets/js/*.js')
  .pipe(babel({
    presets: ['@babel/env'],
  }))
  .on('error', handleError)
  .pipe(dest('public/assets/js'))
  .pipe(browserSync.stream());

const jsDebug = async () => src('src/assets/js/*.js')
  .on('error', handleError)
  .pipe(dest('public/assets/js'))
  .pipe(browserSync.stream());

const buildImages = async () => src('src/assets/img/**/*.{png,jpg,gif,webp}')
  .pipe(dest('public/assets/img'));

const buildSvg = async () => src('src/**/**/**/*.svg')
  .pipe(svgmin())
  .pipe(dest('public/'));

const serve = async () => {
  browserSync.init({
    server: 'public',
    notify: true,
    open: false,
  });

  watch('src/**/**/*.scss', buildStyles);
  watch('src/markup/**/**/**/**/*.pug', buildPug);
  watch('src/assets/img/**/*.*', buildImages);
  watch('src/assets/js/**/*.js', jsDebug);
};

const copy = () => src(
  [
    './src/assets/fonts/**/*.{woff,woff2}',
    './src/assets/video/**/*.mp4',
    './src/shows/**',
  ], {
    base: './src',
  },
)
  .pipe(dest('./public/'));

const clean = async () => del.sync([
  'public/**',
  '!public',
  '!public/*',
  '!public/assets',
  '!public/assets/video/**',
  '!public/assets/fonts/**',
  'public/assets/img*',
  '!public/shows',
  '!public/shows/motivation*',
  '!public/shows/255-shades-of-gray*',
]);

exports.buildSitemap = () => src(['public/**/index.html', 'public/**/.html'], {
  read: false,
})
  .pipe(sitemap({
    siteUrl: 'https://m0rtyn.github.io/martyn-guru-site/',
    priority: (siteUrl, loc) => (loc.match(/papers|posts/g) ? 1 : 0.5),
  }))
  .pipe(dest('./public'));

exports.dev = series(
  clean,
  copy,
  buildPug,
  buildStyles,
  jsDebug,
  buildImages,
  buildSvg,
  serve,
);

exports.build = series(
  clean,
  copy,
  buildPug,
  buildStyles,
  buildJs,
  buildImages,
  buildSvg,
);
