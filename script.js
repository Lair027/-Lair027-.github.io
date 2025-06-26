// Fullscreen Image Viewer
document.addEventListener('DOMContentLoaded', function() {
  // Get all project images that should be viewable in fullscreen
  const modalMainImages = document.querySelectorAll('.modal-main-image img');
  const modalSecondaryImages = document.querySelectorAll('.modal-secondary-image img');
  const modalAdditionalImages = document.querySelectorAll('.modal-additional-image img');
  
  const fullscreenViewer = document.getElementById('fullscreen-viewer');
  const fullscreenImg = document.getElementById('fullscreen-img');
  const fullscreenClose = document.querySelector('.fullscreen-close');
  const fullscreenNext = document.querySelector('.fullscreen-nav.next');
  const fullscreenPrev = document.querySelector('.fullscreen-nav.prev');
  const currentImageSpan = document.getElementById('current-image');
  const totalImagesSpan = document.getElementById('total-images');
  
  let currentImageIndex = 0;
  let projectImages = [];
  
  // Add click event listener to all modal images
  function setupFullscreenViewers() {
    // Collect all images that need fullscreen capability
    const allModalImages = [
      ...modalMainImages,
      ...modalSecondaryImages,
      ...modalAdditionalImages
    ];
    
    allModalImages.forEach(img => {
      img.addEventListener('click', openFullscreen);
    });
  }
  
  // Open fullscreen viewer
  function openFullscreen(e) {
    e.preventDefault();
    
    // Get all images from the current project modal
    const currentModal = e.target.closest('.modal-content-wrapper');
    const currentModalImages = [
      ...currentModal.querySelectorAll('.modal-main-image img'),
      ...currentModal.querySelectorAll('.modal-secondary-image img'),
      ...currentModal.querySelectorAll('.modal-additional-image img')
    ];
    
    projectImages = currentModalImages.map(img => img.src);
    currentImageIndex = projectImages.indexOf(e.target.src);
    
    // Set the fullscreen image
    fullscreenImg.src = e.target.src;
    fullscreenImg.alt = e.target.alt;
    
    // Update counter
    currentImageSpan.textContent = currentImageIndex + 1;
    totalImagesSpan.textContent = projectImages.length;
    
    // Show fullscreen viewer
    fullscreenViewer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when fullscreen is active
  }
  
  // Close fullscreen viewer
  function closeFullscreen() {
    fullscreenViewer.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Navigate to next image
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % projectImages.length;
    updateFullscreenImage();
  }
  
  // Navigate to previous image
  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    updateFullscreenImage();
  }
  
  // Update the fullscreen image
  function updateFullscreenImage() {
    fullscreenImg.src = projectImages[currentImageIndex];
    fullscreenImg.alt = `Project image ${currentImageIndex + 1}`;
    currentImageSpan.textContent = currentImageIndex + 1;
  }
  
  // Keyboard navigation
  function handleKeyDown(e) {
    if (!fullscreenViewer.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeFullscreen();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  }
  
  // Event listeners
  fullscreenClose.addEventListener('click', closeFullscreen);
  fullscreenNext.addEventListener('click', nextImage);
  fullscreenPrev.addEventListener('click', prevImage);
  document.addEventListener('keydown', handleKeyDown);
  
  // Initialize fullscreen viewers after the DOM is fully loaded
  setupFullscreenViewers();
});

// Certificate image click handler
document.addEventListener('DOMContentLoaded', function() {
  const certificateImages = document.querySelectorAll('.certificate-item .certificate-image img');
  const fullscreenViewer = document.getElementById('certificate-fullscreen-viewer');
  const fullscreenImage = document.getElementById('fullscreen-certificate-img');
  const closeButton = document.querySelector('.certificate-fullscreen-viewer .fullscreen-close');
  const prevButton = document.querySelector('.certificate-fullscreen-viewer .fullscreen-nav.prev');
  const nextButton = document.querySelector('.certificate-fullscreen-viewer .fullscreen-nav.next');
  const currentCounter = document.getElementById('current-certificate');
  const totalCounter = document.getElementById('total-certificates');
  
  let currentImageIndex = 0;
  const totalImages = certificateImages.length;
  
  if (certificateImages.length > 0) {
    // Update total counter
    if (totalCounter) totalCounter.textContent = totalImages;
    
    // Set up click handlers for certificate images
    certificateImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        openFullscreenViewer(index);
      });
    });
    
    // Close fullscreen viewer
    if (closeButton) {
      closeButton.addEventListener('click', closeFullscreenViewer);
    }
    
    // Navigate through images
    if (prevButton) {
      prevButton.addEventListener('click', showPreviousImage);
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', showNextImage);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!fullscreenViewer.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeFullscreenViewer();
      } else if (e.key === 'ArrowLeft') {
        showPreviousImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    });
  }
  
  function openFullscreenViewer(index) {
    currentImageIndex = index;
    
    if (fullscreenImage && certificateImages[index]) {
      fullscreenImage.src = certificateImages[index].src;
      if (currentCounter) currentCounter.textContent = index + 1;
      
      fullscreenViewer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeFullscreenViewer() {
    fullscreenViewer.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    updateFullscreenImage();
  }
  
  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    updateFullscreenImage();
  }
  
  function updateFullscreenImage() {
    if (fullscreenImage && certificateImages[currentImageIndex]) {
      fullscreenImage.src = certificateImages[currentImageIndex].src;
      if (currentCounter) currentCounter.textContent = currentImageIndex + 1;
    }
  }
});

