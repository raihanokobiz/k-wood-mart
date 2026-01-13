// utils/auth.ts
export function saveAuthData({ accessToken, refreshToken, user }: any) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken); // if needed
  localStorage.setItem("user", JSON.stringify(user));

  document.cookie = `accessToken=${accessToken}; path=/;`;
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getUser() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

// utils/auth.ts
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  document.cookie = "accessToken=; Max-Age=0; path=/;";
}
