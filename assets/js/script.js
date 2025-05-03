// Theme toggle functionality
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  // Apply saved theme
  if (savedTheme === "dark") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    themeSwitch.checked = false;
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    themeSwitch.checked = true;
  }
} else {
  // If no saved preference, check system preference
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    themeSwitch.checked = false;
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    themeSwitch.checked = true;
    localStorage.setItem("theme", "light");
  }
}

// Theme toggle event listener
themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  }
});

// Header behavior
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".sticky-header");
  const headerHeight = header.offsetHeight;
  const hero = document.querySelector(".hero");
  const heroHeight = hero.offsetHeight;

  // Calculate where the header should start sticking
  const stickyPoint = heroHeight - headerHeight;

  // Set initial position based on scroll position
  function updateHeaderPosition() {
    if (window.scrollY >= stickyPoint) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // Initial check
  updateHeaderPosition();

  // Listen for scroll events
  window.addEventListener("scroll", updateHeaderPosition);

  // Add scroll-padding dynamically based on header height
  document.documentElement.style.setProperty("--scroll-padding", headerHeight + 20 + "px");

  // Get all anchor links that point to sections on the page
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the target section
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Calculate position accounting for header
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20; // Extra 20px for breathing room

        // Smooth scroll to the target
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Optionally update URL
        history.pushState(null, null, targetId);
      }
    });
  });

  // Improved active section detection
  // Get all sections that have an ID defined
  const sections = document.querySelectorAll("section[id]");

  // Get all nav items with href values matching section IDs
  const navLinks = document.querySelectorAll("nav ul li a");

  // Function to determine which section is currently in view
  function highlightActiveSection() {
    // Get current scroll position
    let scrollY = window.pageYOffset;
    let currentActiveFound = false; // Flag to track if an active section is found

    // Loop through sections to find the one currently in view
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      // Adjust sectionTop calculation to better align with when section enters viewport
      const sectionTop = current.offsetTop - headerHeight - 50; // Consider header height and a small buffer
      const sectionId = current.getAttribute("id");

      // Check if scroll position is within this section's visible area
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Remove active class from all links first
        navLinks.forEach((link) => {
          link.classList.remove("active");
        });

        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
          currentActiveFound = true; // Mark that we found the active section
        }
      }
    });

    // If scrolled to the very top or no section matched, potentially highlight the first link
    if (!currentActiveFound && scrollY < heroHeight / 2 && sections.length > 0) {
      // Check if near the top
      navLinks.forEach((link) => link.classList.remove("active")); // Clear all active states
      const firstLink = document.querySelector('nav ul li a[href="#about"]'); // Directly target 'about' link
      if (firstLink) {
        firstLink.classList.add("active");
      }
    } else if (!currentActiveFound && scrollY === 0) {
      // Explicitly handle being exactly at the top
      navLinks.forEach((link) => link.classList.remove("active"));
      const firstLink = document.querySelector('nav ul li a[href="#about"]');
      if (firstLink) {
        firstLink.classList.add("active");
      }
    }
  }

  // Run on load
  highlightActiveSection();

  // Run on scroll
  window.addEventListener("scroll", highlightActiveSection);
});

// Typing Animation for Roles with realistic cursor behavior
document.addEventListener("DOMContentLoaded", () => {
  const typingTextElement = document.querySelector(".typing-text");
  const cursorElement = document.querySelector(".cursor");
  const roles = ["Computer Scientist", "Software Engineer", "Powertrain Engineer", "Web Developer"];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100; // Base typing speed

  // Stop cursor blinking during typing
  function stopCursorBlink() {
    cursorElement.style.opacity = "1";
    cursorElement.style.animation = "none";
  }

  // Start cursor blinking during pauses
  function startCursorBlink() {
    cursorElement.style.animation = "blink 0.7s infinite";
  }

  function typeRole() {
    // Ensure elements exist before proceeding
    if (!typingTextElement || !cursorElement) {
      console.error("Typing animation elements not found.");
      return;
    }

    const currentRole = roles[roleIndex];

    // Stop cursor blinking during typing/deleting
    stopCursorBlink();

    if (isDeleting) {
      // Deleting text
      typingTextElement.textContent = currentRole.substring(0, charIndex);
      charIndex--;
      typingSpeed = 50; // Faster when deleting
    } else {
      // Typing text
      typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal speed when typing
    }

    // If finished typing the current role
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause before starting to delete - cursor should blink during pause
      isDeleting = false; // Ensure isDeleting is false here
      typingSpeed = 1500; // Pause at the end of typing
      startCursorBlink();
      // Use setTimeout to delay setting isDeleting to true
      setTimeout(() => {
        isDeleting = true;
        // Call typeRole again immediately after setting isDeleting to start deleting process
        // without waiting for the next main timeout cycle
        if (charIndex > 0) {
          // Only start deleting if there's text
          setTimeout(typeRole, 50); // Short delay before starting deletion
        }
      }, typingSpeed); // Wait for the pause duration
      return; // Prevent the default setTimeout at the end of this block for this cycle
    }
    // If finished deleting the current role
    else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Move to next role
      charIndex = 0; // Reset character index
      typingSpeed = 500; // Pause before typing next role
      startCursorBlink();
    }

    // Schedule the next call to typeRole
    setTimeout(typeRole, typingSpeed);
  }

  // Start the typing animation
  setTimeout(typeRole, 500);
});

