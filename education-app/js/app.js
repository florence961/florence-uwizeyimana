/* ===========================
   app.js - Main app logic
   Handles: page sliding, nav arrows, session check
   =========================== */

// Pages in order for the home slider
const pages = ['page-welcome', 'page-menu', 'page-about', 'page-contact', 'page-closing'];
let currentPage = 0;

function showPage(index) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pages[index]);
  if (target) target.classList.add('active');
}

function goForward() {
  if (currentPage < pages.length - 1) {
    currentPage++;
    showPage(currentPage);
  }
}

function goBack() {
  if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
}

// Check session on any page load
function checkSession() {
  const session = sessionStorage.getItem('edu_user');
  return session ? JSON.parse(session) : null;
}

// Sanitize input to prevent XSS
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Simple encode (simulate hashing - NOT real crypto)
function encodePassword(pw) {
  return btoa(unescape(encodeURIComponent(pw)));
}

// Initialize home slider
document.addEventListener('DOMContentLoaded', () => {
  showPage(0);
});
