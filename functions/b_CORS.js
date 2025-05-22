exports.handler = async (event) => {
  const ip = event.queryStringParameters.ip;
  const apiKey = 'YOUR_PROXYCHECK_KEY';

  if (!ip) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "ip" parameter' }),
    };
  }

  const url = `https://proxycheck.io/v2/${ip}?key=${apiKey}&vpn=1`;

  try {
    const response = await fetch(url);
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
