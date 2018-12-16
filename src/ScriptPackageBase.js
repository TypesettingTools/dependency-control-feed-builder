import Joi from 'joi';
import joiSemver from 'joi-extension-semver';
import {primitive, serializable, map, list} from 'serializr';

const JoiExt = Joi.extend(joiSemver);

export default class ScriptPackageBase {
  // prettier-ignore
  static schema = Joi.object().keys({
    url: Joi.string().required(),
    author: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    fileBaseUrl: Joi.string(),
    // defaultChannel: Joi.string().required(),
    changelog: Joi.object().pattern(
      JoiExt.semver().valid(),
      Joi.array().items(Joi.string().required())
    )
  });

  @serializable(primitive())
  url = null;

  @serializable(primitive())
  author = null;

  @serializable(primitive())
  name = null;

  @serializable(primitive())
  description = null;

  @serializable(primitive())
  fileBaseUrl = null;

  @serializable(map(list(primitive())))
  changelog = {};
}
