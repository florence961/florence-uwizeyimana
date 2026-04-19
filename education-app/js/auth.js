/* ===========================
   auth.js - Authentication logic
   Uses localStorage for users, sessionStorage for session
   =========================== */

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function encodePassword(pw) {
  return btoa(unescape(encodeURIComponent(pw)));
}

function getUsers() {
  return JSON.parse(localStorage.getItem('edu_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('edu_users', JSON.stringify(users));
}

function setSession(user) {
  sessionStorage.setItem('edu_user', JSON.stringify({
    email: user.email,
    name: user.name,
    phone: user.phone
  }));
}

function getSession() {
  const s = sessionStorage.getItem('edu_user');
  return s ? JSON.parse(s) : null;
}

function logout() {
  sessionStorage.removeItem('edu_user');
  window.location.href = '../pages/login.html';
}

/* ---- LOGIN ---- */
function handleLogin(e) {
  e.preventDefault();
  const email = sanitize(document.getElementById('login-email').value.trim());
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  errEl.textContent = '';

  if (!email || !password) {
    errEl.textContent = 'Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'Enter a valid email address.';
    return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    return;
  }

  const users = getUsers();
  const encoded = encodePassword(password);
  const user = users.find(u => u.email === email && u.password === encoded);

  if (!user) {
    errEl.textContent = 'Invalid email or password.';
    return;
  }

  setSession(user);
  window.location.href = '../pages/dashboard.html';
}

/* ---- SIGNUP ---- */
function handleSignup(e) {
  e.preventDefault();
  const email = sanitize(document.getElementById('signup-email').value.trim());
  const phone = sanitize(document.getElementById('signup-phone').value.trim());
  const name = sanitize(document.getElementById('signup-name').value.trim());
  const password = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  const okEl = document.getElementById('signup-success');

  errEl.textContent = '';
  okEl.textContent = '';

  if (!email || !phone || !name || !password) {
    errEl.textContent = 'Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'Enter a valid email address.';
    return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    errEl.textContent = 'An account with this email already exists.';
    return;
  }

  const newUser = { email, phone, name, password: encodePassword(password) };
  users.push(newUser);
  saveUsers(users);

  okEl.textContent = 'Account created! Redirecting to login...';
  setTimeout(() => { window.location.href = 'login.html'; }, 1500);
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const signupForm = document.getElementById('signup-form');
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  // Populate dashboard/profile with session data
  const userNameEl = document.getElementById('user-name-display');
  const session = getSession();
  if (userNameEl && session) {
    userNameEl.textContent = session.name || session.email;
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});
