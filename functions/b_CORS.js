const https = require('https');

exports.handler = async (event) => {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "url" query param' }),
    };
  }

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: data
        });
      });
    }).on('error', (err) => {
      reject({
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      });
    });
  });
};
