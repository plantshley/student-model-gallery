/* ========================================
   Student Mental Model Gallery - Scripts
   ======================================== */

// Gallery State
let allSubmissions = [];
let currentSubmissionIndex = 0;
let galleryMediaPrefix = 'submissions/';

// DOM Elements (assigned in DOMContentLoaded)
let galleryGrid, emptyState, loadingState, themeToggle;
let projectModal, modalClose, modalBackdrop, modalName, modalTitle, modalDescription;
let modalLink, modalLinkContainer, modalPrev, modalNext;
let fullscreenViewer, fullscreenClose, fullscreenBackdrop;

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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function parseMarkdownLinks(text) {
    const escaped = escapeHtml(text);
    return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function showEmptyState() {
    loadingState.classList.add('hidden');
    emptyState.classList.add('visible');
}

function createSparkles(element) {
    const sparkleChars = ['✨', '🌟', '🌈', '🤍'];
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
        sparkle.style.left = `${Math.random() * rect.width}px`;
        sparkle.style.top = `${Math.random() * rect.height}px`;
        sparkle.style.fontSize = `${10 + Math.random() * 10}px`;
        element.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
    }
}

// ========================================
// Sparkle Overlay (Homepage Buttons)
// Port of fairy-shop Links.jsx hover effect
// Uses tsParticles with star emitters + absorbers
// ========================================

const SPARKLE_RAINBOW = ['#ff3399', '#ff9933', '#ffdd00', '#00d4ff', '#5599ff', '#aa66ff'];

function createSparkleOverlay(targetElement, index) {
    const containerId = `btn-particles-${index}`;
    const overlay = document.createElement('div');
    overlay.id = containerId;
    overlay.className = 'sparkle-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    targetElement.appendChild(overlay);

    const particleConfig = {
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        detectRetina: true,
        fpsLimit: 120,
        smooth: true,
        particles: {
            number: { value: 30, density: { enable: false } },
            color: { value: SPARKLE_RAINBOW },
            shape: { type: 'star', options: { star: { sides: 4 } } },
            opacity: { value: 0.9 },
            size: { value: { min: 2, max: 5 } },
            rotate: {
                value: { min: 0, max: 360 },
                enable: true,
                direction: 'clockwise',
                animation: { enable: true, speed: 10, sync: false }
            },
            links: { enable: false },
            reduceDuplicates: true,
            move: {
                enable: true,
                center: { x: 50, y: 50 }
            }
        },
        interactivity: { events: {} },
        absorbers: [{
            enable: true,
            opacity: 0,
            size: { value: 1, density: 1, limit: { radius: 5, mass: 5 } },
            position: { x: 50, y: 50 }
        }],
        emitters: [{
            fill: true,
            life: { wait: true },
            rate: { quantity: 8, delay: 0.4 },
            position: { x: 50, y: 50 }
        }]
    };

    let activeContainer = null;

    targetElement.addEventListener('mouseenter', async () => {
        if (activeContainer) return;
        activeContainer = await tsParticles.load(containerId, particleConfig);
    });

    targetElement.addEventListener('mouseleave', () => {
        if (activeContainer) {
            activeContainer.destroy();
            activeContainer = null;
        }
    });
}

// ========================================
// Modal Functions
// ========================================

function openModal(index) {
    if (allSubmissions.length === 0) return;

    currentSubmissionIndex = index;
    const submission = allSubmissions[currentSubmissionIndex];

    const imagePath = submission.projectPath
        ? `${galleryMediaPrefix}${submission.projectPath}`
        : null;

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
    modalDescription.innerHTML = parseMarkdownLinks(submission.description);

    const descLength = submission.description.length;
    modalDescription.classList.remove('desc-small', 'desc-tiny');
    if (descLength > 500) {
        modalDescription.classList.add('desc-tiny');
    } else if (descLength > 300) {
        modalDescription.classList.add('desc-small');
    }

    if (submission.projectUrl) {
        modalLink.href = submission.projectUrl;
        modalLinkContainer.classList.remove('hidden');
    } else {
        modalLinkContainer.classList.add('hidden');
    }

    modalPrev.style.display = allSubmissions.length > 1 ? 'flex' : 'none';
    modalNext.style.display = allSubmissions.length > 1 ? 'flex' : 'none';

    projectModal.classList.add('visible');
    document.body.style.overflow = 'hidden';

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

// ========================================
// Fullscreen Image Functions
// ========================================

function openFullscreenImage(e) {
    e.stopPropagation();
    const modalMedia = document.getElementById('modalImage');
    if (!modalMedia || !modalMedia.src) return;

    const fullscreenContainer = document.querySelector('.fullscreen-viewer');
    const isVideo = modalMedia.tagName.toLowerCase() === 'video';

    const existingMedia = document.getElementById('fullscreenImage');
    if (existingMedia) existingMedia.remove();

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
    initParticles();
}

// ========================================
// Particle Background
// ========================================

async function initParticles() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    const particleColors = isLight
        ? ['#a855f7', '#63f1e8ff', '#f63bddff', '#ffc94aff']
        : ['#ffffff', '#a855f7', '#ff6bbfff', '#06b6d4'];

    const linkColor = '#a855f7';

    await tsParticles.load('particles-js', {
        fullScreen: { enable: false },
        particles: {
            number: {
                value: 80,
                density: { enable: true, value_area: 800 }
            },
            color: { value: particleColors },
            shape: { type: ['circle', 'star'] },
            opacity: {
                value: { min: 0.1, max: 0.8 },
                animation: { enable: true, speed: 1, sync: false }
            },
            size: {
                value: { min: 1, max: 4 },
                animation: { enable: true, speed: 2, sync: false }
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
                outModes: { default: 'bounce' }
            }
        },
        interactivity: {
            events: {
                onHover: { enable: true, mode: 'grab' },
                onClick: { enable: true, mode: 'push' }
            },
            modes: {
                grab: { distance: 140, links: { opacity: 0.5 } },
                push: { quantity: 4 }
            }
        },
        detectRetina: true,
        fpsLimit: 60
    });
}

