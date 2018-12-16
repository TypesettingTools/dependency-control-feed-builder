import Joi from 'joi';
import {primitive, serializable} from 'serializr';

const scriptCategories = {
  Script: 'script',
  Test: 'test',
  Lifecycle: 'lifecycle',
  SqliteSchema: 'sqliteschema',
};

export default class File {
  static ScriptCategory = scriptCategories;

  // prettier-ignore
  static schema = Joi.object().keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
    sha1: Joi.string().regex(/[0-9A-F]{40}/).required(),
    platform: Joi.string(),
    type: Joi.string().valid(Object.values(scriptCategories)),
    delete: Joi.boolean(),
  }).without('delete', ['url', 'sha1']);

  @serializable(primitive())
  name = null;

  @serializable(primitive())
  url = null;

  @serializable(primitive())
  sha1 = null;

  @serializable(primitive())
  platform = null;

  @serializable(primitive())
  type = scriptCategories.Script;

  @serializable(primitive())
  delete = false;
}
