/* ── Toast ── */
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), duration);
}



/* ── Password strength bar ── */
const segs   = [1,2,3,4].map(i => document.getElementById('seg' + i));
const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

function getStrength(val) {
  let score = 0;
  if (val.length >= 8)            score++;
  if (/[A-Z]/.test(val))          score++;
  if (/[0-9]/.test(val))          score++;
  if (/[^A-Za-z0-9]/.test(val))   score++;
  return score;
}

pwInput.addEventListener('input', () => {
  const score = getStrength(pwInput.value);
  segs.forEach((seg, i) => {
    seg.style.background = i < score ? colors[score - 1] : '#e5e7eb';
  });
});

/* ── Input error helpers ── */
function setError(input) {
  input.classList.add('error');
  input.addEventListener('input', () => input.classList.remove('error'), { once: true });
}

/* ── Form submit ── */
const form      = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const submitBtn  = form.querySelector('button[type="submit"]');

form.addEventListener('submit', e => {
  e.preventDefault();

  const email    = emailInput.value.trim();
  const password = pwInput.value;
  let   valid    = true;

  /* basic validation */
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    setError(emailInput);
    valid = false;
  }
  if (!password || password.length < 6) {
    setError(pwInput);
    valid = false;
  }

  if (!valid) {
    form.classList.add('shake');
    form.addEventListener('animationend', () => form.classList.remove('shake'), { once: true });
    showToast(' Please check your details and try again.');
    return;
  }

  /* loading state */
  submitBtn.textContent = 'Signing in…';
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

 form.addEventListener('submit', async e => {
  e.preventDefault();

  const email    = emailInput.value.trim();
  const password = pwInput.value;
  let   valid    = true;

  if (!email || !/\S+@\S+\.\S+/.test(email)) { setError(emailInput); valid = false; }
  if (!password || password.length < 6)       { setError(pwInput);    valid = false; }

  if (!valid) { shakeAndToast(' Please check your details.'); return; }

  submitBtn.textContent = 'Signing in…';
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    const res  = await fetch('login.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('ck_loggedIn', data.name);
      showToast(` Welcome back, ${data.name}!`);
      setTimeout(() => window.location.href = 'index.html', 1800);
    } else {
      shakeAndToast('❌ ' + data.message);
      submitBtn.textContent = 'Login';
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  } catch {
    shakeAndToast('❌ Server error.');
    submitBtn.textContent = 'Login';
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});
    
});

/* ── Input focus toasts  ── */
emailInput.addEventListener('focus', () => {
  showToast(' Enter the email you signed up with', 2000);
}, { once: true });

pwInput.addEventListener('focus', () => {
  showToast(' Use 8+ chars, a number and a symbol for a strong password', 2800);
}, { once: true });