// Certificate viewer setup
function initCertificateViewers() {
  console.log('Initializing certificate viewers');
  
  // Get all certificate images
  const certificateItems = document.querySelectorAll('.certificate-item');
  const fullscreenViewer = document.getElementById('certificate-fullscreen-viewer');
  const fullscreenImg = document.getElementById('fullscreen-certificate-img');
  const closeBtn = fullscreenViewer ? fullscreenViewer.querySelector('.fullscreen-close') : null;
  const prevBtn = fullscreenViewer ? fullscreenViewer.querySelector('.fullscreen-nav.prev') : null;
  const nextBtn = fullscreenViewer ? fullscreenViewer.querySelector('.fullscreen-nav.next') : null;
  const currentCountEl = document.getElementById('current-certificate');
  const totalCountEl = document.getElementById('total-certificates');
  
  // Check if elements exist before proceeding
  if (!fullscreenViewer || !fullscreenImg) {
    console.error('Certificate viewer elements not found!');
    return;
  }
  
  let currentIndex = 0;
  const certificates = Array.from(document.querySelectorAll('.certificate-image img'));
  
  // Update total certificate count
  if (totalCountEl) {
    totalCountEl.textContent = certificates.length;
  }
  
  // Add click event to all certificate items
  certificateItems.forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      openCertificateViewer(index);
    });
    // Make sure cursor indicates it's clickable
    item.style.cursor = 'pointer';
  });
  
  // Function to open certificate viewer
  function openCertificateViewer(index) {
    currentIndex = index;
    updateCertificateImage();
    fullscreenViewer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  // Function to close certificate viewer
  function closeCertificateViewer() {
    fullscreenViewer.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Function to show previous certificate
  function showPrevCertificate() {
    currentIndex = (currentIndex === 0) ? certificates.length - 1 : currentIndex - 1;
    updateCertificateImage();
  }
  
  // Function to show next certificate
  function showNextCertificate() {
    currentIndex = (currentIndex === certificates.length - 1) ? 0 : currentIndex + 1;
    updateCertificateImage();
  }
  
  // Function to update the certificate image in fullscreen viewer
  function updateCertificateImage() {
    // Apply fade-out effect
    fullscreenImg.style.opacity = '0';
    
    setTimeout(() => {
      // Update the image source
      fullscreenImg.src = certificates[currentIndex].src;
      
      // Update the counter
      if (currentCountEl) {
        currentCountEl.textContent = currentIndex + 1;
      }
      
      // Fade image back in
      fullscreenImg.style.opacity = '1';
    }, 200);
  }
  
  // Event listeners for navigation
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCertificateViewer);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', showPrevCertificate);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', showNextCertificate);
  }
  
  // Close when clicking outside the image
  fullscreenViewer.addEventListener('click', function(e) {
    if (e.target === fullscreenViewer) {
      closeCertificateViewer();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!fullscreenViewer.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeCertificateViewer();
    } else if (e.key === 'ArrowLeft') {
      showPrevCertificate();
    } else if (e.key === 'ArrowRight') {
      showNextCertificate();
    }
  });
  
  console.log('Certificate viewer initialized');
}

// Load content sections and handle navigation
document.addEventListener('DOMContentLoaded', function() {
  // Handle content loading
  function loadContent(sectionId, path) {
    const contentElement = document.getElementById(`${sectionId}-content`);
    if (!contentElement) return;
    
    fetch(path)
      .then(response => response.text())
      .then(html => {
        contentElement.innerHTML = html;
        
        // Initialize section-specific functionality
        if (sectionId === 'projects') {
          initProjectModals();
          setupFullscreenViewers();
        } else if (sectionId === 'certificates') {
          initCertificateViewers();
        }
      })
      .catch(error => {
        console.error(`Error loading ${sectionId} content:`, error);
      });
  }
  
  // Function to initialize project modals
  function initProjectModals() {
    const projectItems = document.querySelectorAll('.project-item');
    const modals = document.querySelectorAll('.project-modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Open modals when project items are clicked
    projectItems.forEach(item => {
      item.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        const modal = document.getElementById(`modal-${projectId}`);
        
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close modals when close button is clicked
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.project-modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
    
    // Close modal when clicking outside of modal content
    modals.forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        modals.forEach(modal => {
          if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      }
    });
  }
  
  // Load all section content
  loadContent('home', 'components/home.html');
  loadContent('education', 'components/education.html');
  loadContent('projects', 'components/projects.html');
  loadContent('certificates', 'components/certificates.html');
  
  // Handle navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target section
      const targetSection = this.getAttribute('data-section') || 
                          this.getAttribute('href').replace('#', '');
      
      // Update active navigation link
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      this.classList.add('active');
      
      // Scroll to section
      const targetElement = document.getElementById(`${targetSection}-content`);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
});

// --- Duel Learn video overlay logic ---
function setupDuelLearnVideoOverlay() {
  const duelModal = document.getElementById('modal-duel-learn');
  if (!duelModal) return;
  const video = duelModal.querySelector('.duel-learn-video');
  const overlay = duelModal.querySelector('.duel-learn-play-overlay');
  if (video && overlay) {
    function updateOverlay() {
      if (video.paused) {
        overlay.style.display = '';
      } else {
        overlay.style.display = 'none';
      }
    }
    video.addEventListener('play', updateOverlay);
    video.addEventListener('pause', updateOverlay);
    video.addEventListener('ended', updateOverlay);
    // Initial state
    updateOverlay();
  }
}

document.addEventListener('click', function(e) {
  // Check if Duel Learn modal is being opened
  if (e.target.closest('.project-link[data-project="duel-learn"]')) {
    setTimeout(setupDuelLearnVideoOverlay, 100);
  }
}); 