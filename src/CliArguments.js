import minimist from 'minimist';
import Joi from 'joi';

export default class CliArguments {
  constructor(globalArgSchema, forceStringArgs) {
    this.globalArgSchema = globalArgSchema;

    this.args = Object.assign(
      ...Object.entries(
        minimist(process.argv.slice(2), {
          string: forceStringArgs,
        })
      ).map(([arg, val]) => ({[arg.replace(/-([a-z0-9])/gi, matches => matches[1].toUpperCase())]: val}))
    );

    this.positionalArgs = this.args._;
    delete this.args._;
  }

  getGlobalArgs(defaults) {
    return this.getArgs({}, defaults, true);
  }

  getArgs(keysSchema, defaults = {}, allowUnknown = false) {
    const args = Object.assign({}, defaults, this.args);
    const result = Joi.validate(args, Joi.object().keys(Object.assign(this.globalArgSchema, keysSchema)), {
      abortEarly: false,
      allowUnknown,
    });
    if (result.error !== null) throw new Error(`Invalid or incomplete CLI parameters supplied: ${result.error}`);
    return result.value;
  }
}
