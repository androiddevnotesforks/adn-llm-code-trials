// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Animate hamburger bars
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach(bar => bar.classList.toggle('active'));
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('active'));
    });
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateOnScrollElements = document.querySelectorAll('.feature-card, .testimonial-card, .step');
animateOnScrollElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Typing animation for hero title
const heroTitle = document.querySelector('.hero-title');
const titleText = heroTitle.innerHTML;
heroTitle.innerHTML = '';

function typeWriter(text, element, speed = 100) {
    let i = 0;
    element.style.borderRight = '2px solid white';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }

    type();
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        typeWriter(titleText, heroTitle, 50);
    }, 500);
});

// Resume Generator Functionality
function generateResume() {
    const prompt = document.getElementById('prompt').value;
    const industry = document.getElementById('industry').value;

    if (!prompt.trim()) {
        alert('Please describe your professional background to generate a resume.');
        return;
    }

    // Show loading state
    const generateBtn = document.querySelector('.btn-large');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;

    // Simulate AI processing
    setTimeout(() => {
        // Create a mock resume preview
        showResumePreview(prompt, industry);

        // Reset button
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;

        // Show success message
        alert('Resume generated successfully! Check the preview below.');
    }, 3000);
}

function showResumePreview(prompt, industry) {
    // Create a modal or preview area
    const previewModal = document.createElement('div');
    previewModal.className = 'resume-preview-modal';
    previewModal.innerHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <h3>Generated Resume Preview</h3>
                <button class="close-preview" onclick="closePreview()">&times;</button>
            </div>
            <div class="resume-preview-content">
                <div class="resume-header">
                    <h2>John Doe</h2>
                    <p>Software Engineer</p>
                    <div class="contact-info">
                        <span><i class="fas fa-envelope"></i> john.doe@email.com</span>
                        <span><i class="fas fa-phone"></i> (555) 123-4567</span>
                        <span><i class="fas fa-map-marker-alt"></i> San Francisco, CA</span>
                    </div>
                </div>
                <div class="resume-section">
                    <h3>Professional Summary</h3>
                    <p>Based on your description, our AI has crafted a professional summary highlighting your key strengths and experience in ${industry || 'your field'}.</p>
                </div>
                <div class="resume-section">
                    <h3>Experience</h3>
                    <div class="experience-item">
                        <h4>Senior Software Engineer</h4>
                        <p class="company">Tech Company Inc. | 2020 - Present</p>
                        <ul>
                            <li>Led development of scalable web applications using modern technologies</li>
                            <li>Collaborated with cross-functional teams to deliver high-quality software</li>
                            <li>Mentored junior developers and established best practices</li>
                        </ul>
                    </div>
                </div>
                <div class="resume-section">
                    <h3>Skills</h3>
                    <div class="skills-grid">
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">React</span>
                        <span class="skill-tag">Node.js</span>
                        <span class="skill-tag">Python</span>
                        <span class="skill-tag">AWS</span>
                    </div>
                </div>
            </div>
            <div class="preview-actions">
                <button class="btn-primary" onclick="downloadResume()">
                    <i class="fas fa-download"></i> Download PDF
                </button>
                <button class="btn-secondary" onclick="editResume()">
                    <i class="fas fa-edit"></i> Edit Resume
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(previewModal);

    // Add modal styles
    const modalStyles = `
        .resume-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
        }
        .preview-content {
            background: white;
            border-radius: 20px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            width: 100%;
        }
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 2rem;
        }
        .close-preview {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-secondary);
        }
        .resume-preview-content {
            padding: 0 2rem 2rem;
        }
        .resume-header h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        .contact-info {
            display: flex;
            gap: 2rem;
            margin-top: 1rem;
            color: var(--text-secondary);
        }
        .contact-info span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .resume-section {
            margin-bottom: 2rem;
        }
        .resume-section h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-size: 1.25rem;
        }
        .experience-item h4 {
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        .company {
            color: var(--text-secondary);
            font-style: italic;
            margin-bottom: 1rem;
        }
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .skill-tag {
            background: var(--bg-secondary);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            color: var(--text-primary);
        }
        .preview-actions {
            display: flex;
            gap: 1rem;
            padding: 2rem;
            border-top: 1px solid var(--border-color);
            justify-content: center;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
}

function closePreview() {
    const modal = document.querySelector('.resume-preview-modal');
    if (modal) {
        modal.remove();
    }
    // Remove the added styles
    const addedStyles = document.querySelectorAll('style');
    addedStyles.forEach(style => {
        if (style.textContent.includes('resume-preview-modal')) {
            style.remove();
        }
    });
}

function downloadResume() {
    alert('Resume download feature would be implemented here. This would typically generate a PDF file.');
}

function editResume() {
    closePreview();
    alert('Resume editor would open here. This would allow users to customize their generated resume.');
}

// Add floating animation to elements
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });
}

// Initialize animations
window.addEventListener('load', () => {
    addFloatingAnimation();

    // Add stagger animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-element');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    floatingElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add click ripple effect to buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        e.target.appendChild(ripple);

        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});
