document.addEventListener("DOMContentLoaded", function () {
  // Fungsi carousel/slideshow
  let currentIndex = 0;
  const slides = document.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;

  // slide otomatis setiap 5 detik
  setInterval(function () {
    showSlide(currentIndex + 1);
  }, 5000);

  window.showSlide = function (index) {
    if (index >= totalSlides) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = index;
    }

    // Menggeser slide dengan CSS transform
    const slideContainer = document.querySelector(".carousel-slides");
    slideContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    document.querySelectorAll(".carousel-slide").forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });
  };

  // Fungsi update waktu saat ini
  function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById("time");
    if (timeElement) {
      timeElement.textContent = now.toLocaleTimeString();
    }
  }

  // Perbarui waktu langsung dan setiap detik
  updateTime();
  setInterval(updateTime, 1000);

  // Efek scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Offset untuk header
          behavior: "smooth",
        });

        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.remove("active");
        });
        this.classList.add("active");
      }
    });
  });

  // Perbarui menu berdasarkan posisi scroll
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const id = section.getAttribute("id");
        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  // Modal Selamat Datang dan Manajemen User
  const welcomeModal = document.getElementById("welcome-modal-overlay");
  const nameInput = document.getElementById("welcome-name-input");
  const continueBtn = document.getElementById("continue-btn");
  const skipLink = document.getElementById("skip-welcome");
  const userNameSpan = document.getElementById("user-name");
  const returningUserSpan = document.getElementById("returning-user-name");
  const personalWelcome = document.getElementById("personal-welcome");

  // Mengecek apakah nama user sudah tersimpan
  const storedName = localStorage.getItem("userName");

  // Fungsi untuk menyimpan nama user dan menutup modal
  function setUserName(name) {
    if (name && name.trim() !== "") {
      // Simpan di localStorage
      localStorage.setItem("userName", name);

      // Memperbarui nama user
      if (userNameSpan) {
        userNameSpan.textContent = name;
        userNameSpan.classList.add("name-highlight");

        setTimeout(() => {
          userNameSpan.classList.remove("name-highlight");
        }, 3000);
      }

      if (returningUserSpan) {
        returningUserSpan.textContent = name;
      }

      if (personalWelcome && storedName) {
        personalWelcome.style.display = "block";
      }

      // Isi otomatis field nama pada form kontak
      const contactNameField = document.getElementById("name");
      if (contactNameField) {
        contactNameField.value = name;
      }
    }

    // Tutup modal
    welcomeModal.classList.remove("active");

    sessionStorage.setItem("welcomeModalShown", "true");
  }

  // Mengecek modal selamat datang apakah sudah ditampilkan
  const modalShownThisSession = sessionStorage.getItem("welcomeModalShown");

  // Menampilkan modal selamat datang setiap kunjungan pertama user
  if (!storedName && !modalShownThisSession) {
    setTimeout(() => {
      welcomeModal.classList.add("active");
    }, 1000);
  } else if (storedName) {
    // Mengatur nama setiap user kembali
    setUserName(storedName);

    // Menampilkan pesan selamat datang personal dengan delay
    setTimeout(() => {
      if (personalWelcome) {
        personalWelcome.style.display = "block";

        setTimeout(() => {
          personalWelcome.style.display = "none";
        }, 5000);
      }
    }, 2000);

    // Isi otomatis field nama pada form kontak
    const contactNameField = document.getElementById("name");
    if (contactNameField) {
      contactNameField.value = storedName;
    }
  }

  // Menangani klik tombol lanjutkan
  if (continueBtn) {
    continueBtn.addEventListener("click", function () {
      const name = nameInput.value.trim();
      setUserName(name || "User");
    });
  }

  // Mengizinkan menekan Enter untuk submit nama
  if (nameInput) {
    nameInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const name = nameInput.value.trim();
        setUserName(name || "User");
      }
    });
  }

  // Menangani klik link lewati
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      setUserName("User");
    });
  }

  // Menambahkan tombol untuk mengubah nama nanti
  const headerNav = document.querySelector(".nav-links");
  if (headerNav && storedName) {
    if (!document.getElementById("change-name")) {
      const changeName = document.createElement("li");
      changeName.innerHTML = '<a href="#" id="change-name">Ubah Nama</a>';
      headerNav.appendChild(changeName);

      document
        .getElementById("change-name")
        .addEventListener("click", function (e) {
          e.preventDefault();
          welcomeModal.classList.add("active");
          nameInput.value = storedName;
          nameInput.focus();
        });
    }
  }

  // Validasi Form
  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    submitBtn.removeAttribute("onclick");
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      submitMessage();
    });
  }

  restoreSavedFormData();
  setupFormAutosave();
  setupThemeToggle();
});

