const localHealth = [];
const remoteHealth = [];

export function registerLocalHealthCheck(p) {
  localHealth.push({ key: p.key, callback: p.callback });
}
export function registerRemoteHealthCheck(p) {
  remoteHealth.push({ key: p.key, callback: p.callback });
}

async function processHealthChecks(checkers) {
  const checkPromises = checkers.map(c => ({
    key:     c.key,
    promise: c.callback(),
  }));

  const response = {
    summary: 'OK',
  };
  for (const checkPromise of checkPromises) {
    try {
      const result = await checkPromise.promise;
      response[checkPromise.key] = result;
      if (result !== 'OK') {
        response.summary = 'NOT_OK';
      }
    } catch (err) {
      response[checkPromise.key] = err.message;
      response.summary = 'NOT_OK';
    }
  }

  return response;
}

export async function localHealthResponse() {
  return processHealthChecks(localHealth);
}

export async function remoteHealthResponse() {
  return processHealthChecks(remoteHealth);
}

export async function allHealthResponse() {
  const local = await localHealthResponse();
  const remote = await remoteHealthResponse();

  let summary = 'OK';
  if (local.summary !== 'OK' || remote.summary !== 'OK') {
    summary = 'NOT_OK';
  }
  return {
    summary,
    local,
    remote,
  };
}
