import { ExampleValidation } from "./validations/example.mjs";
import logger from "../configs/winston.mjs";

export async function api(req, res) {
  return res.json({
    service: "{{ service-name }}",
  })
}

export async function example(req, res) {
  // Always validate inputs first
  let parsedBody;
  try {
    parsedBody = await ExampleValidation.validateAsync(req.body);
  }
  catch (err) {
    const message = err.details.map(x => x.message).join(', ');
    // Please, always ensure no PII data is logged!!
    logger.error(message)

    return res.status(422).json(err)
  }
  return res.json({
    world: parsedBody.hello,
  })
}
