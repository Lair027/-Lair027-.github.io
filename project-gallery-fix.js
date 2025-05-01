/**
 * Project Gallery Fix
 * This script fixes issues with the project gallery fullscreen viewer
 * It works independently from certificate viewer
 */

(function() {
  // Run when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Project Gallery Fix loaded');
    // Wait a moment to ensure all other scripts have initialized
    setTimeout(initProjectGalleryFix, 500);
  });

  // Also run when DOM content is updated (when modals are opened)
  document.addEventListener('click', function(e) {
    // Check if clicked on project link or button
    if (e.target.closest('.project-link') || e.target.closest('.btn-small')) {
      console.log('🖼️ Project link/button clicked, initializing gallery');
      setTimeout(initProjectGalleryFix, 300);
    }
  });

  function initProjectGalleryFix() {
    console.log('🖼️ Initializing project gallery fix');
    
    // Create our dedicated project gallery viewer
    const viewerId = 'project-gallery-viewer';
    let viewer = document.getElementById(viewerId);
    
    // Remove existing viewer if it exists
    if (viewer) {
      console.log('🖼️ Removing existing project gallery viewer');
      viewer.remove();
    }
    
    // Create a fresh viewer
    viewer = document.createElement('div');
    viewer.id = viewerId;
    viewer.className = 'project-gallery-viewer';
    
    // Apply inline styles to ensure visibility
    viewer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.95);
      z-index: 9999999;
      display: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
      align-items: center;
      justify-content: center;
    `;
    
    // Add viewer content
    viewer.innerHTML = `
      <div class="pg-close" style="position:absolute; top:20px; right:20px; width:40px; height:40px; background-color:rgba(255,255,255,0.2); border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000;">
        <i class="fas fa-times" style="color:white; font-size:20px;"></i>
      </div>
      <div class="pg-prev" style="position:absolute; left:20px; top:50%; transform:translateY(-50%); width:50px; height:50px; background-color:rgba(255,255,255,0.2); border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000;">
        <i class="fas fa-chevron-left" style="color:white; font-size:24px;"></i>
      </div>
      <div class="pg-container" style="position:relative; display:flex; align-items:center; justify-content:center; width:90%; max-width:1200px; height:85vh; margin:auto;">
        <img src="" alt="Project Gallery Image" id="pg-image" style="max-width:100%; max-height:100%; object-fit:contain; box-shadow:0 0 30px rgba(0,0,0,0.5);">
      </div>
      <div class="pg-next" style="position:absolute; right:20px; top:50%; transform:translateY(-50%); width:50px; height:50px; background-color:rgba(255,255,255,0.2); border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000;">
        <i class="fas fa-chevron-right" style="color:white; font-size:24px;"></i>
      </div>
      <div class="pg-counter" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); color:white; font-size:14px; padding:5px 15px; background-color:rgba(0,0,0,0.5); border-radius:20px; z-index:10000;">
        1 / 1
      </div>
      <div class="pg-status" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; background-color:rgba(0,0,0,0.7); padding:10px 20px; border-radius:5px; display:none;">
        Loading image...
      </div>
    `;
    
    // Add to document
    document.body.appendChild(viewer);
    
    // Gallery state variables
    let currentImages = [];
    let currentIndex = 0;
    
    // Get viewer elements
    const imageEl = viewer.querySelector('#pg-image');
    const closeBtn = viewer.querySelector('.pg-close');
    const prevBtn = viewer.querySelector('.pg-prev');
    const nextBtn = viewer.querySelector('.pg-next');
    const counterEl = viewer.querySelector('.pg-counter');
    const statusEl = viewer.querySelector('.pg-status');
    
    // Add click handlers
    closeBtn.addEventListener('click', closeGallery);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      // Only respond to keyboard events when gallery is open
      if (viewer.style.display !== 'flex') return;
      
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    });
    
    // Add click handlers to all project gallery images
    setupGalleryImageHandlers();
    
    // Set up modal observers to watch for new content
    setupModalObserver();
    
    // Open gallery with image
    function openGallery(imageElement) {
      console.log('🖼️ Opening gallery with image:', imageElement.src);
      
      // Find all images in this modal
      const modal = imageElement.closest('.modal-content-wrapper');
      if (!modal) {
        console.error('🖼️ Could not find parent modal');
        return;
      }
      
      // Get all images in this modal
      currentImages = Array.from(modal.querySelectorAll(
        '.modal-main-image img, .modal-secondary-image img, .modal-additional-image img'
      ));
      
      console.log('🖼️ Found', currentImages.length, 'images in modal');
      
      // Find index of current image
      currentIndex = currentImages.indexOf(imageElement);
      if (currentIndex === -1) currentIndex = 0;
      
      // Show status indicator while loading
      showStatus('Loading image...');
      
      // Create a fresh image element to force reload
      const newImage = new Image();
      newImage.id = 'pg-image';
      newImage.alt = 'Project Gallery Image';
      newImage.style.cssText = 'max-width:100%; max-height:100%; object-fit:contain; box-shadow:0 0 30px rgba(0,0,0,0.5);';
      
      // Set up load handlers
      newImage.onload = function() {
        console.log('🖼️ Image loaded successfully:', this.src);
        hideStatus();
      };
      
      newImage.onerror = function() {
        console.error('🖼️ Error loading image:', this.src);
        showStatus('Error loading image', true);
      };
      
      // Set the source AFTER adding handlers
      newImage.src = imageElement.src;
      
      // Replace existing image
      const container = viewer.querySelector('.pg-container');
      const oldImage = container.querySelector('img');
      if (oldImage) {
        container.replaceChild(newImage, oldImage);
      } else {
        container.appendChild(newImage);
      }
      
      // Update counter
      updateCounter();
      
      // Show viewer
      viewer.style.display = 'flex';
      
      // Force reflow
      void viewer.offsetWidth;
      
      // Fade in
      viewer.style.opacity = '1';
      viewer.style.visibility = 'visible';
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Print computed styles to verify visibility
      const computedStyle = window.getComputedStyle(viewer);
      console.log('🖼️ VIEWER STYLES:', 
        'Display:', computedStyle.display,
        'Opacity:', computedStyle.opacity,
        'Visibility:', computedStyle.visibility,
        'Z-Index:', computedStyle.zIndex
      );
    }
    
    // Close gallery
    function closeGallery() {
      console.log('🖼️ Closing gallery');
      
      // Fade out
      viewer.style.opacity = '0';
      viewer.style.visibility = 'hidden';
      
      // Hide after transition
      setTimeout(() => {
        viewer.style.display = 'none';
      }, 300);
      
      // Restore scrolling
      document.body.style.overflow = '';
    }
    
    // Navigate to previous image
    function showPrevImage() {
      if (currentImages.length <= 1) return;
      
      currentIndex = (currentIndex <= 0) ? 
        currentImages.length - 1 : currentIndex - 1;
        
      updateImage();
    }
    
    // Navigate to next image
    function showNextImage() {
      if (currentImages.length <= 1) return;
      
      currentIndex = (currentIndex >= currentImages.length - 1) ? 
        0 : currentIndex + 1;
        
      updateImage();
    }
    
    // Update image display
    function updateImage() {
      if (!currentImages.length || currentIndex < 0 || currentIndex >= currentImages.length) {
        console.error('🖼️ Invalid image index:', currentIndex);
        return;
      }
      
      const img = currentImages[currentIndex];
      if (!img || !img.src) {
        console.error('🖼️ Invalid image at index:', currentIndex);
        return;
      }
      
      // Show status
      showStatus('Loading image...');
      
      // Create new image
      const newImage = new Image();
      newImage.id = 'pg-image';
      newImage.alt = 'Project Gallery Image';
      newImage.style.cssText = 'max-width:100%; max-height:100%; object-fit:contain; box-shadow:0 0 30px rgba(0,0,0,0.5); opacity:0; transition:opacity 0.3s ease;';
      
      // Set up load handlers
      newImage.onload = function() {
        console.log('🖼️ Image loaded successfully:', this.src);
        this.style.opacity = '1';
        hideStatus();
      };
      
      newImage.onerror = function() {
        console.error('🖼️ Error loading image:', this.src);
        showStatus('Error loading image. Check console for details.', true);
      };
      
      // Set the source AFTER adding handlers
      newImage.src = img.src;
      
      // Replace existing image
      const container = viewer.querySelector('.pg-container');
      const oldImage = container.querySelector('img');
      if (oldImage) {
        container.replaceChild(newImage, oldImage);
      } else {
        container.appendChild(newImage);
      }
      
      // Update counter
      updateCounter();
    }
    
    // Update counter display
    function updateCounter() {
      if (counterEl) {
        counterEl.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      }
    }
    
    // Show status message
    function showStatus(message, isError = false) {
      if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.display = 'block';
        
        if (isError) {
          statusEl.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        } else {
          statusEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
      }
    }
    
    // Hide status message
    function hideStatus() {
      if (statusEl) {
        statusEl.style.display = 'none';
      }
    }
    
    // Add click handlers to all project gallery images
    function setupGalleryImageHandlers() {
      console.log('🖼️ Setting up gallery image handlers');
      
      // Find all gallery images
      const galleryImages = document.querySelectorAll(
        '.modal-main-image img, .modal-secondary-image img, .modal-additional-image img'
      );
      
      console.log('🖼️ Found', galleryImages.length, 'gallery images');
      
      // Add click handlers to each image
      galleryImages.forEach(img => {
        // Remove any existing handlers to prevent duplicates
        img.removeEventListener('click', imageClickHandler);
        
        // Add the click handler
        img.addEventListener('click', imageClickHandler);
        
        // Make sure the cursor indicates this is clickable
        img.style.cursor = 'pointer';
      });
      
      // Log image sources for debugging
      if (galleryImages.length) {
        console.log('🖼️ First few image sources:');
        for (let i = 0; i < Math.min(3, galleryImages.length); i++) {
          console.log(i, galleryImages[i].src);
        }
      }
    }
    
    // Image click handler
    function imageClickHandler(e) {
      // Prevent default behavior
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🖼️ Image clicked:', this.src);
      
      // Open gallery with this image
      openGallery(this);
    }
    
    // Set up observer for modal content changes
    function setupModalObserver() {
      // Create a MutationObserver to watch for DOM changes
      const observer = new MutationObserver((mutations) => {
        let shouldSetupHandlers = false;
        
        // Check if any of the mutations involve project modals
        mutations.forEach(mutation => {
          const target = mutation.target;
          
          // Check if this is a modal or contains modal elements
          if (target.classList && 
              (target.classList.contains('modal-content') || 
               target.classList.contains('modal-gallery') ||
               target.querySelector('.modal-gallery'))) {
            shouldSetupHandlers = true;
          }
        });
        
        // If relevant changes detected, set up image handlers
        if (shouldSetupHandlers) {
          console.log('🖼️ Modal content changed, setting up image handlers');
          setTimeout(setupGalleryImageHandlers, 200);
        }
      });
      
      // Start observing the document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
      
      // Schedule periodic re-checks to catch any missed changes
      setInterval(setupGalleryImageHandlers, 5000);
    }
  }
})(); 