exports.handler = async (event) => {
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "ip" parameter' }),
    };
  }
  try {
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9',
  }
});

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
