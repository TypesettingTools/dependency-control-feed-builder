import Joi from 'joi';
import joiSemver from 'joi-extension-semver';
import {primitive, serializable} from 'serializr';

const JoiExt = Joi.extend(joiSemver);
const httpUriScheme = {scheme: ['http', 'https']};

export default class Dependency {
  // prettier-ignore
  static schema = Joi.object().keys({
    moduleName: Joi.string().required(),
    name: Joi.string(),
    url: Joi.string().uri(httpUriScheme),
    version: JoiExt.semver().valid(),
    feed: Joi.string(), // TODO: validate is mentioned in knownFeeds if present
  });

  @serializable(primitive())
  moduleName = null;

  @serializable(primitive())
  name = null;

  @serializable(primitive())
  url = null;

  @serializable(primitive())
  version = null;

  @serializable(primitive())
  feed = null;
}
