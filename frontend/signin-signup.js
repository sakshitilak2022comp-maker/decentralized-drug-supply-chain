// // ---------- Select Forms ----------
// const signInForm = document.querySelector('.sign-in-form');
// const signUpForm = document.querySelector('.sign-up-form');

// // ---------- Sign In ----------
// signInForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const mobile = document.querySelector('#signin-num').value;
//   const password = document.querySelector('#signin-pass').value;

//   fetch('https://decentralized-drug-supply-chain.onrender.com/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ mobile, password }),
//   })
//     .then(res => res.json())
//     .then(data => {
//       console.log("🟢 Login response:", data);

//       // Handle message safely
//       const msg = typeof data.message === 'object' ? JSON.stringify(data.message) : data.message;
//       alert(msg);

//       // if (data.success) {
//       //   window.location.href = 'https://decentralized-drug-supply-chain.onrender.com/daashboard';
//       // }

//       if (data.success) {
//   const baseUrl = window.location.origin.includes("localhost")
//     ? "http://localhost:5500/frontend" // or Live Server port
//     : "https://decentralized-drug-supply.netlify.app"; // your Netlify URL

//   window.location.href = `${baseUrl}/index.html`;
// }
//     })
//     .catch(err => {
//       console.error('Login Error:', err);
//       alert('⚠️ Server error during login. Please try again.');
//     });
// });

// // ---------- Sign Up ----------
// signUpForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const firstName = document.querySelector('#fname').value;
//   const lastName = document.querySelector('#lname').value;
//   const mobile = document.querySelector('#signup-num').value;
//   const email = document.querySelector('#mail').value;
//   const password = document.querySelector('#signup-pass').value;

//   console.log("📩 Sending signup data:", { firstName, lastName, mobile, email, password });

//   fetch("https://decentralized-drug-supply-chain.onrender.com/register", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ firstName, lastName, mobile, email, password }),
// })

//     .then(res => res.json())
//     .then(data => {
//       console.log("📝 Register response:", data);

//       // Handle message safely
//       const msg = typeof data.message === 'object' ? JSON.stringify(data.message) : data.message;
//       alert(msg);

//       if (data.success) {
//         // After successful signup → show login form again
//         document.querySelector("main").classList.remove("sign-up-mode");
//       }

//       localStorage.setItem("loggedInUser", JSON.stringify(data.user));
// window.location.href = "index.html";

//     })
//     .catch(err => {
//       console.error('Registration Error:', err);
//       alert('⚠️ Server error during registration. Please try again.');
//     });


// });

// // ---------- Input Field Animation ----------
// const inputs = document.querySelectorAll(".input-field");

// inputs.forEach((inp) => {
//   inp.addEventListener("focus", () => inp.classList.add("active"));
//   inp.addEventListener("blur", () => {
//     if (inp.value === "") inp.classList.remove("active");
//   });
// });

// // ---------- Toggle between Sign In / Sign Up ----------
// const toggle_btn = document.querySelectorAll(".toggle");
// const main = document.querySelector("main");

// toggle_btn.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     main.classList.toggle("sign-up-mode");
//   });
// });

// // ---------- Carousel ----------
// const bullets = document.querySelectorAll(".bullets span");
// const images = document.querySelectorAll(".image");

// function moveSlider() {
//   let index = this.dataset.value;
//   let currentImage = document.querySelector(`.img-${index}`);

//   images.forEach((img) => img.classList.remove("show"));
//   currentImage.classList.add("show");

//   bullets.forEach((bull) => bull.classList.remove("active"));
//   this.classList.add("active");
// }

// bullets.forEach((bullet) => {
//   bullet.addEventListener("click", moveSlider);
// });


// ---------- Select Forms ----------
const signInForm = document.querySelector(".sign-in-form");
const signUpForm = document.querySelector(".sign-up-form");

// 🌐 Auto-detect API base URL
const API_BASE_URL = window.location.origin.includes("localhost")
  ? "http://localhost:5000" // Local backend (for testing)
  : "https://decentralized-drug-supply-chain.onrender.com"; // Render backend (deployed)

// 🌐 Netlify frontend base URL (for redirect after login)
const FRONTEND_BASE_URL = window.location.origin.includes("localhost")
  ? "http://localhost:5500/frontend" // or your local live server port
  : "https://decentralized-drug-supply.netlify.app"; // 🔹 replace with your actual Netlify URL

// ---------- Sign In ----------
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const mobile = document.querySelector("#signin-num").value.trim();
  const password = document.querySelector("#signin-pass").value.trim();

  if (!mobile || !password) {
    alert("Please enter both mobile number and password.");
    return;
  }

  fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("🟢 Login response:", data);
      const msg =
        typeof data.message === "object"
          ? JSON.stringify(data.message)
          : data.message;
      alert(msg);

      if (data.success) {
        // Save logged-in user
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));

        // Redirect to dashboard (frontend)
        window.location.href = `${FRONTEND_BASE_URL}/index.html`;
      }
    })
    .catch((err) => {
      console.error("Login Error:", err);
      alert("⚠️ Server error during login. Please try again.");
    });
});

// ---------- Sign Up ----------
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.querySelector("#fname").value.trim();
  const lastName = document.querySelector("#lname").value.trim();
  const mobile = document.querySelector("#signup-num").value.trim();
  const email = document.querySelector("#mail").value.trim();
  const password = document.querySelector("#signup-pass").value.trim();

  if (!firstName || !lastName || !mobile || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  console.log("📩 Sending signup data:", {
    firstName,
    lastName,
    mobile,
    email,
    password,
  });

  fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, mobile, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("📝 Register response:", data);
      const msg =
        typeof data.message === "object"
          ? JSON.stringify(data.message)
          : data.message;
      alert(msg);

      if (data.success) {
        // After successful signup → show login form
        document.querySelector("main").classList.remove("sign-up-mode");
      }

      // Save user info locally
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
    })
    .catch((err) => {
      console.error("Registration Error:", err);
      alert("⚠️ Server error during registration. Please try again.");
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
