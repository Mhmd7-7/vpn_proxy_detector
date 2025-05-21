// netlify/functions/proxycheck.js

export async function handler(event, context) {
  const { ip } = event.queryStringParameters;

  const apiKey = "l11151-636tc1-940138-06n954";
  const url = `https://proxycheck.io/v2/${ip}?key=${apiKey}&vpn=1&asn=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Optional: restrict this in production
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data from proxycheck.io" }),
    };
  }
}
