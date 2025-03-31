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

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 70, // Account for header height
      behavior: "smooth",
    });
  });
});

// Add active class to nav links based on scroll position
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

function highlightNavOnScroll() {
  const scrollPosition = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Initialize nav highlighting
window.addEventListener("scroll", highlightNavOnScroll);
highlightNavOnScroll();

// Add a class to header when scrolled
const header = document.querySelector(".sticky-header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
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
      isDeleting = false;
      typingSpeed = 1500; // Pause at the end of typing
      startCursorBlink();
      setTimeout(() => {
        isDeleting = true;
      }, typingSpeed);
    }
    // If finished deleting the current role
    else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Move to next role
      charIndex = 0; // Reset character index
      typingSpeed = 500; // Pause before typing next role
      startCursorBlink();
    }

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

  // Email button hover effect
  const emailButton = document.querySelector(".email-button");
  if (emailButton) {
    emailButton.addEventListener("mouseenter", () => {
      emailButton.style.transform = "translateY(-3px)";
      emailButton.style.boxShadow = "0 6px 15px rgba(0, 102, 204, 0.4)";
    });

    emailButton.addEventListener("mouseleave", () => {
      emailButton.style.transform = "translateY(0)";
      emailButton.style.boxShadow = "0 4px 10px rgba(0, 102, 204, 0.3)";
    });
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

// Skill items hover effect
const skillItems = document.querySelectorAll(".skill-item");
skillItems.forEach((item) => {
  // Remove any inline cursor style that might be set
  item.style.cursor = "default";

  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateY(-3px)";
    item.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.08)";
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateY(0)";
    item.style.boxShadow = "";
  });
});
