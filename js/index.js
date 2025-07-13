document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal');
  const closeButton = document.getElementById('close');
  const overlay = document.querySelector('.overlay');
  const btn = document.querySelector("#btn");
  const url = `https://script.google.com/macros/s/AKfycbyKwNkLOENB0SXrnLHxQEQGfsDHCtiKm9MdxOkPruLtN9ykrcm2DigALfkXMv1fBKqcQA/exec`;
  let player;
  let intervalId = null;
  let lastShownMinute = 0;

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }

  // Function to open modal
  const openModal = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  // Function to close modal
  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // Close modal when clicking overlay
  overlay.addEventListener('click', closeModal);

  // Open modal when clicking button
  btn.addEventListener('click', openModal);

  // Close modal when clicking close button
  closeButton.addEventListener('click', closeModal);

  // Check video time to show modal every 5 minutes
  const checkVideoTime = () => {
    const currentTime = player.getCurrentTime();
    const currentMinute = Math.floor(currentTime / 60);
    if (currentMinute !== lastShownMinute && currentMinute % 5 === 0) {
      openModal();
      lastShownMinute = currentMinute;
    }
  };

  // YouTube player initialization
  const onYouTubeIframeAPIReady = () => {
    player = new YT.Player('youtube-video', {
      events: {
        'onStateChange': (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            if (!intervalId) {
              intervalId = setInterval(checkVideoTime, 1000);
            }
          } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      }
    });
  };

  // Load YouTube API script
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
  window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

  // Phone input formatting
  document.getElementById("phone").addEventListener("input", function (event) {
    let value = event.target.value.replace(/\D/g, ""); // Remove all non-digit characters
    let formatted = "";

    if (value.length > 0) {
      formatted += "(" + value.substring(0, 2);
    }
    if (value.length >= 3) {
      formatted += ") " + value.substring(2, 5);
    }
    if (value.length >= 6) {
      formatted += "-" + value.substring(5, 7);
    }
    if (value.length >= 8) {
      formatted += "-" + value.substring(7, 9);
    }

    event.target.value = formatted;
  });

  // Form submission handling
  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting
    const loader = document.querySelector("#loader");
    // Clear previous error messages
    document.getElementById("name-error").textContent = "";
    document.getElementById("phone-error").textContent = "";
    document.getElementById("jop-error").textContent = "";

    // Get form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const business = document.getElementById("jop").value.trim();

    // Validate form inputs
    let isValid = true;
    if (!name) {
      document.getElementById("name-error").textContent = "Iltimos, ismingizni kiriting.";
      isValid = false;
    }
    const phonePattern = /^\(\d{2}\) \d{3}-\d{2}-\d{2}$/;
    if (!phone || !phonePattern.test(phone)) {
      document.getElementById("phone-error").textContent = "Telefon raqamingizni (88) 000-00-00 formatida kiriting.";
      isValid = false;
    }
    if (!business) {
      document.getElementById("jop-error").textContent = "Iltimos, biznesingiz nomi va faoliyat sohasini kiriting.";
      isValid = false;
    }

    if (isValid) {
      loader.classList.remove("hidden");
      loader.classList.add("flex");

      // Prepare form data
      const formData = new FormData();
      formData.append("Ismingiz", name);
      formData.append("Telefon", phone);
      formData.append("Biznesingiz nomi", business);

      // Send data to the server
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          closeModal();
          window.location = "https://asoschilar.uz/video.html";
          document.getElementById("form").reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          closeModal();
          alert("Xatolik yuz berdi, iltimos qayta urinib ko'ring.");
        })
        .finally(() => {
          // Hide loader
          loader.classList.add("hidden");
          loader.classList.remove("flex");
        });
    }
  });
});
