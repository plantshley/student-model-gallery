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
const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenClose = document.getElementById('fullscreenClose');
const fullscreenBackdrop = document.querySelector('.fullscreen-backdrop');

// Gallery State
let allSubmissions = [];
let currentSubmissionIndex = 0;

// ========================================
// Helper Functions
// ========================================

function isVideoFile(path) {
    if (!path) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    const ext = path.toLowerCase().substring(path.lastIndexOf('.'));
    return videoExtensions.includes(ext);
}

function createMediaElement(imagePath, altText, className, onError) {
    if (isVideoFile(imagePath)) {
        return `<video src="${imagePath}" class="${className}" autoplay loop muted playsinline onerror="${onError}"></video>`;
    } else {
        return `<img src="${imagePath}" alt="${altText}" class="${className}" loading="lazy" onerror="${onError}">`;
    }
}

// ========================================
// Modal Functions
// ========================================

function openModal(index) {
    if (allSubmissions.length === 0) return;

    currentSubmissionIndex = index;
    const submission = allSubmissions[currentSubmissionIndex];

    const imagePath = submission.projectPath
        ? `submissions/${submission.projectPath}`
        : null;

    // Populate modal content
    const modalImageContainer = document.querySelector('.modal-image-container');

    if (imagePath) {
        const mediaElement = createMediaElement(
            imagePath,
            escapeHtml(submission.projectTitle),
            'modal-image',
            "this.parentElement.innerHTML='<div class=\\'modal-image-placeholder\\'>no image :-(</div>'"
        );
        modalImageContainer.innerHTML = mediaElement.replace('class="modal-image"', 'id="modalImage" class="modal-image"');
    } else {
        modalImageContainer.innerHTML = '<div class="modal-image-placeholder">no image :-(</div>';
    }
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

    // Add click listener to modal image for fullscreen
    setTimeout(() => {
        const currentModalImage = document.getElementById('modalImage');
        if (currentModalImage) {
            currentModalImage.addEventListener('click', openFullscreenImage);
        }
    }, 100);
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
    if (fullscreenViewer.classList.contains('visible')) {
        if (e.key === 'Escape') {
            closeFullscreenImage();
        }
    } else if (projectModal.classList.contains('visible')) {
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
// Fullscreen Image Functions
// ========================================

function openFullscreenImage(e) {
    e.stopPropagation();
    const modalMedia = document.getElementById('modalImage');
    if (!modalMedia || !modalMedia.src) return;

    const fullscreenContainer = document.querySelector('.fullscreen-viewer');
    const isVideo = modalMedia.tagName.toLowerCase() === 'video';

    // Replace the img element with appropriate media element
    const existingMedia = document.getElementById('fullscreenImage');
    if (existingMedia) {
        existingMedia.remove();
    }

    if (isVideo) {
        const video = document.createElement('video');
        video.id = 'fullscreenImage';
        video.className = 'fullscreen-image';
        video.src = modalMedia.src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.addEventListener('click', closeFullscreenImage);
        fullscreenContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.id = 'fullscreenImage';
        img.className = 'fullscreen-image';
        img.src = modalMedia.src;
        img.alt = modalMedia.alt || '';
        img.addEventListener('click', closeFullscreenImage);
        fullscreenContainer.appendChild(img);
    }

    fullscreenViewer.classList.add('visible');
}

function closeFullscreenImage() {
    fullscreenViewer.classList.remove('visible');
}

// Fullscreen close event listeners
fullscreenClose.addEventListener('click', closeFullscreenImage);
fullscreenBackdrop.addEventListener('click', closeFullscreenImage);

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
        ? ['#a855f7', '#63f1e8ff', '#f63bddff', "#ffc94aff"]
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

    const imagePath = submission.projectPath
        ? `submissions/${submission.projectPath}`
        : null;

    const mediaContent = imagePath
        ? createMediaElement(
            imagePath,
            escapeHtml(submission.projectTitle),
            'card-image',
            "this.parentElement.innerHTML='<div class=\\'card-image-placeholder\\'>no image :-(</div>'"
        )
        : '<div class="card-image-placeholder">no image :-(</div>';

    card.innerHTML = `
        <div class="card-image-container">
            ${mediaContent}
        </div>
        <div class="card-content">
            <p class="card-name">${escapeHtml(submission.name)}</p>
            <h3 class="card-title">${escapeHtml(submission.projectTitle)}</h3>
        </div>
    `;

    // Make whole card clickable
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

        // Random position within the entire card (full height)
        sparkle.style.left = `${Math.random() * rect.width}px`;
        sparkle.style.top = `${Math.random() * rect.height}px`;
        sparkle.style.fontSize = `${10 + Math.random() * 10}px`;

        element.appendChild(sparkle);

        // Remove after animation (increased to 2 seconds)
        setTimeout(() => sparkle.remove(), 2000);
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
