document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // CHEAT BLOCKER ENGINE
    // =========================================================
        
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
    // Disable F12
    if (e.key === "F12") {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+Shift+I / J / C
    if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "i" || e.key === "j" || e.key === "c")
    ) {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+U
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return false;
    }
});

// Disable Clipboard events
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());
    // =========================================================
    // EMAILJS CONFIGURATION
    // =========================================================

    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";


    // =========================================================
    // EMAILJS INITIALIZATION
    // =========================================================

    if (typeof emailjs !== "undefined") {

        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

    } else {

        console.error("EmailJS library failed to load.");

    }


    // =========================================================
    // 1. MOBILE MENU
    // =========================================================

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("open");

            if (navLinks.classList.contains("open")) {

                menuBtn.textContent = "✕";

            } else {

                menuBtn.textContent = "☰";

            }

        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuBtn.textContent = "☰";

            });

        });

    }


    // =========================================================
    // 2. NAVBAR SCROLL EFFECT
    // =========================================================

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {

                navbar.style.background =
                    "rgba(5, 6, 10, 0.92)";

                navbar.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.5)";

            } else {

                navbar.style.background =
                    "rgba(5, 6, 10, 0.72)";

                navbar.style.boxShadow = "none";

            }

        });

    }


    // =========================================================
    // 3. SCROLL REVEAL
    // =========================================================

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("show");

                            observer.unobserve(entry.target);

                        }

                    });

                },
                {
                    threshold: 0.15,
                    rootMargin: "0px 0px -50px 0px"
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("show");

        });

    }


    // =========================================================
    // 4. SKILL BAR ANIMATION
    // =========================================================

    const skillBars =
        document.querySelectorAll(".skill-bar span");


    if (
        skillBars.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const skillObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            const bar = entry.target;

                            const targetWidth =
                                bar.style.width;

                            bar.style.width = "0%";

                            setTimeout(() => {

                                bar.style.transition =
                                    "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)";

                                bar.style.width =
                                    targetWidth;

                            }, 100);

                            observer.unobserve(bar);

                        }

                    });

                },
                {
                    threshold: 0.5
                }
            );


        skillBars.forEach(bar => {

            skillObserver.observe(bar);

        });

    }


    // =========================================================
    // 5. CONTACT FORM
    // =========================================================

    const contactForm =
        document.getElementById("contactForm");

    const formMessage =
        document.getElementById("formMessage");


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                // ---------------------------------------------
                // GET INPUTS
                // ---------------------------------------------

                const name =
                    document.getElementById("name");

                const email =
                    document.getElementById("email");

                const subject =
                    document.getElementById("subject");

                const message =
                    document.getElementById("message");

                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );


                // ---------------------------------------------
                // VALIDATION
                // ---------------------------------------------

                if (
                    !name.value.trim() ||
                    !email.value.trim() ||
                    !subject.value.trim() ||
                    !message.value.trim()
                ) {

                    formMessage.style.color =
                        "#ef4444";

                    formMessage.textContent =
                        "Please fill in all the fields.";

                    return;

                }


                // ---------------------------------------------
                // EMAIL VALIDATION
                // ---------------------------------------------

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email.value.trim()
                    )
                ) {

                    formMessage.style.color =
                        "#ef4444";

                    formMessage.textContent =
                        "Please enter a valid email address.";

                    email.focus();

                    return;

                }


                // ---------------------------------------------
                // CHECK EMAILJS
                // ---------------------------------------------

                if (
                    typeof emailjs === "undefined"
                ) {

                    formMessage.style.color =
                        "#ef4444";

                    formMessage.textContent =
                        "Email service is unavailable.";

                    return;

                }


                // ---------------------------------------------
                // LOADING STATE
                // ---------------------------------------------

                const originalButtonText =
                    submitButton.innerHTML;

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Sending...";

                formMessage.textContent = "";


                try {

                    // -----------------------------------------
                    // SEND EMAIL
                    // -----------------------------------------

                    await emailjs.sendForm(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        contactForm
                    );


                    // -----------------------------------------
                    // SUCCESS
                    // -----------------------------------------

                    formMessage.style.color =
                        "var(--green)";

                    formMessage.textContent =
                        "✓ Message sent successfully! I'll get back to you soon.";

                    contactForm.reset();


                } catch (error) {

                    console.error(
                        "EmailJS Error:",
                        error
                    );


                    formMessage.style.color =
                        "#ef4444";

                    formMessage.textContent =
                        "✕ Failed to send message. Please try again.";

                }


                // ---------------------------------------------
                // RESET BUTTON
                // ---------------------------------------------

                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonText;


                // ---------------------------------------------
                // CLEAR STATUS
                // ---------------------------------------------

                setTimeout(() => {

                    formMessage.textContent = "";

                }, 6000);

            }
        );

    }


    // =========================================================
    // 6. CURRENT YEAR
    // =========================================================

    const footerYear =
        document.querySelector("footer span");


    if (
        footerYear &&
        footerYear.innerText.includes("©")
    ) {

        const currentYear =
            new Date().getFullYear();

        footerYear.innerHTML =
            footerYear.innerHTML.replace(
                /\d{4}/,
                currentYear
            );

    }

});
