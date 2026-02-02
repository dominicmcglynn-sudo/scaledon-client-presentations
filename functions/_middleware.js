// Basic Auth middleware for Cloudflare Pages
// Username: scaledon
// Password: scaledon2026

const CREDENTIALS = {
  username: 'scaledon',
  password: 'scaledon2026'
};

function unauthorized() {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="ScaledOn Client Presentations"'
    }
  });
}

function parseCredentials(authHeader) {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64 = authHeader.slice(6);
    const decoded = atob(base64);
    const [username, password] = decoded.split(':');
    return { username, password };
  } catch {
    return null;
  }
}

export async function onRequest(context) {
  const authHeader = context.request.headers.get('Authorization');
  const credentials = parseCredentials(authHeader);

  if (!credentials) {
    return unauthorized();
  }

  if (credentials.username !== CREDENTIALS.username ||
      credentials.password !== CREDENTIALS.password) {
    return unauthorized();
  }

  // Auth passed, continue to the page
  return context.next();
}
