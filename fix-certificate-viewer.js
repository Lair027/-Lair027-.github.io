/**
 * Certificate Viewer Fix
 * This standalone script fixes issues with the certificate viewer
 * without affecting other viewers on the site
 */

(function() {
  // Run when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🛠️ Certificate Viewer Fix script loaded');
    initFixedCertificateViewer();
  });

  function initFixedCertificateViewer() {
    // First, find certificates section and items
    const certificatesSection = document.getElementById('certificates');
    
    if (!certificatesSection) {
      console.log('🛠️ Certificates section not found yet, trying again in 1s');
      setTimeout(initFixedCertificateViewer, 1000);
      return;
    }

    // Find all certificate items
    const certificates = document.querySelectorAll('.certificate-item');
    if (!certificates.length) {
      console.log('🛠️ No certificate items found yet, trying again in 1s');
      setTimeout(initFixedCertificateViewer, 1000);
      return;
    }
    
    console.log('🛠️ Found', certificates.length, 'certificate items');
    
    // Clean up any existing certificate viewers to avoid conflicts
    // But leave the project gallery viewer intact
    removeCertificateViewers();
    
    // Create our own viewer with a unique ID
    const viewer = createFixedViewer(certificates.length);
    
    // Get all certificate images
    const certificateImages = [];
    let currentIndex = 0;
    
    certificates.forEach((cert, index) => {
      // Get image source
      const img = cert.querySelector('img');
      if (img) {
        certificateImages.push(img.src);
        console.log(`🛠️ Certificate ${index + 1} image:`, img.src);
      }
      
      // Remove any existing listeners to avoid duplicates
      cert.style.cursor = 'pointer';
      const newCert = cert.cloneNode(true);
      cert.parentNode.replaceChild(newCert, cert);
      
      // Add click event to the new element
      newCert.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openCertificate(index);
      });
    });
    
    // Get viewer elements
    const viewerImg = document.getElementById('fixed-viewer-img');
    const closeBtn = viewer.querySelector('.fixed-viewer-close');
    const prevBtn = viewer.querySelector('.fixed-viewer-prev');
    const nextBtn = viewer.querySelector('.fixed-viewer-next');
    const counter = viewer.querySelector('.fixed-viewer-counter');
    
    // Function to open certificate
    function openCertificate(index) {
      // Check if the gallery viewer is active - if so, don't open our certificate viewer
      const galleryViewer = document.querySelector('.fullscreen-viewer');
      if (galleryViewer && galleryViewer.classList.contains('active')) {
        console.log('🛠️ Gallery viewer is active, not opening certificate viewer');
        return;
      }
      
      console.log('🛠️ Opening certificate', index + 1);
      currentIndex = index;
      
      // Create a new image to force loading
      const newImg = document.createElement('img');
      newImg.id = 'fixed-viewer-img';
      newImg.alt = 'Certificate ' + (index + 1);
      newImg.style.cssText = 'max-width:100%; max-height:100%; object-fit:contain; border:3px solid white; box-shadow:0 0 30px rgba(0,0,0,0.5);';
      
      // Set image source after adding load handlers
      newImg.onload = function() {
        console.log('🛠️ Certificate loaded successfully:', this.src);
      };
      
      newImg.onerror = function() {
        console.error('🛠️ Failed to load certificate:', this.src);
        this.alt = 'Error loading certificate';
        this.style.backgroundColor = 'rgba(255,0,0,0.2)';
        this.style.padding = '20px';
        this.style.color = 'white';
        this.style.textAlign = 'center';
        this.style.fontWeight = 'bold';
        this.style.fontSize = '16px';
        this.innerText = 'Failed to load image';
      };
      
      // Set source
      newImg.src = certificateImages[index];
      
      // Replace existing image
      const container = viewer.querySelector('.fixed-viewer-container');
      const oldImg = document.getElementById('fixed-viewer-img');
      if (oldImg) {
        container.replaceChild(newImg, oldImg);
      } else {
        container.appendChild(newImg);
      }
      
      // Update counter
      if (counter) {
        counter.textContent = `${index + 1} / ${certificateImages.length}`;
      }
      
      // Show viewer with fade-in effect
      viewer.style.display = 'flex';
      
      // Force reflow
      void viewer.offsetWidth;
      
      // Fade in
      viewer.style.opacity = '1';
      viewer.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    }
    
    // Function to close certificate
    function closeCertificate() {
      console.log('🛠️ Closing certificate viewer');
      viewer.style.opacity = '0';
      viewer.style.visibility = 'hidden';
      
      setTimeout(() => {
        viewer.style.display = 'none';
      }, 300);
      
      document.body.style.overflow = '';
    }
    
    // Navigation functions
    function showPrev() {
      currentIndex = (currentIndex <= 0) ? certificateImages.length - 1 : currentIndex - 1;
      openCertificate(currentIndex);
    }
    
    function showNext() {
      currentIndex = (currentIndex >= certificateImages.length - 1) ? 0 : currentIndex + 1;
      openCertificate(currentIndex);
    }
    
    // Set up event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeCertificate);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    
    // Close when clicking outside the image
    viewer.addEventListener('click', function(e) {
      if (e.target === viewer) {
        closeCertificate();
      }
    });
    
    // Keyboard navigation - only when our certificate viewer is active
    document.addEventListener('keydown', function(e) {
      // First ensure our viewer is active
      if (viewer.style.opacity !== '1') return;
      
      // Check if the gallery viewer is active - if so, let it handle keyboard events
      const galleryViewer = document.querySelector('.fullscreen-viewer');
      if (galleryViewer && galleryViewer.classList.contains('active')) {
        console.log('🛠️ Gallery viewer is active, not handling keyboard events');
        return;
      }
      
      // Handle keyboard events for our certificate viewer
      if (e.key === 'Escape') {
        closeCertificate();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });
    
    console.log('🛠️ Fixed certificate viewer initialized');
  }
  
  // Helper function to create the fixed viewer
  function createFixedViewer(totalCertificates) {
    console.log('🛠️ Creating fixed viewer');
    const viewer = document.createElement('div');
    viewer.id = 'fixed-certificate-viewer';
    viewer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.95);
      z-index: 9999999;
      display: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
      align-items: center;
      justify-content: center;
    `;
    
    viewer.innerHTML = `
      <div class="fixed-viewer-close" style="position:absolute; top:20px; right:20px; width:40px; height:40px; background-color:#a67c52; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000001;">
        <i class="fas fa-times" style="color:white; font-size:18px;"></i>
      </div>
      <div class="fixed-viewer-prev" style="position:absolute; left:20px; top:50%; transform:translateY(-50%); width:50px; height:50px; background-color:#a67c52; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000001;">
        <i class="fas fa-chevron-left" style="color:white; font-size:20px;"></i>
      </div>
      <div class="fixed-viewer-container" style="position:relative; display:flex; align-items:center; justify-content:center; width:90%; max-width:1000px; height:80vh; margin:auto;">
        <img src="" alt="Certificate" id="fixed-viewer-img" style="max-width:100%; max-height:100%; object-fit:contain; border:3px solid white; box-shadow:0 0 30px rgba(0,0,0,0.5);">
      </div>
      <div class="fixed-viewer-next" style="position:absolute; right:20px; top:50%; transform:translateY(-50%); width:50px; height:50px; background-color:#a67c52; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000001;">
        <i class="fas fa-chevron-right" style="color:white; font-size:20px;"></i>
      </div>
      <div class="fixed-viewer-counter" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); background-color:rgba(0,0,0,0.7); color:white; padding:5px 15px; border-radius:20px; z-index:10000001;">
        1 / ${totalCertificates}
      </div>
    `;
    
    document.body.appendChild(viewer);
    return viewer;
  }
  
  // Helper function to clean up existing certificate viewers only
  function removeCertificateViewers() {
    const viewerIds = [
      'certificate-fullscreen-viewer', 
      'inline-certificate-viewer',
      'fixed-certificate-viewer'
    ];
    
    viewerIds.forEach(id => {
      const existingViewer = document.getElementById(id);
      if (existingViewer) {
        console.log(`🛠️ Removing existing viewer: ${id}`);
        existingViewer.remove();
      }
    });
    
    // Also remove any viewers with certificate-fullscreen-viewer class
    document.querySelectorAll('.certificate-fullscreen-viewer').forEach(el => {
      console.log('🛠️ Removing viewer with certificate-fullscreen-viewer class');
      el.remove();
    });
  }
})(); 