export function getAuthToken() {
  return getCookie("auth_token") || import.meta.env.VITE_TEST_TOKEN;
}

// Helper function to get the cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
