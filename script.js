document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 1. SECURITY LOCKS: DISABLE DEVTOOLS, RIGHT CLICK & CLIPBOARD
  // =========================================================

  // Disable Context Menu (Right Click)
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Block Shortcut Keys (F12, Ctrl+Shift+I/J/C, Ctrl+U)
  document.addEventListener("keydown", (e) => {
    // Disable F12
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl + Shift + I / J / C
    if (
      e.ctrlKey &&
      e.shiftKey &&
      (e.key === "I" ||
        e.key === "J" ||
        e.key === "C" ||
        e.key === "i" ||
        e.key === "j" ||
        e.key === "c")
    ) {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl + U (View Page Source)
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      return false;
    }
  });

  // Disable Cut, Copy, and Paste operations
  document.addEventListener("copy", (e) => {
    e.preventDefault();
  });

  document.addEventListener("paste", (e) => {
    e.preventDefault();
  });

  document.addEventListener("cut", (e) => {
    e.preventDefault();
  });

  // =========================================================
  // 2. EMAILJS INITIALIZATION
  // =========================================================

  // Replace these credentials with your actual EmailJS account keys
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

  if (typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  } else {
    console.warn("EmailJS library is not loaded on this page.");
  }

  // =========================================================
  // 3. RESPONSIVE MOBILE NAVIGATION MENU
  // =========================================================

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    // Toggle Mobile Navigation
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      if (navLinks.classList.contains("active")) {
        menuBtn.textContent = "✕";
        menuBtn.setAttribute("aria-expanded", "true");
      } else {
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Close Mobile Menu on clicking any nav item
    const navAnchors = navLinks.querySelectorAll("a");
    navAnchors.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================================================
  // 4. NAVBAR SCROLL EFFECT
  // =========================================================

  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar.style.background = "rgba(5, 6, 10, 0.94)";
        navbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
      } else {
        navbar.style.background = "rgba(5, 6, 10, 0.72)";
        navbar.style.boxShadow = "none";
      }
    });
  }

  // =========================================================
  // 5. SCROLL REVEAL OBSERVER
  // =========================================================

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach((element) => {
      element.classList.add("show");
    });
  }

  // =========================================================
  // 6. ANIMATED SKILL BARS
  // =========================================================

  const skillBars = document.querySelectorAll(".skill-bar span");

  if (skillBars.length > 0 && "IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.style.width;

            // Start from 0 and animate to actual width
            bar.style.width = "0%";

            setTimeout(() => {
              bar.style.transition =
                "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
              bar.style.width = targetWidth;
            }, 100);

            observer.unobserve(bar);
          }
        });
      },
      {
        threshold: 0.4,
      },
    );

    skillBars.forEach((bar) => {
      skillObserver.observe(bar);
    });
  }

  // =========================================================
  // 7. CONTACT FORM SUBMISSION WITH VALIDATION & EMAILJS
  // =========================================================

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const subjectInput = document.getElementById("subject");
      const messageInput = document.getElementById("message");
      const submitButton = contactForm.querySelector('button[type="submit"]');

      // Check for Required Fields
      if (
        !nameInput.value.trim() ||
        !emailInput.value.trim() ||
        (subjectInput && !subjectInput.value.trim()) ||
        !messageInput.value.trim()
      ) {
        if (formMessage) {
          formMessage.style.color = "#ef4444";
          formMessage.textContent = "Please fill in all the required fields.";
        }
        return;
      }

      // Email Format Validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        if (formMessage) {
          formMessage.style.color = "#ef4444";
          formMessage.textContent = "Please enter a valid email address.";
        }
        emailInput.focus();
        return;
      }

      // Check if EmailJS is available
      if (typeof emailjs === "undefined") {
        if (formMessage) {
          formMessage.style.color = "#ef4444";
          formMessage.textContent = "Email service is temporarily unavailable.";
        }
        return;
      }

      // Enter Loading State
      const originalBtnText = submitButton ? submitButton.innerHTML : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = "Sending...";
      }

      if (formMessage) {
        formMessage.textContent = "";
      }

      try {
        // Send email via EmailJS
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          contactForm,
        );

        // Success Feedback
        if (formMessage) {
          formMessage.style.color = "var(--green)";
          formMessage.textContent =
            "✓ Message sent successfully! I'll get back to you soon.";
        }
        contactForm.reset();
      } catch (error) {
        console.error("EmailJS Error:", error);
        if (formMessage) {
          formMessage.style.color = "#ef4444";
          formMessage.textContent =
            "✕ Failed to send message. Please try again later.";
        }
      } finally {
        // Reset Button State
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalBtnText;
        }

        // Clear notification status after 6 seconds
        setTimeout(() => {
          if (formMessage) {
            formMessage.textContent = "";
          }
        }, 6000);
      }
    });
  }

  // =========================================================
  // 8. AUTO-UPDATE COPYRIGHT YEAR
  // =========================================================

  const footerYear = document.querySelector("footer .footer-inner span");

  if (footerYear && footerYear.innerText.includes("©")) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
  }
});
