const outputs = require('../../backend/outputs.json');
const fs = require('node:fs');

const apiUrl = outputs.DevbgApiStack.ApiGatewayUrl;
const content = `BACKEND_URL=${apiUrl}`;

fs.writeFileSync('.env', content, (err) => {
  if (err) {
    console.error(err);
  }
});
