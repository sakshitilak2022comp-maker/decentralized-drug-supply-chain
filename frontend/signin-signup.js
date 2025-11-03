// ---------- Select Forms ----------
const signInForm = document.querySelector('.sign-in-form');
const signUpForm = document.querySelector('.sign-up-form');

// ---------- Sign In ----------
signInForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const mobile = document.querySelector('#signin-num').value;
  const password = document.querySelector('#signin-pass').value;

  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password }),
  })
    .then(res => res.json())
    .then(data => {
      console.log("🟢 Login response:", data);

      // Handle message safely
      const msg = typeof data.message === 'object' ? JSON.stringify(data.message) : data.message;
      alert(msg);

      if (data.success) {
        window.location.href = 'http://localhost:5000/dashboard';
      }
    })
    .catch(err => {
      console.error('Login Error:', err);
      alert('⚠️ Server error during login. Please try again.');
    });
});

// ---------- Sign Up ----------
signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = document.querySelector('#fname').value;
  const lastName = document.querySelector('#lname').value;
  const mobile = document.querySelector('#signup-num').value;
  const email = document.querySelector('#mail').value;
  const password = document.querySelector('#signup-pass').value;

  console.log("📩 Sending signup data:", { firstName, lastName, mobile, email, password });

  fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, mobile, email, password }),
  })
    .then(res => res.json())
    .then(data => {
      console.log("📝 Register response:", data);

      // Handle message safely
      const msg = typeof data.message === 'object' ? JSON.stringify(data.message) : data.message;
      alert(msg);

      if (data.success) {
        // After successful signup → show login form again
        document.querySelector("main").classList.remove("sign-up-mode");
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
window.location.href = "index.html";

    })
    .catch(err => {
      console.error('Registration Error:', err);
      alert('⚠️ Server error during registration. Please try again.');
    });


});

// ---------- Input Field Animation ----------
const inputs = document.querySelectorAll(".input-field");

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => inp.classList.add("active"));
  inp.addEventListener("blur", () => {
    if (inp.value === "") inp.classList.remove("active");
  });
});

// ---------- Toggle between Sign In / Sign Up ----------
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

// ---------- Carousel ----------
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");

function moveSlider() {
  let index = this.dataset.value;
  let currentImage = document.querySelector(`.img-${index}`);

  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");
}

bullets.forEach((bullet) => {
  bullet.addEventListener("click", moveSlider);
});
