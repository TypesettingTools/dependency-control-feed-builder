import Joi from 'joi';
import joiSemver from 'joi-extension-semver';
import {primitive, serializable, map} from 'serializr';

const JoiExt = Joi.extend(joiSemver);
const httpUriScheme = {scheme: ['http', 'https']};

export default class DepedendencyControlFeedBase {
  // prettier-ignore
  static schema = Joi.object().keys({
    dependencyControlFeedFormatVersion: JoiExt.semver().valid().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    baseUrl: Joi.string().uri(httpUriScheme),
    url: Joi.alternatives().try(
      Joi.valid('@{baseUrl}'),
      Joi.string().uri(httpUriScheme),
    ).required(),
    fileBaseUrl: Joi.alternatives().try(
      Joi.valid('@{baseUrl}'),
      Joi.string().uri(httpUriScheme),
    ).required(),
    maintainer: Joi.string().required(),
    knownFeeds: Joi.object().pattern(
      /.*/,
      Joi.string().uri(httpUriScheme)
    )
  })

  @serializable(primitive())
  dependencyControlFeedFormatVersion = null;

  @serializable(primitive())
  name = null;

  @serializable(primitive())
  description = null;

  @serializable(primitive())
  baseUrl = null;

  @serializable(primitive())
  url = null;

  @serializable(primitive())
  fileBaseUrl = null;

  @serializable(primitive())
  maintainer = null;

  @serializable(map(primitive()))
  knownFeeds = null;
}
