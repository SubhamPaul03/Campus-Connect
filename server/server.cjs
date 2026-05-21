const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const defaultState = {
  payments: [],
  notifications: [],
  classes: [],
  requests: [],
  students: [],
  departments: [],
  messages: [],
  events: [],
  assignments: [],
};

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultState, null, 2));
  }
}

function readDb() {
  ensureDb();
  try {
    return { ...defaultState, ...JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) };
  } catch {
    return defaultState;
  }
}

function writeDb(state) {
  ensureDb();
  const nextState = { ...defaultState, ...state, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DB_PATH, JSON.stringify(nextState, null, 2));
  return nextState;
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function collectionName(url) {
  const match = url.match(/^\/api\/collections\/([a-zA-Z0-9_-]+)/);
  return match?.[1];
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 204, {});
  }

  try {
    if (req.url === '/api/health' && req.method === 'GET') {
      return send(res, 200, { ok: true, service: 'campus-connect-api', time: new Date().toISOString() });
    }

    if (req.url === '/api/state' && req.method === 'GET') {
      return send(res, 200, readDb());
    }

    if (req.url === '/api/state' && req.method === 'PUT') {
      const body = await readBody(req);
      return send(res, 200, writeDb(body));
    }

    const name = collectionName(req.url || '');
    if (name) {
      const db = readDb();
      const collection = Array.isArray(db[name]) ? db[name] : [];

      if (req.method === 'GET') {
        return send(res, 200, collection);
      }

      if (req.method === 'POST') {
        const body = await readBody(req);
        const record = { id: body.id || `${name}-${Date.now()}`, ...body };
        db[name] = [record, ...collection];
        writeDb(db);
        return send(res, 201, record);
      }

      if (req.method === 'PATCH') {
        const body = await readBody(req);
        if (!body.id) return send(res, 400, { error: 'id is required' });
        db[name] = collection.map((item) => (item.id === body.id ? { ...item, ...body } : item));
        writeDb(db);
        return send(res, 200, db[name].find((item) => item.id === body.id));
      }
    }

    return send(res, 404, { error: 'Route not found' });
  } catch (error) {
    return send(res, 500, { error: error.message || 'Internal server error' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Campus Connect API running at http://127.0.0.1:${PORT}`);
});
