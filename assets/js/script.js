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

// Main DOMContentLoaded event handler - consolidating all functionality
document.addEventListener("DOMContentLoaded", function () {
  // Header behavior
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

  // Active section detection
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav ul li a");

  function highlightActiveSection() {
    let scrollY = window.pageYOffset;
    let currentActiveFound = false;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight - 50;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
        });

        const activeLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
          currentActiveFound = true;
        }
      }
    });

    if (!currentActiveFound && scrollY < heroHeight / 2 && sections.length > 0) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const firstLink = document.querySelector('nav ul li a[href="#about"]');
      if (firstLink) {
        firstLink.classList.add("active");
      }
    } else if (!currentActiveFound && scrollY === 0) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const firstLink = document.querySelector('nav ul li a[href="#about"]');
      if (firstLink) {
        firstLink.classList.add("active");
      }
    }
  }

  // Run on load and scroll
  highlightActiveSection();
  window.addEventListener("scroll", highlightActiveSection);

  // Apply hover effects
  applyHoverEffects();

  // Initialize contact form functionality
  initializeContactForm();

  // Initialize timeline animation
  initializeTimelineAnimation();

  // Initialize stats counter
  initializeStatsCounter();

  // Initialize typing animation
  initializeTypingAnimation();
});

// Typing Animation for Roles
function initializeTypingAnimation() {
  const typingTextElement = document.querySelector(".typing-text");
  const cursorElement = document.querySelector(".cursor");
  const roles = ["Computer Scientist", "Software Engineer", "Powertrain Engineer", "Web Developer"];

  if (!typingTextElement || !cursorElement) {
    return; // Elements not found
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function stopCursorBlink() {
    cursorElement.style.opacity = "1";
    cursorElement.style.animation = "none";
  }

  function startCursorBlink() {
    cursorElement.style.animation = "blink 0.7s infinite";
  }

  function typeRole() {
    const currentRole = roles[roleIndex];
    stopCursorBlink();

    if (isDeleting) {
      typingTextElement.textContent = currentRole.substring(0, charIndex);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = false;
      typingSpeed = 1500;
      startCursorBlink();
      setTimeout(() => {
        isDeleting = true;
        if (charIndex > 0) {
          setTimeout(typeRole, 50);
        }
      }, typingSpeed);
      return;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
      typingSpeed = 500;
      startCursorBlink();
    }

    setTimeout(typeRole, typingSpeed);
  }

  setTimeout(typeRole, 500);
}

// Hover effects function
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

// Enhanced Contact Form - SINGLE IMPLEMENTATION
function initializeContactForm() {
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitButton = form?.querySelector(".submit-button");
  const messageTextarea = document.getElementById("message");
  const charCountElement = document.getElementById("char-count");
  const topicSelect = document.getElementById("topic");

  if (!form) return;

  // Character counter functionality
  if (messageTextarea && charCountElement) {
    function updateCharacterCount() {
      const currentLength = messageTextarea.value.length;
      charCountElement.textContent = currentLength;

      const charCountContainer = charCountElement.parentElement;
      if (currentLength < 50) {
        charCountContainer.style.color = "var(--primary-color)";
      } else if (currentLength < 500) {
        charCountContainer.style.color = "var(--success-color)";
      } else {
        charCountContainer.style.color = "var(--accent-color)";
      }
    }

    messageTextarea.addEventListener("input", updateCharacterCount);
    updateCharacterCount();
  }

  // Form validation
  const formInputs = form.querySelectorAll(".form-control");
  formInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      this.classList.remove("error");
    });
  });

  function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute("required") && !value) {
      field.classList.add("error");
      return false;
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add("error");
        return false;
      }
    }

    field.classList.remove("error");
    return true;
  }

  // Form submission - SINGLE EVENT LISTENER
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const selectedTopic = topicSelect?.value;
    const originalMessage = formData.get("message");

    // Include topic information in the message body and subject
    if (selectedTopic) {
      const enhancedMessage = `Topic: ${selectedTopic}\n\n${originalMessage}`;
      formData.set("message", enhancedMessage);
      formData.set("_subject", `${selectedTopic} - Contact from shane-whelan.ie`);
    }

    const submitButtonOriginalContent = submitButton.innerHTML;

    // Show loading state
    formStatus.innerHTML = "Sending your message...";
    formStatus.className = "form-status sending";
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="button-content">
        <i class="fas fa-spinner fa-spin"></i>
        Sending...
      </span>
      <div class="button-background"></div>
    `;

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          formStatus.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Thanks for your message! I'll get back to you soon.
          `;
          formStatus.className = "form-status success";
          form.reset();

          // Reset character counter
          if (charCountElement) charCountElement.textContent = "0";

          submitButton.disabled = false;
          submitButton.innerHTML = submitButtonOriginalContent;

          // Success animation
          submitButton.style.background = "var(--success-color)";
          setTimeout(() => {
            submitButton.style.background = "";
          }, 2000);
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        formStatus.innerHTML = `
          <i class="fas fa-exclamation-triangle"></i>
          Oops! There was a problem sending your message. Please try again.
        `;
        formStatus.className = "form-status error";
        submitButton.disabled = false;
        submitButton.innerHTML = submitButtonOriginalContent;
      });
  });
}

// Timeline scroll animation
function initializeTimelineAnimation() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  if (timelineItems.length === 0) return;

  function checkTimelineItems() {
    const triggerBottom = (window.innerHeight / 5) * 4;

    timelineItems.forEach((item) => {
      const itemTop = item.getBoundingClientRect().top;

      if (itemTop < triggerBottom) {
        item.classList.add("in-view");
      }

      const itemCenter = itemTop + item.offsetHeight / 2;
      const viewportCenter = window.innerHeight / 2;

      item.classList.remove("active");

      if (Math.abs(itemCenter - viewportCenter) < 150) {
        item.classList.add("active");
      }
    });
  }

  checkTimelineItems();
  window.addEventListener("scroll", checkTimelineItems);

  // Smooth reveal animation on page load
  setTimeout(() => {
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        // Add class and let CSS control opacity/transform
        item.classList.add("in-view");
      }, index * 200);
    });
  }, 500);
}

// Animated counter for stats
function initializeStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number");
  const contactSection = document.getElementById("contact");

  if (statNumbers.length === 0 || !contactSection) return;

  const animateCounters = () => {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"));
      const current = parseInt(stat.textContent);

      if (current < target) {
        const increment = Math.ceil(target / 50);
        stat.textContent = Math.min(current + increment, target);

        if (current + increment < target) {
          setTimeout(() => animateCounters(), 30);
        }
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(contactSection);
}