// Function to ensure hover effects work consistently
function applyHoverEffects() {
  // Project cards hover effect
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "";
    });
  });

  // Education cards hover effect
  const educationCards = document.querySelectorAll(".education-card");
  educationCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "";
    });
  });

  // Skill items hover effect
  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateY(-3px)";
      item.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.08)";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateY(0)";
      item.style.boxShadow = "";
    });
  });

  // Navigation links hover effect
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-2px)";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateY(0)";
    });
  });

  // Social badges hover effect
  const socialBadges = document.querySelectorAll(".social-badge, .cv-button");
  socialBadges.forEach((badge) => {
    badge.addEventListener("mouseenter", () => {
      badge.style.transform = "translateY(-2px)";
      badge.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
    });

    badge.addEventListener("mouseleave", () => {
      badge.style.transform = "translateY(0)";
      badge.style.boxShadow = "";
    });
  });

  // Profile photo hover effect
  const profilePhoto = document.querySelector(".profile-photo");
  if (profilePhoto) {
    profilePhoto.addEventListener("mouseenter", () => {
      profilePhoto.style.transform = "scale(1.05)";
      profilePhoto.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)";
    });

    profilePhoto.addEventListener("mouseleave", () => {
      profilePhoto.style.transform = "scale(1)";
      profilePhoto.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
    });
  }

  // Footer social links hover effect
  const footerLinks = document.querySelectorAll(".footer-social a");
  footerLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-3px)";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateY(0)";
    });
  });

  // Email button hover effect (This was for the mailto link, might remove or repurpose)
  // const emailButton = document.querySelector(".email-button");
  // if (emailButton) { ... }

  // Submit button hover effect (if needed, handled by CSS but JS can add/remove classes too)
  const submitButton = document.querySelector(".submit-button");
  if (submitButton) {
    // Example: Add effect on mouseenter if not purely CSS-driven
  }

  // About content links hover effect
  const aboutLinks = document.querySelectorAll(".about-content a");
  aboutLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-2px)";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateY(0)";
    });
  });

  // Contact illustration hover effect
  const contactIllustration = document.querySelector(".contact-illustration");
  if (contactIllustration) {
    contactIllustration.addEventListener("mouseenter", () => {
      contactIllustration.style.transform = "scale(1.02)";
    });

    contactIllustration.addEventListener("mouseleave", () => {
      contactIllustration.style.transform = "scale(1)";
    });
  }
}

// Apply hover effects on page load
document.addEventListener("DOMContentLoaded", applyHoverEffects);

// =============================================
// == NEW: AJAX Contact Form Submission Logic ==
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitButton = form.querySelector(".submit-button"); // Get the submit button

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(form);
      const submitButtonOriginalText = submitButton.innerHTML; // Store original button text

      // Show loading state
      formStatus.innerHTML = "Sending...";
      formStatus.className = "form-status sending"; // Add class for styling
      submitButton.disabled = true; // Disable button while sending
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; // Update button text

      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json", // Important for Formspree to send JSON response
        },
      })
        .then((response) => {
          if (response.ok) {
            // Success!
            formStatus.innerHTML = "Thanks for your message! I'll get back to you soon.";
            formStatus.className = "form-status success"; // Add class for styling
            form.reset(); // Clear the form fields
            submitButton.disabled = false; // Re-enable button
            submitButton.innerHTML = submitButtonOriginalText; // Restore original button text
          } else {
            // Error from Formspree (e.g., validation error)
            response
              .json()
              .then((data) => {
                let errorMessage = "Oops! There was a problem submitting your form.";
                if (data.errors && data.errors.length > 0) {
                  // Use Formspree's specific error message if available
                  errorMessage = data.errors.map((error) => error.message).join(", ");
                }
                formStatus.innerHTML = errorMessage;
                formStatus.className = "form-status error"; // Add class for styling
                submitButton.disabled = false; // Re-enable button
                submitButton.innerHTML = submitButtonOriginalText; // Restore original button text
              })
              .catch(() => {
                // Fallback error if parsing JSON fails
                formStatus.innerHTML = "Oops! There was a problem submitting your form. Please try again.";
                formStatus.className = "form-status error";
                submitButton.disabled = false;
                submitButton.innerHTML = submitButtonOriginalText;
              });
          }
        })
        .catch((error) => {
          // Network error or other fetch issue
          console.error("Fetch Error:", error);
          formStatus.innerHTML = "Oops! There was a network error. Please check your connection and try again.";
          formStatus.className = "form-status error"; // Add class for styling
          submitButton.disabled = false; // Re-enable button
          submitButton.innerHTML = submitButtonOriginalText; // Restore original button text
        });
    });
  } else {
    console.warn("Contact form with ID 'contact-form' not found.");
  }
});
