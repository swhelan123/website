# Shane Whelan - Personal Portfolio Website

Welcome to the repository for Shane Whelan's personal portfolio website, hosted at [shane-whelan.ie](https://shane-whelan.ie).

## About

This is a static portfolio website showcasing the professional profile, projects, and experiences of Shane Whelan, a Computer Science student at University College Dublin (UCD) and VCU Software Developer at UCD Formula Student Team.

## Website Features

The website includes the following sections:

- **Hero Section**: Interactive 3D background with typing animation
- **About**: Personal introduction and background
- **Education**: Academic qualifications and achievements
- **Projects & Contributions**: Showcase of development projects and open-source contributions
- **Experience**: Professional and volunteer work experience
- **Articles**: Technical articles and blog posts
- **Skills**: Technical skills and competencies
- **Contact**: Contact information and social links

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Fonts**: Google Fonts (Inter family)
- **Icons**: Font Awesome 6.4.0
- **3D Effects**: Three.js with Vanta.js fog effect
- **Hosting**: GitHub Pages with custom domain

## File Structure

```
├── index.html                              # Main portfolio page
├── my-linux-mint-installation-journey.html # Technical article
├── assets/
│   ├── css/
│   │   └── styles.css                      # Main stylesheet
│   ├── images/                             # Images and icons
│   ├── js/                                 # JavaScript files
│   └── docs/                               # Documents (CV, etc.)
├── robots.txt                              # Search engine directives
├── sitemap.xml                            # Site map for SEO
├── site.webmanifest                       # Web app manifest
└── CNAME                                  # Custom domain configuration
```

## Getting Started

### Prerequisites

This is a static website that requires no build process or dependencies. You only need:

- A modern web browser
- A local web server (optional, for development)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/swhelan123/website.git
   cd website
   ```

2. Serve the files locally using any web server:
   
   **Using Python 3:**
   ```bash
   python -m http.server 8000
   ```
   
   **Using Node.js (http-serve):**
   ```bash
   npx serve .
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Deployment

The website is automatically deployed to GitHub Pages and accessible at [shane-whelan.ie](https://shane-whelan.ie). Any changes pushed to the main branch will be automatically deployed.

## Features in Detail

### Interactive Elements

- **3D Background**: Vanta.js fog effect on the hero section
- **Typing Animation**: Dynamic text animation showing different roles
- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **Smooth Scrolling**: Navigation with smooth scroll behavior
- **Sticky Header**: Navigation that becomes sticky on scroll

### SEO Optimization

- Semantic HTML structure
- Meta tags for social media sharing (Open Graph, Twitter Cards)
- Structured data (JSON-LD)
- Sitemap and robots.txt
- Optimized images and performance

## Contributing

This is a personal portfolio website. However, if you notice any bugs or have suggestions for improvements, feel free to:

1. Open an issue
2. Submit a pull request
3. Contact Shane directly through the website

## Contact

- **Website**: [shane-whelan.ie](https://shane-whelan.ie)
- **GitHub**: [@swhelan123](https://github.com/swhelan123)
- **LinkedIn**: [Shane Whelan](https://www.linkedin.com/in/shane-whelan-364988291/)

## License

This project is personal portfolio content. Please respect copyright and don't copy the content or design without permission. The code structure and technical implementation can be used as reference for educational purposes.

---

*Built with ❤️ by Shane Whelan*