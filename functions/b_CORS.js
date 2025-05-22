const fetch = require('node-fetch');

exports.handler = async (event) => {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "url" query param' }),
    };
  }

  try {
    const response = await fetch(url);
    const data = await response.text(); // or .json() based on the content

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json', // adjust based on response
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
