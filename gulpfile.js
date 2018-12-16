require('source-map-support').install();

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const requireDefault = modulePath => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const obj = require(modulePath);
  // eslint-disable-next-line no-underscore-dangle
  return obj && obj.__esModule ? obj.default : obj;
};

let DependencyControlFeed, CliArguments;

const loadBuiltModules = () => {
  if (DependencyControlFeed !== undefined) return;

  DependencyControlFeed = requireDefault('./build/DependencyControlFeed');
  CliArguments = requireDefault('./build/CliArguments');
  // TerraformValidationError = require('./build/TerraformWorkspace').TerraformValidationError;
};

const initialize = () => {
  loadBuiltModules();

  return new CliArguments({
    repository: (fs.existsSync(path.join(process.cwd(), DependencyControlFeed.fileName))
      ? Joi.string().default(process.cwd())
      : Joi.string().required()
    ).error(
      new Error(
        'Must specify a valid repository using the --repository CLI parameter or run this in a directory containing a DependencyControl.json.'
      )
    ),
  });
};

const validateFeedTask = async () => {
  const cliArgs = initialize();
  const args = cliArgs.getArgs();

  const feedFilePath = path.join(args.repository, DependencyControlFeed.fileName);
  console.info(`Validating feed '${feedFilePath}'...`);
  const feedFile = fs.readFileSync(feedFilePath);
  await DependencyControlFeed.deserialize(JSON.parse(feedFile));
  console.info('Feed appears to be syntactically valid.');
};

validateFeedTask.description =
  'Validate an existing DependencyControl.json feed in the root path of a repository. Currently only checks syntax.';
validateFeedTask.flags = {
  '--repository <name>': 'Local Git repository the feed resides in.',
};
gulp.task('validate-feed', validateFeedTask);

const buildCleanTask = done => {
  // eslint-disable-next-line global-require
  const delTask = require('./lib/del');
  gulp.series(
    delTask(path.join(__dirname, 'build/**/*'), 'src-build'),
    delTask(path.join(__dirname, 'test/build/**/*'), 'test-build')
  )(done);
};
buildCleanTask.description = 'Deletes existing build artifacts.';
gulp.task('build-clean', buildCleanTask);

const buildTask = gulp.series('build-clean', done => {
  // eslint-disable-next-line global-require
  const {createBabelNodeBuildTask} = require('./lib/babel-node-build');
  createBabelNodeBuildTask()(done);
});
buildTask.description = 'Builds the source code using the Babel transpiler.';
gulp.task('build', buildTask);
