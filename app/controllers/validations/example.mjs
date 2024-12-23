import Joi from 'joi';

export const ExampleValidation = Joi.object().keys({
  hello: Joi.string().required(),
}).options({ stripUnknown: true })
