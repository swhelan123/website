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

// Animate skill bars on scroll
const skillItems = document.querySelectorAll(".skill-item");
const animateOnScroll = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      observer.unobserve(entry.target);
    }
  });
};

const skillObserver = new IntersectionObserver(animateOnScroll, {
  root: null,
  threshold: 0.1,
});

skillItems.forEach((skill) => {
  skillObserver.observe(skill);
});

// Add CSS class to style active nav link
document.addEventListener("DOMContentLoaded", () => {
  // Add CSS for active class if not already in stylesheet
  const style = document.createElement("style");
  style.textContent = `
        nav ul li a.active {
            color: var(--primary-color);
            font-weight: 700;
        }
        nav ul li a.active::after {
            width: 100%;
        }
        .sticky-header.scrolled {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .light-mode .sticky-header.scrolled {
            background-color: rgba(255, 255, 255, 0.98);
        }
        .dark-mode .sticky-header.scrolled {
            background-color: rgba(20, 20, 20, 0.98);
        }
    `;
  document.head.appendChild(style);
});

// Add a Typing Animation to Subtitle
document.addEventListener("DOMContentLoaded", () => {
  const subtitle = document.querySelector(".subtitle");
  const text = subtitle.textContent;
  subtitle.textContent = "";

  let i = 0;
  const typingEffect = () => {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i);
      i++;
      setTimeout(typingEffect, 50);
    }
  };

  // Start typing animation after a short delay
  setTimeout(typingEffect, 500);
});

// Hover effect for project cards
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});
