import Joi from 'joi';
import joiSemver from 'joi-extension-semver';
import {object, serializable, deserialize, getDefaultModelSchema, map} from 'serializr';
import {promisify} from 'util';
import DepedendencyControlFeedBase from './DependencyControlFeedBase';
import ScriptPackage from './ScriptPackage';

Joi.extend(joiSemver);
const deserializePromise = promisify(deserialize);

export default class DependencyControlFeed extends DepedendencyControlFeedBase {
  // prettier-ignore
  static schema = DepedendencyControlFeedBase.schema.append({
    macros: Joi.object().pattern(
      /.*/,
      ScriptPackage.schema
    ),
    modules: Joi.object().pattern(
      /.*/,
      ScriptPackage.schema
    )
  });

  static fileName = 'DependencyControl.json';

  @serializable(map(object(ScriptPackage)))
  macros = null;

  @serializable(map(object(ScriptPackage)))
  modules = null;

  static async deserialize(obj) {
    const result = await Joi.validate(obj, DependencyControlFeed.schema, {
      abortEarly: false,
    });
    return deserializePromise(getDefaultModelSchema(DependencyControlFeed), result);
  }
}
