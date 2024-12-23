// All Percipio services are required to adhere to a unified health check endpoints standard,
// which is outlined here: 
// https://skillsoftdev.atlassian.net/wiki/x/G4jPNw

import express from 'express'
import { healthAll, localHealth, remoteHealth } from '../controllers/health.mjs'
import { wrap } from './helpers/wrap.mjs'

const router = new express.Router();

router.get('/public/health/v1/ping', (req, resp) => resp.end('pong'));
router.get('/health/v1/all', wrap(healthAll));
router.get('/health/v1/remote', wrap(remoteHealth));
router.get('/health/v1/local', wrap(localHealth));

export default router;
