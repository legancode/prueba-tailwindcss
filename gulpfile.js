// #1 Acceder al paquete
const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const zindex = require('postcss-zindex')
const nthChild = require('postcss-nth-child-fix')
const pseudoelements = require('postcss-pseudoelements')
const tailwindcss = require('tailwindcss')

// Config para produccion o develop
const production = false

// config SASS
const sassOptionsDev = {
  includePaths: ['node_modules'],
  sourceComments: true,
  outputStyle: 'expanded'
}

const sassOptionsProd = {
  includePaths: ['node_modules'],
  outputStyle: 'compressed'
}

// Config PostCSS
const postcssPluginsDev = [
  tailwindcss(),
  // autoprefixer(),
  zindex(),
  nthChild(),
  pseudoelements()
]

const postcssPluginsProd = [
  tailwindcss(),
  autoprefixer(),
  zindex(),
  nthChild(),
  pseudoelements()
]

// #2 Crear tareas

// Tarea SASS
function stylesDev() {
  return src('./src/styles/**/*.{scss,css}')
    .pipe(sass(sassOptionsDev).on("error", sass.logError))
    .pipe(postcss(postcssPluginsDev))
    .pipe(dest('./public/css'))
    .pipe(browserSync.stream())
}

function stylesProd() {
  return src('./src/styles/**/*.scss')
    .pipe(sass(sassOptionsProd).on("error", sass.logError))
    .pipe(postcss(postcssPluginsProd))
    .pipe(dest('./public/css'))
    .pipe(browserSync.stream())
}

// Tarea PUG
function views() {
  return src('./src/views/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('./public/'))
}

// Tarea BABEL MODERN JS TO ES2015
function babelScripts() {
  return src('./src/scripts/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat("scripts-min.js"))
    .pipe(uglify())
    .pipe(dest('./public/js'))
}

// Tarea WATCH
function serve() {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
    port: 8080
  })

  production
    ? watch(['./src/styles/**/*.{scss,css}'], stylesProd)
    : watch(['./src/styles/**/*.{scss,css}'], stylesDev)
  // watch("./src/styles/*.scss", style)
  // watch("./src/views/*.pug", views).on('change', browserSync.reload)
  watch("./public/*.html").on('change', browserSync.reload)
  watch("./src/scripts/*.js", babelScripts).on('change', browserSync.reload)
}

// Exportaciones
exports.stylesDev = stylesDev
exports.stylesProd = stylesProd
exports.views = views
exports.babelScripts = babelScripts
exports.serve = serve