exports.handler = async (event) => {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Missing "url" query parameter.',
    };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    let html = await response.text();

    // Convert relative hrefs to proxied absolute URLs
    const baseUrl = url.replace(/\/$/, ''); // Remove trailing slash if exists

    html = html.replace(/href="(.*?)"/g, (match, link) => {
      // Ignore full absolute links (http/https)
      if (link.startsWith('http://') || link.startsWith('https://')) return match;

      // Otherwise, rewrite it
      const proxied = `https://ipvp.netlify.app/.netlify/functions/bypass_CORS?url=${encodeURIComponent(baseUrl + '/' + link.replace(/^\/+/, ''))}`;
      return `href="${proxied}"`;
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
      body: html,
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: `Error: ${err.message}`,
    };
  }
};
