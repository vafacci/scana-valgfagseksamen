export async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error('google_profile_failed');
  }
  const data = await response.json();
  return {
    provider: 'google',
    providerId: String(data.sub || data.id || ''),
    email: data.email || '',
    name: data.name || data.given_name || 'Google',
  };
}

export async function fetchFacebookProfile(accessToken) {
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`
  );
  if (!response.ok) {
    throw new Error('facebook_profile_failed');
  }
  const data = await response.json();
  return {
    provider: 'facebook',
    providerId: String(data.id || ''),
    email: data.email || '',
    name: data.name || 'Facebook',
  };
}

export function authTokenFromResult(result) {
  return (
    result?.authentication?.accessToken ||
    result?.params?.access_token ||
    result?.params?.accessToken ||
    null
  );
}
