/* ── Toast ── */
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Grab elements ── */
const form         = document.getElementById('signupForm');
const nameInput    = document.getElementById('nameInput');
const emailInput   = document.getElementById('emailInput');
const pwInput      = document.getElementById('passwordInput');
const confirmInput = document.getElementById('confirmInput');
const submitBtn    = document.getElementById('submitBtn');
const segs         = [1,2,3,4].map(i => document.getElementById('seg' + i));
const colors       = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

/* ── Password strength bar ── */
function getStrength(val) {
  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;
  return score;
}

pwInput.addEventListener('input', () => {
  const score = getStrength(pwInput.value);
  segs.forEach((seg, i) => {
    seg.style.background = i < score ? colors[score - 1] : '#e5e7eb';
  });
});

/* ── Error helpers ── */
function setError(input) {
  input.classList.add('error');
  input.addEventListener('input', () => input.classList.remove('error'), { once: true });
}

function shakeAndToast(msg) {
  form.classList.add('shake');
  form.addEventListener('animationend', () => form.classList.remove('shake'), { once: true });
  showToast(msg);
}

/* ── Form submit ── */
form.addEventListener('submit', async e => {
  e.preventDefault();
  console.log('Form submitted'); // debug line

  const name     = nameInput.value.trim();
  const email    = emailInput.value.trim();
  const password = pwInput.value;
  const confirm  = confirmInput.value;
  let   valid    = true;

  if (!name || name.length < 2)               { setError(nameInput);    valid = false; }
  if (!email || !/\S+@\S+\.\S+/.test(email))  { setError(emailInput);   valid = false; }
  if (!password || getStrength(password) < 2) { setError(pwInput);      valid = false; }
  if (password !== confirm)                   { setError(confirmInput); valid = false; }

  if (!valid) { shakeAndToast('⚠️ Please fix the highlighted fields.'); return; }

  submitBtn.textContent = 'Creating account…';
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    console.log('Sending to signup.php...'); // debug line
    const res  = await fetch('signup.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password, confirm })
    });

    console.log('Response status:', res.status); // debug line
    const data = await res.json();
    console.log('Response data:', data); // debug line

    if (data.success) {
      showToast(`✅ Welcome, ${name}! Redirecting to login…`);
      setTimeout(() => window.location.href = 'login.html', 2000);
    } else {
      shakeAndToast('❌ ' + data.message);
      submitBtn.textContent = 'Create Account';
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  } catch (err) {
    console.error('Fetch error:', err); // debug line
    shakeAndToast('❌ Server error. Make sure XAMPP is running.');
    submitBtn.textContent = 'Create Account';
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

/* ── One-time focus tips ── */
nameInput.addEventListener('focus', () => {
  showToast('👤 Enter your full name', 2000);
}, { once: true });

emailInput.addEventListener('focus', () => {
  showToast('📧 This will be your login email', 2000);
}, { once: true });

pwInput.addEventListener('focus', () => {
  showToast('🔒 Use 8+ chars, a number and a symbol', 2800);
}, { once: true });

confirmInput.addEventListener('focus', () => {
  showToast('🔁 Re-enter the same password', 2000);
}, { once: true });