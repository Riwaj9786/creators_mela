export const saveAuthData = (is_admin, token) => {
  const expiryTime = new Date().getTime() + 3600000; 
  localStorage.setItem("is_admin", JSON.stringify(is_admin)); 
  localStorage.setItem("token", token);
  localStorage.setItem("expiry", expiryTime);

  
  setTimeout(() => {
    clearAuthData();
  }, 3600000); 
};

export const getAuthData = () => {
  const is_admin = JSON.parse(localStorage.getItem("is_admin"));
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  return {
    is_admin: is_admin || null, 
    token: token || null,
    expiry: expiry || null,
  };
};

export const isAuthenticated = () => {
  const { token } = getAuthData();
  return Boolean(token); 
};

export const getUserRole = () => {
  const { is_admin } = getAuthData();
  return is_admin ? "admin" : "user";
};

export const logout = () => {
  clearAuthData(); 
};



export const clearAuthData = () => {
  localStorage.removeItem("is_admin");
  localStorage.removeItem("token");
  localStorage.removeItem("expiry");
};
