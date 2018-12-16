import Joi from 'joi';
import joiSemver from 'joi-extension-semver';
import {serializable, list, primitive, object, date} from 'serializr';
import File from './File';
import Dependency from './Dependency';

const JoiExt = Joi.extend(joiSemver);

export default class Release {
  // prettier-ignore
  static schema = Joi.object().keys({
    version: JoiExt.semver().valid().required(),
    released: Joi.date().required(),
    default: Joi.boolean().required(),
    files: Joi.array().items(File.schema.required()).required(),
    platforms: Joi.array().items(Joi.string().required()),
    requiredModules: Joi.array().items(Dependency.schema),
  });

  @serializable(primitive())
  version = null;

  @serializable(date())
  released = null;

  @serializable(primitive())
  default = null;

  @serializable(list(object(File)))
  files = null;

  @serializable(list(primitive()))
  platforms = null;

  @serializable(list(object(Dependency)))
  requiredModules = null;
}
