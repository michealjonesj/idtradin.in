/**
 * Authentication utilities
 */

function generateToken(userId) {
  return btoa(JSON.stringify({ id: userId, timestamp: Date.now() }));
}

function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token));
    return localStorageService.getUser(decoded.id);
  } catch {
    return null;
  }
}

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

function isPartner() {
  const user = getCurrentUser();
  return user && user.role === 'partner';
}

function login(email, password) {
  const user = localStorageService.getUserByEmail(email);
  if (!user || !user.isActive) {
    return { success: false, message: 'Invalid credentials' };
  }
  if (user.password !== password) {
    return { success: false, message: 'Invalid credentials' };
  }
  const token = generateToken(user._id);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({
    id: user._id,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    contactPerson: user.contactPerson,
  }));
  return { success: true, user };
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function requireAuth(requiredRole = null) {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  if (requiredRole === 'admin' && !isAdmin()) {
    window.location.href = 'pages/partner-dashboard.html';
    return false;
  }
  if (requiredRole === 'partner' && !isPartner()) {
    window.location.href = 'pages/admin-dashboard.html';
    return false;
  }
  return true;
}

