exports.handler = async (event) => {
  const url = event.queryStringParameters.ip;
  const apiKey = "l11151-636tc1-940138-06n954";

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "ip" parameter' }),
    };
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
  
  const div = document.createElement('div');

// Add text inside the div
div.textContent = response;

// Optionally add it to the document body or another element
document.body.appendChild(div);
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: response
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
