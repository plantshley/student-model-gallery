/* ========================================
   Student Mental Model Gallery - Scripts
   ======================================== */

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const themeToggle = document.getElementById('themeToggle');
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalLink = document.getElementById('modalLink');
const modalLinkContainer = document.getElementById('modalLinkContainer');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

// Gallery State
let allSubmissions = [];
let currentSubmissionIndex = 0;

// ========================================
// Modal Functions
// ========================================

function openModal(index) {
    if (allSubmissions.length === 0) return;

    currentSubmissionIndex = index;
    const submission = allSubmissions[currentSubmissionIndex];

    const imagePath = submission.imagePath
        ? `submissions/${submission.imagePath}`
        : null;

    // Populate modal content
    modalImage.src = imagePath || '';
    modalImage.alt = submission.projectTitle;
    modalName.textContent = submission.name;
    modalTitle.textContent = submission.projectTitle;
    modalDescription.textContent = submission.description;

    // Adjust description font size based on length
    const descLength = submission.description.length;
    modalDescription.classList.remove('desc-small', 'desc-tiny');

    if (descLength > 500) {
        modalDescription.classList.add('desc-tiny');
    } else if (descLength > 300) {
        modalDescription.classList.add('desc-small');
    }

    // Handle optional project URL
    if (submission.projectUrl) {
        modalLink.href = submission.projectUrl;
        modalLinkContainer.classList.remove('hidden');
    } else {
        modalLinkContainer.classList.add('hidden');
    }

    // Show/hide navigation arrows
    modalPrev.style.display = allSubmissions.length > 1 ? 'flex' : 'none';
    modalNext.style.display = allSubmissions.length > 1 ? 'flex' : 'none';

    // Show modal
    projectModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    projectModal.classList.remove('visible');
    document.body.style.overflow = '';
}

function showPreviousSubmission() {
    currentSubmissionIndex = (currentSubmissionIndex - 1 + allSubmissions.length) % allSubmissions.length;
    openModal(currentSubmissionIndex);
}

function showNextSubmission() {
    currentSubmissionIndex = (currentSubmissionIndex + 1) % allSubmissions.length;
    openModal(currentSubmissionIndex);
}

// Modal close event listeners
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
modalPrev.addEventListener('click', showPreviousSubmission);
modalNext.addEventListener('click', showNextSubmission);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (projectModal.classList.contains('visible')) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            showPreviousSubmission();
        } else if (e.key === 'ArrowRight') {
            showNextSubmission();
        }
    }
});

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
        ? ['#a855f7', '#63f1e8ff', '#f63bddff']
        : ['#ffffff', '#a855f7', '#ff6bbfff', '#06b6d4'];

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

    // Store submissions globally for modal navigation
    allSubmissions = submissions;

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
                ? `<img src="${imagePath}" alt="${escapeHtml(submission.projectTitle)}" class="card-image" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-image-placeholder\\'>&#127912;</div>'">`
                : '<div class="card-image-placeholder">&#127912;</div>'
            }
        </div>
        <div class="card-content">
            <p class="card-name">${escapeHtml(submission.name)}</p>
            <h3 class="card-title">${escapeHtml(submission.projectTitle)}</h3>
            <button class="card-link">
                View Details
            </button>
        </div>
    `;

    // Make card clickable to open modal
    const viewButton = card.querySelector('.card-link');
    viewButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(index);
    });

    // Also make whole card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        openModal(index);
    });

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
    const sparkleChars = ['✨', '🌟', '🌈', "🤍"];
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
