// netlify/functions/proxycheck.js

export async function handler(event, context) {
  const { ip } = event.queryStringParameters;

  const apiKey = "l11151-636tc1-940138-06n954";
  const url = `https://proxycheck.io/v2/${ip}?key=${apiKey}&vpn=1&asn=1`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    let data;

    if (contentType.includes("application/json")) {
      // Normal JSON response
      data = await response.json();
    } else {
      // HTML response — extract JSON from <pre> tag
      const html = await response.text();
      const match = html.match(/<pre.*?>([\s\S]*?)<\/pre>/);

      if (!match || !match[1]) throw new Error("No JSON found in HTML <pre>");

      data = JSON.parse(match[1]);
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Failed to fetch or parse proxycheck.io response" }),
    };
  }
}
