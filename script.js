/* ========================================
   Student Mental Model Gallery - Scripts
   ======================================== */

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const themeToggle = document.getElementById('themeToggle');

// ========================================
// Theme Toggle
// ========================================

function initTheme() {
    const savedTheme = localStorage.getItem('gallery-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('gallery-theme', newTheme);

    // Reinitialize particles with new theme colors
    initParticles();
}

themeToggle.addEventListener('click', toggleTheme);

// Keyboard shortcut for theme toggle
document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            toggleTheme();
        }
    }
});

// ========================================
// Particle Background
// ========================================

async function initParticles() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    const particleColors = isLight
        ? ['#a855f7', '#6366f1', '#3b82f6']
        : ['#ffffff', '#a855f7', '#ff6b9d', '#06b6d4'];

    const linkColor = isLight ? '#a855f7' : '#a855f7';

    await tsParticles.load('particles-js', {
        fullScreen: { enable: false },
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: particleColors
            },
            shape: {
                type: ['circle', 'star']
            },
            opacity: {
                value: { min: 0.1, max: 0.8 },
                animation: {
                    enable: true,
                    speed: 1,
                    sync: false
                }
            },
            size: {
                value: { min: 1, max: 4 },
                animation: {
                    enable: true,
                    speed: 2,
                    sync: false
                }
            },
            links: {
                enable: true,
                distance: 150,
                color: linkColor,
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 0.8,
                direction: 'none',
                random: true,
                straight: false,
                outModes: {
                    default: 'bounce'
                }
            }
        },
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab'
                },
                onClick: {
                    enable: true,
                    mode: 'push'
                }
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.5
                    }
                },
                push: {
                    quantity: 4
                }
            }
        },
        detectRetina: true,
        fpsLimit: 60
    });
}

// ========================================
// Load Submissions
// ========================================

async function loadSubmissions() {
    try {
        // Fetch the manifest file
        const manifestResponse = await fetch('submissions/submissions.json');

        if (!manifestResponse.ok) {
            throw new Error('Manifest not found');
        }

        const usernames = await manifestResponse.json();

        if (!Array.isArray(usernames) || usernames.length === 0) {
            showEmptyState();
            return;
        }

        // Fetch each submission
        const submissions = await Promise.all(
            usernames.map(async (username) => {
                try {
                    const response = await fetch(`submissions/${username}.json`);
                    if (!response.ok) return null;
                    const data = await response.json();
                    return { ...data, username };
                } catch {
                    console.warn(`Failed to load submission for: ${username}`);
                    return null;
                }
            })
        );

        // Filter out failed loads
        const validSubmissions = submissions.filter(s => s !== null);

        if (validSubmissions.length === 0) {
            showEmptyState();
            return;
        }

        renderGallery(validSubmissions);
    } catch (error) {
        console.warn('Could not load submissions:', error);
        showEmptyState();
    }
}

// ========================================
// Render Gallery
// ========================================

function renderGallery(submissions) {
    loadingState.classList.add('hidden');
    emptyState.classList.remove('visible');
    galleryGrid.innerHTML = '';

    submissions.forEach((submission, index) => {
        const card = createCard(submission, index);
        galleryGrid.appendChild(card);
    });
}

function createCard(submission, index) {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const imagePath = submission.imagePath
        ? `submissions/${submission.imagePath}`
        : null;

    card.innerHTML = `
        <div class="card-image-container">
            ${imagePath
                ? `<img src="${imagePath}" alt="${submission.projectTitle}" class="card-image" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-image-placeholder\\'>&#127912;</div>'">`
                : '<div class="card-image-placeholder">&#127912;</div>'
            }
        </div>
        <div class="card-content">
            <p class="card-name">${escapeHtml(submission.name)}</p>
            <h3 class="card-title">${escapeHtml(submission.projectTitle)}</h3>
            <p class="card-description">${escapeHtml(submission.description)}</p>
            <a href="${escapeHtml(submission.projectUrl)}" class="card-link" target="_blank" rel="noopener noreferrer">
                View Project
            </a>
        </div>
    `;

    // Add sparkle effect on hover
    card.addEventListener('mouseenter', (e) => {
        createSparkles(card, e);
    });

    return card;
}

// ========================================
// Helper Functions
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showEmptyState() {
    loadingState.classList.add('hidden');
    emptyState.classList.add('visible');
}

function createSparkles(element, event) {
    const sparkleChars = ['✨', '⭐', '💫', '✦', '★'];
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];

        // Random position within the card
        sparkle.style.left = `${Math.random() * rect.width}px`;
        sparkle.style.top = `${Math.random() * 50}px`;
        sparkle.style.fontSize = `${10 + Math.random() * 10}px`;

        element.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initParticles();
    loadSubmissions();
});
