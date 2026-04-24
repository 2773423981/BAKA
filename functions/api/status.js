export async function onRequest(context) {
  const resp = await fetch('https://status-api.jjjkkklll258000.workers.dev/status');
  const data = await resp.json();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
