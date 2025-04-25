document.addEventListener("DOMContentLoaded", function() {
    // Apply theme from main script
    const savedTheme = localStorage.getItem("theme");
    const body = document.body;
    
    if (savedTheme) {
        if (savedTheme === "dark") {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
        }
    }
    
    // Category filtering
    const categoryFilters = document.querySelectorAll(".category-filter");
    const blogCards = document.querySelectorAll(".blog-card");
    
    categoryFilters.forEach(filter => {
        filter.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Remove active class from all filters
            categoryFilters.forEach(f => f.classList.remove("active"));
            
            // Add active class to clicked filter
            this.classList.add("active");
            
            const selectedCategory = this.getAttribute("data-category");
            
            // Show/hide blog cards based on category
            if (selectedCategory === "all") {
                blogCards.forEach(card => {
                    card.style.display = "flex";
                    // Add animation for smooth appearance
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 10);
                });
            } else {
                blogCards.forEach(card => {
                    if (card.getAttribute("data-category") === selectedCategory) {
                        card.style.display = "flex";
                        // Add animation for smooth appearance
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "translateY(0)";
                        }, 10);
                    } else {
                        card.style.opacity = "0";
                        card.style.transform = "translateY(20px)";
                        setTimeout(() => {
                            card.style.display = "none";
                        }, 300);
                    }
                });
            }
        });
    });
    
    // Blog card hover effects
    const blogCards = document.querySelectorAll(".blog-card, .featured-post");
    blogCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-5px)";
            card.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.1)";
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "";
        });
    });
    
    // Read more hover effect
    const readMoreButtons = document.querySelectorAll(".read-more");
    readMoreButtons.forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "translateX(5px)";
        });
        
        button.addEventListener("mouseleave", () => {
            button.style.transform = "translateX(0)";
        });
    });
    
    // Pagination hover effects
    const pageNumbers = document.querySelectorAll(".page-number:not(.current), .next-page, .prev-page");
    pageNumbers.forEach(page => {
        page.addEventListener("mouseenter", () => {
            page.style.transform = "scale(1.05)";
        });
        
        page.addEventListener("mouseleave", () => {
            page.style.transform = "scale(1)";
        });
    });
    
    // Make header sticky immediately on blog pages
    const header = document.querySelector(".sticky-header");
    if (header && !header.classList.contains("scrolled")) {
        header.classList.add("scrolled");
    }
});