const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbwWU6Ny9zAfPahLa3DvIs5xP8gx7RFkEbifPZrVkcruXQlRtYcOFpGwyDWJBCGfV9_k/exec";

const btn = document.getElementById("btn");
const modal = document.querySelector(".modal");
const closeBtn = document.getElementById("close");
const overlay = document.querySelector(".modal__overlay");
const form = document.getElementById("form");
const loader = document.getElementById("loader");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const jobInput = document.getElementById("jop");

// Modal control functions
const showModal = () => {
  modal.classList.remove("modal--hidden");
  modal.classList.add("modal--visible");
};

const hideModal = () => {
  modal.classList.add("modal--hidden");
  modal.classList.remove("modal--visible");
};

// Event listeners for modal
btn?.addEventListener("click", showModal);
closeBtn?.addEventListener("click", hideModal);
overlay?.addEventListener("click", hideModal);

// Phone number formatting
phoneInput?.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  let formatted = "";
  if (value.length > 0) formatted += "(" + value.substring(0, 2);
  if (value.length >= 3) formatted += ") " + value.substring(2, 5);
  if (value.length >= 6) formatted += "-" + value.substring(5, 7);
  if (value.length >= 8) formatted += "-" + value.substring(7, 9);
  e.target.value = formatted;
});

// Form validation
const validateForm = () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const job = jobInput.value.trim();
  document.querySelectorAll(".form-field__error").forEach((el) => (el.textContent = ""));
  let isValid = true;
  if (!name) {
    document.getElementById("name-error").textContent = "Ism kiritish majburiy";
    isValid = false;
  }
  if (!phone) {
    document.getElementById("phone-error").textContent = "Telefon raqamni kiriting";
    isValid = false;
  }
  if (!job) {
    document.getElementById("jop-error").textContent = "Biznes nomi kiritish majburiy";
    isValid = false;
  }
  return isValid;
};

// // Handle form submission on the main page
if (window.location.pathname === "/") {
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("sneded");
    
    if (!validateForm()) return;

    loader.classList.remove("loader--hidden");
    loader.classList.add("loader--visible");

    const now = new Date();
    const formData = {
      Ism: nameInput.value.trim(),
      "Telefon raqam": phoneInput.value.trim(),
      "Biznes turi": jobInput.value.trim(),
      "Sana, Soat": now.toLocaleDateString("uz-UZ") + " " + now.toLocaleTimeString("uz-UZ"),
    };

    localStorage.setItem("registrationData", JSON.stringify(formData));

    loader.classList.add("loader--hidden");
    loader.classList.remove("loader--visible");
    window.location.href = "video.html";
  });
}

// Send stored data to Google Sheets on video.html
if (window.location.pathname.includes("video.html")) {
  const sendStoredData = () => {
    const storedData = localStorage.getItem("registrationData");
    if (!storedData) return;

    const data = JSON.parse(storedData);
    const formDataToSend = new FormData();
    // formDataToSend.append("sheetName", "Lead");
    for (const key in data) {
      formDataToSend.append(key, data[key]);
    }

    fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      body: formDataToSend,
    })
      .then(() => {
        localStorage.removeItem("registrationData");
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

//   document.addEventListener("DOMContentLoaded", sendStoredData);
  window.addEventListener("load", sendStoredData);
}
