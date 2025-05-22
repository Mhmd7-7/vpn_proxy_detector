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
  referrer: 'https://proxycheck.io',
  referrerPolicy: 'safe-url'
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9,ar;q=0.8',
      'cache-control': 'max-age=0',
      'cookie': 'darkmode=1; _pk_id.2.2f8e=dd411cb6dc919ec0.1747392230.; __stripe_mid=7f46020f-7c61-48f6-9474-00e126f3e3b60d0b0e; _pk_ses.2.2f8e=1; __stripe_sid=70e1373c-537a-466b-948d-29c09c2acec29b78b5; __cflb=0H28vXYAWKbeWYk4sZ78E5RJzUEYFXHo3YWQEy1vr61',
      'priority': 'u=0, i',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
      }
});

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
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
