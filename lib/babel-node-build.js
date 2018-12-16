const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');

const preset = require.resolve('@babel/preset-env');
const getBabelNodeBuildStream = (sourcesPath, nodeVersion = '8.14.0') =>
  gulp
    .src(path.join(sourcesPath))
    .pipe(sourceMaps.init())
    .pipe(
      babel({
        presets: [
          [
            preset,
            {
              targets: {
                node: nodeVersion,
              },
            },
          ],
        ],
        env: {
          test: {
            plugins: [
              [
                require.resolve('babel-plugin-istanbul'),
                {
                  exclude: '**/*.spec.js',
                },
              ],
            ],
          },
        },
        plugins: [
          [
            require.resolve('@babel/plugin-proposal-decorators'),
            {
              legacy: true,
            },
          ],
          [
            require.resolve('@babel/plugin-proposal-class-properties'),
            {
              loose: true,
            },
          ],
          require.resolve('@babel/plugin-syntax-dynamic-import'),
          require.resolve('babel-plugin-dynamic-import-node'),
          require.resolve('@babel/plugin-proposal-optional-chaining'),
        ],
      })
    )
    .pipe(sourceMaps.write());

const createBabelNodeBuildTask = (packagePath = process.cwd(), nodeVersion) => {
  const babelBuildTask = (sourcesPath, destinationPath) => () =>
    getBabelNodeBuildStream(sourcesPath, nodeVersion).pipe(gulp.dest(destinationPath));

  const tasks = gulp.series(
    babelBuildTask(path.join(packagePath, 'src', '**', '*.js'), path.join(packagePath, 'build')),
    babelBuildTask(path.join(packagePath, 'test', 'src', '**', '*.js'), path.join(packagePath, 'test', 'build'))
  );
  tasks.displayName = `babel-build-node-v${nodeVersion}`;

  return tasks;
};
module.exports = {
  createBabelNodeBuildTask,
  getBabelNodeBuildStream,
};