// Validasi Form dengan Penyimpanan Draft
function submitMessage() {
  // Mengambil nilai field form
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  // Reset error sebelumnya
  resetFormErrors();

  // Mengecek apakah ada field yang kosong
  let hasErrors = false;

  if (!name) {
    markFieldAsError("name", "Nama wajib diisi");
    hasErrors = true;
  }

  if (!email) {
    markFieldAsError("email", "Email wajib diisi");
    hasErrors = true;
  } else {
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      markFieldAsError("email", "Masukkan alamat email yang valid");
      hasErrors = true;
    }
  }

  if (!phone) {
    markFieldAsError("phone", "Nomor telepon wajib diisi");
    hasErrors = true;
  } else {
    // Validasi nomor telepon
    const phoneRegex = /^[0-9\-\+\(\)\s]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      markFieldAsError("phone", "Masukkan nomor telepon yang valid");
      hasErrors = true;
    }
  }

  if (!message) {
    markFieldAsError("message", "Pesan wajib diisi");
    hasErrors = true;
  } else if (message.length > 1000) {
    markFieldAsError("message", "Pesan tidak boleh lebih dari 1000 karakter");
    hasErrors = true;
  }

  // Mencegah pengiriman form jika ada error / belum diisi
  if (hasErrors) {
    // Efek getar pada tombol submit untuk indikasi error
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.classList.add("error-shake");

    setTimeout(() => {
      submitBtn.classList.remove("error-shake");
    }, 500);

    return false;
  }

  // Jika tidak ada error, lanjutkan pengiriman form
  const messageDisplay = document.getElementById("message-display");
  messageDisplay.innerHTML = `
        <div class="submitted-message">
            <h3>Pesan Diterima!</h3>
            <p><strong>Dari:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telepon:</strong> ${phone}</p>
            <p><strong>Pesan:</strong></p>
            <p class="message-content">${message}</p>
            <p class="message-timestamp">Dikirim pada: ${new Date().toLocaleString()}</p>
            <p class="response-time">Kami biasanya merespons dalam 24-48 jam. Terima kasih atas kesabaran Anda!</p>
        </div>
    `;

  // Menambahkan animasi sukses
  messageDisplay.classList.add("success-animation");

  setTimeout(() => {
    messageDisplay.classList.remove("success-animation");
  }, 1500);

  // Bersihkan form
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("message").value = "";

  // Hapus draft tersimpan setelah berhasil submit
  localStorage.removeItem("contactFormDraft");

  return true;
}

// Fungsi untuk menandai field dengan error
function markFieldAsError(fieldId, errorMessage) {
  const field = document.getElementById(fieldId);

  // Menambahkan kelas error ke input
  field.classList.add("input-error");

  // Buat elemen pesan error jika belum ada
  let errorElement = document.getElementById(`${fieldId}-error`);
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = `${fieldId}-error`;
    errorElement.className = "error-message";
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }

  // Atur pesan error
  errorElement.textContent = errorMessage;

  // Menambahkan event listener untuk menghapus error saat user mulai mengetik
  field.addEventListener(
    "input",
    function () {
      field.classList.remove("input-error");
      if (errorElement) {
        errorElement.textContent = "";
      }
    },
    { once: true }
  );
}

// Fungsi untuk reset semua error form
function resetFormErrors() {
  // Hapus kelas error dari semua input
  const formInputs = document.querySelectorAll(".form-control");
  formInputs.forEach((input) => {
    input.classList.remove("input-error");
  });

  // Hapus semua pesan error
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMsg) => {
    errorMsg.textContent = "";
  });
}

