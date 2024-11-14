export function getAuthToken() {
  return getCookie("auth_token") || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIxMjM0NSJ9.nyuYqVW7wP4LezHMR2a5K_Zypdgp4CKqfECVqeEHnrQ";
}

// Helper function to get the cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
