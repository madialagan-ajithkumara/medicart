const http = require('http');
const { calculateTotal } = require('./app');

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || 'v1';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // Health check used by Kubernetes readiness/liveness probes
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  // Example: /total?price=500&qty=2  ->  {"price":500,"qty":2,"total":1000}
  if (url.pathname === '/total') {
    const price = Number(url.searchParams.get('price') || 0);
    const qty = Number(url.searchParams.get('qty') || 0);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ price, qty, total: calculateTotal(price, qty) }));
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`MediCart ${VERSION}\n`);
});

server.listen(PORT, () => console.log(`MediCart ${VERSION} listening on port ${PORT}`));
