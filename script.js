// Interaksi halaman: navigasi, amplop, formulir kontak, dan pemutar lagu.
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const letterTrigger = document.getElementById("letterTrigger");
  const envelopeWidget = document.querySelector(".envelope-widget");
  const tapHint = document.getElementById("tapHint");
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const yearLabel = document.getElementById("currentYear");
  const siteHeader = document.querySelector(".site-header");

  // Navbar berubah menjadi kapsul setelah halaman digulir.
  const updateHeader = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 42);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Menu navigasi pada layar kecil.
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
      );
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
      });
    });
  }

  // Klik amplop untuk membuka atau menyimpan surat.
  if (letterTrigger && envelopeWidget) {
    letterTrigger.addEventListener("click", () => {
      const isOpen = envelopeWidget.classList.toggle("is-open");
      letterTrigger.setAttribute("aria-expanded", String(isOpen));

      if (tapHint) {
        tapHint.textContent = isOpen
          ? "klik lagi untuk menyimpan surat"
          : "klik amplop untuk membuka surat";
      }
    });
  }

  // Tandai navigasi sesuai dengan bagian yang sedang dilihat.
  const pageSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  // Form menyiapkan isi email; pengiriman tetap dilakukan melalui aplikasi email pengguna.
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent = "Lengkapi nama, alamat email, dan pesan terlebih dahulu.";
        }
        return;
      }

      const subject = encodeURIComponent(`Pesan portofolio dari ${name}`);
      const body = encodeURIComponent(
        `Halo Lucky,\n\n${message}\n\nDikirim oleh: ${name}\nEmail: ${email}`
      );

      if (formNote) {
        formNote.textContent = "Aplikasi email akan dibuka. Periksa kembali pesan sebelum dikirim.";
      }

      window.location.href = `mailto:luckyluqmanulhakim@upi.edu?subject=${subject}&body=${body}`;
    });
  }

  // Tahun hak cipta otomatis mengikuti tahun saat ini.
  if (yearLabel) yearLabel.textContent = new Date().getFullYear();
});

// Kontrol pemutar lagu.
const audio = document.getElementById("myAudio");
const playBtn = document.getElementById("playBtn");
const playIcon = playBtn ? playBtn.querySelector("i") : null;
const progressJuice = document.getElementById("progressJuice");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

if (playBtn && audio) {
  // Tombol mengubah status pemutaran dan ikon.
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      if (playIcon) {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
      }
    } else {
      audio.pause();
      if (playIcon) {
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
      }
    }
  });

  // Perbarui waktu dan posisi progress bar selama lagu berjalan.
  audio.addEventListener("timeupdate", () => {
    const { duration, currentTime } = audio;
    if (!duration) return;

    const progressPercent = (currentTime / duration) * 100;
    if (progressJuice) progressJuice.style.width = `${progressPercent}%`;
    if (currentTimeEl) currentTimeEl.innerText = formatTime(currentTime);
  });

  // Tampilkan durasi total ketika metadata lagu sudah tersedia.
  const updateDuration = () => {
    if (durationEl && Number.isFinite(audio.duration)) {
      durationEl.innerText = formatTime(audio.duration);
    }
  };

  if (audio.readyState >= 1) {
    updateDuration();
  } else {
    audio.addEventListener("loadedmetadata", updateDuration, { once: true });
  }

  // Kembalikan kontrol ke awal saat lagu selesai.
  audio.addEventListener("ended", () => {
    if (playIcon) {
      playIcon.classList.remove("fa-pause");
      playIcon.classList.add("fa-play");
    }
    if (progressJuice) progressJuice.style.width = "0%";
    if (currentTimeEl) currentTimeEl.innerText = "0:00";
  });

  // Klik progress bar untuk berpindah ke posisi lagu yang dipilih.
  if (progressBar) {
    progressBar.addEventListener("click", (event) => {
      const width = progressBar.clientWidth;
      const duration = audio.duration;
      if (!duration || !width) return;

      audio.currentTime = (event.offsetX / width) * duration;
    });
  }
}

// Format waktu menjadi menit:detik.
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
