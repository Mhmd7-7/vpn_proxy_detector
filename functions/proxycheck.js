const fetch = require('node-fetch');

exports.handler = async (event) => {
  const ip = event.queryStringParameters.ip;

  if (!ip) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'IP address is required' }),
    };
  }

  try {
    const response = await fetch(`https://proxycheck.io/v2/${ip}?key=YOUR_API_KEY&vpn=1`);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch proxy check data' }),
    };
  }
};
