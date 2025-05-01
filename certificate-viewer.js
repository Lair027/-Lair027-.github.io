/**
 * Simple Certificate Viewer Script
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('💥 NEW Certificate Viewer Script Loaded');
    initCertificateViewer();
});

function initCertificateViewer() {
    console.log('💥 Initializing NEW Certificate Viewer');
    
    // Find all certificate items
    const certificates = document.querySelectorAll('.certificate-item');
    if (!certificates.length) {
        console.log('💥 No certificate items found, will check again later');
        setTimeout(initCertificateViewer, 1000);
        return;
    }
    
    console.log('💥 Found', certificates.length, 'certificate items');
    
    // Check if fullscreen viewer exists, create it if not
    let viewer = document.getElementById('certificate-fullscreen-viewer');
    
    if (!viewer) {
        console.log('💥 Creating new fullscreen viewer');
        viewer = document.createElement('div');
        viewer.id = 'certificate-fullscreen-viewer';
        viewer.className = 'certificate-fullscreen-viewer';
        viewer.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.95); z-index:9999999; display:none; align-items:center; justify-content:center; opacity:1; visibility:visible;';
        
        // Add debugging border for troubleshooting
        console.log('💥 Creating viewer with ID:', viewer.id);
        
        viewer.innerHTML = `
            <div class="fullscreen-close" style="position:absolute; top:20px; right:20px; width:40px; height:40px; background-color:#a67c52; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:100001;">
                <i class="fas fa-times" style="color:white; font-size:18px;"></i>
            </div>
            <div class="fullscreen-nav prev" style="position:absolute; left:20px; top:50%; transform:translateY(-50%); width:50px; height:50px; background-color:#a67c52; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:100001;">
                <i class="fas fa-chevron-left" style="color:white; font-size:20px;"></i>
            </div>
            <div class="fullscreen-image" style="display:flex; align-items:center; justify-content:center; width:90%; max-width:1000px; height:auto; position:relative; z-index:100000;">
                <img src="" alt="Fullscreen Certificate" id="fullscreen-certificate-img" style="display:block; max-width:100%; max-height:80vh; object-fit:contain; border:3px solid white; background-color:rgba(255,255,255,0.1);">
            </div>
            <div class="fullscreen-nav next" style="position:absolute; right:20px; top:50%; transform:translateY(-50%); width:50px; height:50px; background-color:#a67c52; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:100001;">
                <i class="fas fa-chevron-right" style="color:white; font-size:20px;"></i>
            </div>
            <div class="fullscreen-counter" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); background-color:rgba(0,0,0,0.7); color:white; padding:5px 15px; border-radius:20px; z-index:100001;">
                <span id="current-certificate">1</span> / <span id="total-certificates">${certificates.length}</span>
            </div>
            <div class="reload-button" style="position:absolute; bottom:20px; right:20px; width:40px; height:40px; background-color:#a67c52; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:100001;" title="Reload Image">
                <i class="fas fa-sync-alt" style="color:white; font-size:18px;"></i>
            </div>
            <div class="image-status" style="position:absolute; top:20px; left:20px; background-color:rgba(0,0,0,0.7); color:white; padding:5px 10px; border-radius:5px; z-index:100001; font-size:12px;">
                Loading...
            </div>
        `;
        
        document.body.appendChild(viewer);
        console.log('💥 Viewer added to DOM, checking if it exists:', document.getElementById(viewer.id) !== null);
    }
    
    // Get all certificate images
    const certificateImages = [];
    let currentIndex = 0;
    
    certificates.forEach((cert, index) => {
        // Get the image source
        const img = cert.querySelector('img');
        if (img) {
            certificateImages.push(img.src);
            console.log(`💥 Certificate ${index + 1} image:`, img.src);
        }
        
        // Add click event
        cert.style.cursor = 'pointer';
        cert.addEventListener('click', function() {
            openCertificate(index);
        });
    });
    
    // Get viewer elements
    const viewerImg = document.getElementById('fullscreen-certificate-img');
    const closeBtn = viewer.querySelector('.fullscreen-close');
    const prevBtn = viewer.querySelector('.fullscreen-nav.prev');
    const nextBtn = viewer.querySelector('.fullscreen-nav.next');
    const currentEl = document.getElementById('current-certificate');
    
    // Function to open certificate
    function openCertificate(index) {
        console.log('💥 Opening certificate', index + 1);
        currentIndex = index;
        
        // Set image source
        const imgSrc = certificateImages[index];
        
        // Update status
        const imageStatus = viewer.querySelector('.image-status');
        if (imageStatus) {
            imageStatus.textContent = 'Loading...';
            imageStatus.style.backgroundColor = 'rgba(0,0,0,0.7)';
        }
        
        // Create a new image element to force reloading
        const imgContainer = viewer.querySelector('.fullscreen-image');
        if (imgContainer) {
            // Remove existing image
            const oldImg = document.getElementById('fullscreen-certificate-img');
            if (oldImg) {
                oldImg.remove();
            }
            
            // Create new image
            const newImg = document.createElement('img');
            newImg.id = 'fullscreen-certificate-img';
            newImg.alt = 'Fullscreen Certificate';
            newImg.style.cssText = 'display:block; max-width:100%; max-height:80vh; object-fit:contain; border:3px solid white; background-color:rgba(255,255,255,0.1); margin:0 auto; box-shadow:0 0 30px rgba(0,0,0,0.5); transform:translateZ(0);';
            
            // Add load handlers
            newImg.onload = function() {
                console.log('💥 IMAGE LOADED SUCCESSFULLY:', imgSrc);
                console.log('💥 Loaded size:', this.naturalWidth, 'x', this.naturalHeight);
                
                if (imageStatus) {
                    imageStatus.textContent = 'Loaded: ' + this.naturalWidth + 'x' + this.naturalHeight;
                    imageStatus.style.backgroundColor = 'rgba(0,128,0,0.7)';
                }
            };
            
            newImg.onerror = function() {
                console.error('💥 IMAGE FAILED TO LOAD:', imgSrc);
                
                if (imageStatus) {
                    imageStatus.textContent = 'Failed to load image!';
                    imageStatus.style.backgroundColor = 'rgba(255,0,0,0.7)';
                }
                
                // Add placeholder text
                this.style.height = '200px';
                this.style.width = '300px';
                this.style.display = 'flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';
                this.style.backgroundColor = 'rgba(255,0,0,0.2)';
                this.style.fontSize = '16px';
                this.style.color = 'white';
                
                // Create error text element
                const errorText = document.createElement('div');
                errorText.textContent = 'Image failed to load!\nPath: ' + imgSrc;
                errorText.style.cssText = 'text-align:center; padding:20px;';
                imgContainer.appendChild(errorText);
            };
            
            // Set source and append
            newImg.src = imgSrc;
            imgContainer.appendChild(newImg);
            
            viewerImg = newImg; // Update reference
        } else {
            console.error('💥 Image container not found');
        }
        
        // Set counter
        if (currentEl) {
            currentEl.textContent = index + 1;
        }
        
        // Show viewer with direct styles
        viewer.style.display = 'flex';
        viewer.style.opacity = '1';
        viewer.style.visibility = 'visible';
        viewer.style.alignItems = 'center';
        viewer.style.justifyContent = 'center';
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close certificate
    function closeCertificate() {
        console.log('💥 Closing certificate viewer');
        viewer.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Function to show previous certificate
    function showPrevCertificate() {
        currentIndex = currentIndex <= 0 ? certificateImages.length - 1 : currentIndex - 1;
        openCertificate(currentIndex);
    }
    
    // Function to show next certificate
    function showNextCertificate() {
        currentIndex = currentIndex >= certificateImages.length - 1 ? 0 : currentIndex + 1;
        openCertificate(currentIndex);
    }
    
    // Add click events
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCertificate);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevCertificate);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextCertificate);
    }
    
    // Close when clicking outside
    viewer.addEventListener('click', function(e) {
        if (e.target === viewer) {
            closeCertificate();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (viewer.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeCertificate();
            } else if (e.key === 'ArrowLeft') {
                showPrevCertificate();
            } else if (e.key === 'ArrowRight') {
                showNextCertificate();
            }
        }
    });
    
    // Check loading ability
    const testImg = new Image();
    testImg.onload = function() {
        console.log('💥 Test image loaded successfully');
    };
    testImg.onerror = function() {
        console.error('💥 Test image failed to load');
    };
    testImg.src = certificateImages[0] || 'certificates/certificate1.jpg';
    
    // Add reload button handler
    const reloadBtn = viewer.querySelector('.reload-button');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', function() {
            console.log('💥 Reload button clicked, reloading current image');
            openCertificate(currentIndex);
        });
    }
    
    console.log('💥 Certificate viewer initialization complete');
}

// Add test function at the end of the file
function testCertificateImage() {
    console.log('🔥 TESTING CERTIFICATE IMAGE DISPLAY');
    
    // Make this configurable
    const enableTestContainer = false; // Set to false to disable the test container
    
    if (!enableTestContainer) {
        console.log('🔥 Test container disabled');
        return;
    }
    
    // Create test container
    const testContainer = document.createElement('div');
    testContainer.style.cssText = 'position:fixed; top:20px; left:20px; background-color:white; padding:10px; z-index:999999; border:2px solid red; width:200px; font-size:12px;';
    
    // Create test image
    const testImg = document.createElement('img');
    testImg.src = 'certificates/certificate1.jpg';
    testImg.alt = 'Test Certificate';
    testImg.style.cssText = 'width:100%; height:auto; display:block;';
    
    // Add success/error handlers
    testImg.onload = function() {
        console.log('🔥 TEST IMAGE LOADED SUCCESSFULLY', this.src);
        console.log('🔥 Natural size:', this.naturalWidth, 'x', this.naturalHeight);
        testContainer.style.borderColor = 'green';
    };
    
    testImg.onerror = function() {
        console.error('🔥 TEST IMAGE FAILED TO LOAD', this.src);
        testContainer.style.borderColor = 'red';
        this.style.backgroundColor = 'red';
        this.style.color = 'white';
        this.style.padding = '10px';
        this.style.textAlign = 'center';
        this.alt = 'Image Failed to Load';
    };
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close Test';
    closeBtn.style.cssText = 'width:100%; margin-top:10px; padding:5px;';
    closeBtn.onclick = function() {
        testContainer.remove();
    };
    
    // Add test path info
    const pathInfo = document.createElement('div');
    pathInfo.textContent = 'Image path: ' + testImg.src;
    pathInfo.style.cssText = 'font-size:10px; margin-top:5px; word-break:break-all;';
    
    // Assemble and add to DOM
    testContainer.appendChild(testImg);
    testContainer.appendChild(pathInfo);
    testContainer.appendChild(closeBtn);
    document.body.appendChild(testContainer);
    
    console.log('🔥 TEST CONTAINER ADDED TO DOM');
    
    return false; // Prevent default if called from a link
}

// Auto-run test after a delay to ensure DOM is ready
setTimeout(testCertificateImage, 3000); 