// Fungsi untuk menyimpan data form sebagai draft
function saveFormDraft() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const messageField = document.getElementById("message");

  if (nameField || emailField || phoneField || messageField) {
    const formData = {
      name: nameField ? nameField.value : "",
      email: emailField ? emailField.value : "",
      phone: phoneField ? phoneField.value : "",
      message: messageField ? messageField.value : "",
      savedAt: new Date().toISOString(),
    };

    // Hanya simpan jika minimal satu field memiliki data
    if (formData.name || formData.email || formData.phone || formData.message) {
      localStorage.setItem("contactFormDraft", JSON.stringify(formData));

      // Menampilkan notifikasi draft tersimpan jika elemen ada
      const draftNotification = document.getElementById(
        "draft-saved-notification"
      );
      if (draftNotification) {
        draftNotification.classList.add("visible");
        setTimeout(() => {
          draftNotification.classList.remove("visible");
        }, 2000);
      }
    }
  }
}

// Fungsi untuk mengembalikan data form yang tersimpan
function restoreSavedFormData() {
  const savedData = localStorage.getItem("contactFormDraft");
  if (!savedData) return;

  try {
    const formData = JSON.parse(savedData);

    // Mengecek apakah form ada
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    // Isi field form jika mereka ada
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const messageField = document.getElementById("message");

    if (nameField && formData.name) nameField.value = formData.name;
    if (emailField && formData.email) emailField.value = formData.email;
    if (phoneField && formData.phone) phoneField.value = formData.phone;
    if (messageField && formData.message) messageField.value = formData.message;

    // Menampilkan notifikasi draft dikembalikan
    const draftRestoredNotification = document.createElement("div");
    draftRestoredNotification.className = "draft-notification";
    draftRestoredNotification.innerHTML = `
            <div class="draft-message">
                <p>Draft dari ${new Date(
                  formData.savedAt
                ).toLocaleString()} dikembalikan.</p>
                <button id="clear-draft-btn" class="text-btn">Hapus Draft</button>
            </div>
        `;

    const formContainer = contactForm.parentNode;
    formContainer.insertBefore(draftRestoredNotification, contactForm);

    // Menambahkan fungsi tombol hapus draft
    document
      .getElementById("clear-draft-btn")
      .addEventListener("click", function () {
        nameField.value = "";
        emailField.value = "";
        phoneField.value = "";
        messageField.value = "";
        localStorage.removeItem("contactFormDraft");
        draftRestoredNotification.remove();
      });

    // Otomatis hapus notifikasi setelah 10 detik
    setTimeout(() => {
      if (draftRestoredNotification.parentNode) {
        draftRestoredNotification.remove();
      }
    }, 10000);
  } catch (e) {
    console.error("Error mengembalikan data form:", e);
    localStorage.removeItem("contactFormDraft");
  }
}

// Setup autosave untuk field form
function setupFormAutosave() {
  const formFields = ["name", "email", "phone", "message"];

  // Menambahkan elemen notifikasi draft tersimpan jika belum ada
  const contactForm = document.getElementById("contact-form");
  if (contactForm && !document.getElementById("draft-saved-notification")) {
    const notification = document.createElement("div");
    notification.id = "draft-saved-notification";
    notification.className = "draft-saved-notification";
    notification.textContent = "Draft tersimpan";
    contactForm.appendChild(notification);
  }

  // Setup listener input untuk autosave
  formFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", debounce(saveFormDraft, 1000));
      field.addEventListener("blur", saveFormDraft);
    }
  });
}

// Fungsi debounce untuk membatasi seberapa sering fungsi dipanggil
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Fungsi toggle tema
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  // Mengecek preferensi tema tersimpan
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
    themeToggle.checked = savedTheme === "dark";
  } else {
    // Mengecek preferensi sistem
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.body.classList.toggle("dark-theme", prefersDarkScheme);
    themeToggle.checked = prefersDarkScheme;
  }

  // Tangani toggle tema
  themeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-theme", this.checked);
    localStorage.setItem("theme", this.checked ? "dark" : "light");
  });
}

// Menambahkan animasi ketika halaman dimuat
window.addEventListener("load", function () {
  document.body.classList.add("loaded");

  // Animasikan nama user jika ada
  const userNameSpan = document.getElementById("user-name");
  if (userNameSpan && localStorage.getItem("userName")) {
    userNameSpan.classList.add("name-highlight");
    setTimeout(() => {
      userNameSpan.classList.remove("name-highlight");
    }, 3000);
  }
});
