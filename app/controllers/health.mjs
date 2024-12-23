import { allHealthResponse, localHealthResponse, remoteHealthResponse } from '../lib/health/healthManager.mjs';

export async function healthAll(req, res) {
  const results = await allHealthResponse();
  const status = (results.summary == 'OK' ? 200 : 500)
  return res.status(status).json(results);
}

export async function localHealth(req, res) {
  const results = await localHealthResponse();
  const status = (results.summary == 'OK' ? 200 : 500)
  return res.status(status).json(results);
}

export async function remoteHealth(req, res) {
  const results = await remoteHealthResponse();
  const status = (results.summary == 'OK' ? 200 : 500)
  return res.status(status).json(results);
}
