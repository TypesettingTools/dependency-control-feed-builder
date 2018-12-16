import Joi from 'joi';
import joiSemver from 'joi-extension-semver';
import {serializable, map, object} from 'serializr';
import ScriptPackageBase from './ScriptPackageBase';
import Release from './Release';

Joi.extend(joiSemver);

export default class ScriptPackage {
  // prettier-ignore
  static schema = ScriptPackageBase.schema.append({
    channels: Joi.object().pattern(
      /\w+/,
      Release.schema.required()
    ).required(),
  });

  @serializable(map(object(Release)))
  channels = null;
}
