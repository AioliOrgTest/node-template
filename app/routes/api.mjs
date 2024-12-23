import express from 'express'
import { wrap } from './helpers/wrap.mjs'
import { api, example } from '../controllers/api.mjs'

const router = new express.Router()

router.get('/', wrap(api));
router.post('/example', wrap(example));

export default router;
