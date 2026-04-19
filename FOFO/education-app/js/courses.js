/* ===========================
   courses.js - Courses system
   Hardcoded course data, enrollment stored in localStorage
   =========================== */

const COURSES = [
  { id: 'c1', title: 'Web Development', emoji: '💻', duration: '8 weeks', level: 'Beginner' },
  { id: 'c2', title: 'Data Science', emoji: '📊', duration: '10 weeks', level: 'Intermediate' },
  { id: 'c3', title: 'Graphic Design', emoji: '🎨', duration: '6 weeks', level: 'Beginner' },
  { id: 'c4', title: 'English Language', emoji: '📖', duration: '12 weeks', level: 'All Levels' },
  { id: 'c5', title: 'Mathematics', emoji: '🔢', duration: '8 weeks', level: 'Advanced' },
  { id: 'c6', title: 'Business Skills', emoji: '💼', duration: '6 weeks', level: 'Beginner' },
  { id: 'c7', title: 'Mobile Apps', emoji: '📱', duration: '10 weeks', level: 'Intermediate' },
  { id: 'c8', title: 'Cybersecurity', emoji: '🔒', duration: '8 weeks', level: 'Advanced' },
];

function getEnrolled() {
  return JSON.parse(localStorage.getItem('edu_enrolled') || '[]');
}

function saveEnrolled(arr) {
  localStorage.setItem('edu_enrolled', JSON.stringify(arr));
}

function isEnrolled(courseId) {
  return getEnrolled().includes(courseId);
}

function toggleEnroll(courseId, btnEl) {
  const session = JSON.parse(sessionStorage.getItem('edu_user') || 'null');
  if (!session) {
    alert('Please log in to enroll in courses.');
    window.location.href = 'login.html';
    return;
  }
  let enrolled = getEnrolled();
  if (enrolled.includes(courseId)) {
    enrolled = enrolled.filter(id => id !== courseId);
    btnEl.textContent = 'Enroll';
    btnEl.classList.remove('enrolled');
  } else {
    enrolled.push(courseId);
    btnEl.textContent = '✓ Enrolled';
    btnEl.classList.add('enrolled');
  }
  saveEnrolled(enrolled);
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  grid.innerHTML = COURSES.map(course => `
    <div class="course-card">
      <div class="course-card-thumb">${course.emoji}</div>
      <div class="course-card-body">
        <div class="course-card-title">${course.title}</div>
        <div class="course-card-meta">${course.level} · ${course.duration}</div>
      </div>
      <button class="enroll-btn ${isEnrolled(course.id) ? 'enrolled' : ''}"
        onclick="toggleEnroll('${course.id}', this)">
        ${isEnrolled(course.id) ? '✓ Enrolled' : 'Enroll'}
      </button>
    </div>
  `).join('');
}

/* ---- Dashboard: enrolled count ---- */
function renderDashboardCourses() {
  const enrolled = getEnrolled();
  const countEl = document.getElementById('enrolled-count');
  if (countEl) countEl.textContent = enrolled.length;

  const listEl = document.getElementById('enrolled-list');
  if (!listEl) return;

  const myCourses = COURSES.filter(c => enrolled.includes(c.id));
  if (myCourses.length === 0) {
    listEl.innerHTML = '<p style="color:#888;font-size:0.9rem;padding:8px 0;">No courses enrolled yet. <a href="courses.html" style="color:var(--sky-dark)">Browse courses →</a></p>';
    return;
  }
  listEl.innerHTML = myCourses.map(c => `
    <div class="course-row">
      <span class="course-name">${c.emoji} ${c.title}</span>
      <span class="course-tag">${c.level}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  renderDashboardCourses();
});
