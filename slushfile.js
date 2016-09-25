var gulp = require('gulp')
var install = require('gulp-install')
var conflict = require('gulp-conflict')
var rename = require('gulp-rename')
var template = require('gulp-template')
var inquirer = require('inquirer')
var cookingConfig = require('cooking-config')

gulp.task('default', function (done) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Give your app a name',
      default: getNameProposal()
    },
    {
      type: 'input',
      name: 'description',
      message: 'Give your app a description',
      default: 'A vue project.'
    },
    {
      type: 'confirm',
      name: 'private',
      message: 'Private?',
      default: true
    },
    {
      type: 'list',
      name: 'vueVersion',
      message: 'Which Vue version do you want?',
      default: 2,
      choices: [
        {name: 'Vue 2', value: 2},
        {name: 'Vue 1', value: ''}
      ]
    },
    {
      type: 'list',
      name: 'js',
      message: 'Which ES2015+ compiler do you want to use?',
      default: '',
      choices: [
        {name: 'bable (preset-es2015, preset-stage-0, perset-stage-2, plugin-transform-runtime)', value: ''},
        {name: 'bublé (only use wepback 2)', value: 'buble'}
      ]
    },
    {
      type: 'list',
      name: 'cooking',
      message: 'How do you want to use cooking?',
      default: '',
      choices: [
        {name: 'Global cooking (webpack 2)', value: ''},
        {name: 'Local cooking (and use webpack 1)', value: '1'},
        {name: 'Local cooking (and use webpack 2)', value: 'beta'}
      ]
    },
    {
      type: 'confirm',
      name: 'devServer',
      message: 'Need dev server?',
      default: true
    },
    {
      type: 'list',
      name: 'csstype',
      message: 'Which CSS preprocessor do you want to use?',
      default: '',
      choices: [
        {name: 'Only CSS', value: ''},
        {name: 'Salad', value: 'saladcss'},
        {name: 'Sass', value: 'sass'},
        {name: 'Less', value: 'less'}
      ]
    },
    {
      type: 'confirm',
      name: 'unit',
      message: 'Setup unit tests with Karma + Mocha?',
      default: true
    },
    {
      type: 'input',
      name: 'github',
      message: 'git repository',
      default: cookingConfig.github
    },
    {
      type: 'input',
      name: 'author',
      message: 'author',
      default: cookingConfig.author
    },
    {
      type: 'input',
      name: 'license',
      message: 'license',
      default: 'ISC'
    },
    {
      type: 'confirm',
      name: 'moveon',
      message: 'Continue?'
    }
  ],
  function (answers) {
    if (answers.github) {
      answers.github = answers.github.replace(/\/$/, '') + '/' + answers.name
    }

    if (!answers.moveon) {
      return done()
    }

    var filesPath = [__dirname + '/template/**']
    if (!answers.unit) {
      filesPath = filesPath.concat([
        '!' + __dirname + '/template/karma.conf.js',
        '!' + __dirname + '/template/test',
        '!' + __dirname + '/template/test/**'
      ])
    }

    if (answers.js) {
      filesPath = filesPath.concat([
        '!' + __dirname + '/template/_babelrc'
      ])
    }

    gulp.src(filesPath, { dot: true })
      .pipe(template(answers))
      .pipe(rename(function (file) {
        if (file.basename[0] === '_') {
          file.basename = '.' + file.basename.slice(1)
        }
      }))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', function () {
        done()
      })
      .resume()
  })
})

function getNameProposal () {
  var path = require('path')
  try {
    return require(path.join(process.cwd(), 'package.json')).name
  } catch (e) {
    return path.basename(process.cwd())
  }
}