// ========================================
// Load Submissions
// ========================================

async function loadSubmissions(manifestPath, mediaPrefix) {
    galleryMediaPrefix = mediaPrefix;
    try {
        const manifestResponse = await fetch(manifestPath);
        if (!manifestResponse.ok) throw new Error('Manifest not found');

        const usernames = await manifestResponse.json();
        if (!Array.isArray(usernames) || usernames.length === 0) {
            showEmptyState();
            return;
        }

        const submissions = await Promise.all(
            usernames.map(async (username) => {
                try {
                    const response = await fetch(`${mediaPrefix}${username}.json`);
                    if (!response.ok) return null;
                    const data = await response.json();
                    return { ...data, username };
                } catch {
                    console.warn(`Failed to load submission for: ${username}`);
                    return null;
                }
            })
        );

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
        ? `${galleryMediaPrefix}${submission.projectPath}`
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

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openModal(index));
    card.addEventListener('mouseenter', () => createSparkles(card));

    return card;
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Assign DOM elements
    galleryGrid = document.getElementById('galleryGrid');
    emptyState = document.getElementById('emptyState');
    loadingState = document.getElementById('loadingState');
    themeToggle = document.getElementById('themeToggle');
    projectModal = document.getElementById('projectModal');
    modalClose = document.getElementById('modalClose');
    modalBackdrop = document.querySelector('.modal-backdrop');
    modalName = document.getElementById('modalName');
    modalTitle = document.getElementById('modalTitle');
    modalDescription = document.getElementById('modalDescription');
    modalLink = document.getElementById('modalLink');
    modalLinkContainer = document.getElementById('modalLinkContainer');
    modalPrev = document.getElementById('modalPrev');
    modalNext = document.getElementById('modalNext');
    fullscreenViewer = document.getElementById('fullscreenViewer');
    fullscreenClose = document.getElementById('fullscreenClose');
    fullscreenBackdrop = document.querySelector('.fullscreen-backdrop');

    initTheme();
    initParticles();

    // Theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Theme toggle (all pages)
        if ((e.key === 't' || e.key === 'T') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            toggleTheme();
        }

        // Modal / fullscreen navigation (gallery pages only)
        if (fullscreenViewer && fullscreenViewer.classList.contains('visible')) {
            if (e.key === 'Escape') closeFullscreenImage();
        } else if (projectModal && projectModal.classList.contains('visible')) {
            if (e.key === 'Escape') closeModal();
            else if (e.key === 'ArrowLeft') showPreviousSubmission();
            else if (e.key === 'ArrowRight') showNextSubmission();
        }
    });

    const container = document.querySelector('[data-manifest]');

    if (container) {
        // Gallery page — wire up modal, fullscreen, and load submissions
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
        if (modalPrev) modalPrev.addEventListener('click', showPreviousSubmission);
        if (modalNext) modalNext.addEventListener('click', showNextSubmission);
        if (fullscreenClose) fullscreenClose.addEventListener('click', closeFullscreenImage);
        if (fullscreenBackdrop) fullscreenBackdrop.addEventListener('click', closeFullscreenImage);

        loadSubmissions(container.dataset.manifest, container.dataset.mediaPrefix || '');
    } else {
        // Homepage — init sparkle overlay on nav buttons
        document.querySelectorAll('.nav-button').forEach((btn, i) => createSparkleOverlay(btn, i));
    }
});
