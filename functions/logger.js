exports.handler = async (event, context) => {
  const data = {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body,
    timestamp: new Date().toISOString(),
  };

  console.log("🔔 New Request Received:", JSON.stringify(data, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Request received", data }),
  };
};
