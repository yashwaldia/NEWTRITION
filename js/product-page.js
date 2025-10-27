// ==================================================
// PRODUCT PAGE - COMPLETE JAVASCRIPT (FIXED)
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================================================
  // 1. NAVBAR SCROLL EFFECT
  // ==================================================
  const navbar = document.getElementById('navbar');
  
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  
  // ==================================================
  // 2. THUMBNAIL GALLERY - IMAGE SWITCHER (FIXED)
  // ==================================================
  const mainProductImg = document.getElementById('mainProductImg');
  const thumbnailItems = document.querySelectorAll('.thumbnail-item');
  
  if (mainProductImg && thumbnailItems.length > 0) {
    thumbnailItems.forEach(function(thumbnail) {
      thumbnail.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnailItems.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Get image source from data attribute or img src
        const newImgSrc = this.getAttribute('data-img') || this.querySelector('img').src;
        const flavor = this.getAttribute('data-flavor') || 'Product Image';
        
        // Update main image with fade effect
        mainProductImg.style.opacity = '0.5';
        
        setTimeout(() => {
          mainProductImg.src = newImgSrc;
          mainProductImg.alt = flavor;
          mainProductImg.style.opacity = '1';
        }, 150);
      });
    });
  }

  
  // ==================================================
  // 3. QUANTITY SELECTOR (+ / - BUTTONS)
  // ==================================================
  const qtyInput = document.querySelector('.qty-input');
  const minusBtn = document.querySelector('.qty-btn.minus');
  const plusBtn = document.querySelector('.qty-btn.plus');
  
  if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', function() {
      let currentVal = parseInt(qtyInput.value) || 1;
      let minVal = parseInt(qtyInput.getAttribute('min')) || 1;
      
      if (currentVal > minVal) {
        qtyInput.value = currentVal - 1;
      }
    });
    
    plusBtn.addEventListener('click', function() {
      let currentVal = parseInt(qtyInput.value) || 1;
      let maxVal = parseInt(qtyInput.getAttribute('max')) || 99;
      
      if (currentVal < maxVal) {
        qtyInput.value = currentVal + 1;
      }
    });
    
    // Validate input
    qtyInput.addEventListener('change', function() {
      let currentVal = parseInt(this.value) || 1;
      let minVal = parseInt(this.getAttribute('min')) || 1;
      let maxVal = parseInt(this.getAttribute('max')) || 99;
      
      if (currentVal < minVal) {
        this.value = minVal;
      } else if (currentVal > maxVal) {
        this.value = maxVal;
      }
    });
  }

  
  // ==================================================
  // 4. SIZE/QUANTITY SELECTOR - PRICE UPDATE & COMBO BUILDER
  // ==================================================
  const sizeRadios = document.querySelectorAll('input[name="quantity"]');
  const productPriceDisplay = document.querySelector('.product-price');
  const priceUnitDisplay = document.querySelector('.price-unit');
  
  sizeRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const newPrice = this.getAttribute('data-price');
        const quantity = parseInt(this.value);
        
        // Update price display
        if (productPriceDisplay && newPrice) {
          productPriceDisplay.textContent = '$' + newPrice;
        }
        
        // Update price unit
        if (priceUnitDisplay) {
          priceUnitDisplay.textContent = ' / ' + quantity + 'ct';
        }
        
        // Show/Hide Combo Builder for 24ct+
        const comboBuilderGroup = document.getElementById('comboBuilderGroup');
        const flavorSelectorGroup = document.getElementById('flavorSelectorGroup');
        
        if (quantity >= 24 && comboBuilderGroup && flavorSelectorGroup) {
          comboBuilderGroup.classList.remove('hidden');
          flavorSelectorGroup.classList.add('hidden');
        } else if (comboBuilderGroup && flavorSelectorGroup) {
          comboBuilderGroup.classList.add('hidden');
          flavorSelectorGroup.classList.remove('hidden');
        }
      }
    });
  });

  
  // ==================================================
  // 5. ACCORDION FUNCTIONALITY
  // ==================================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(function(header) {
    header.addEventListener('click', function() {
      // Get the accordion item
      const accordionItem = this.closest('.accordion-item');
      const accordionContent = accordionItem.querySelector('.accordion-content');
      
      // Check if this accordion is already active
      const isActive = this.classList.contains('active');
      
      // OPTIONAL: Close all other accordions (uncomment for accordion behavior)
      /*
      accordionHeaders.forEach(function(otherHeader) {
        if (otherHeader !== header) {
          otherHeader.classList.remove('active');
          const otherContent = otherHeader.closest('.accordion-item').querySelector('.accordion-content');
          if (otherContent) {
            otherContent.classList.remove('active');
          }
        }
      });
      */
      
      // Toggle current accordion
      if (isActive) {
        this.classList.remove('active');
        accordionContent.classList.remove('active');
      } else {
        this.classList.add('active');
        accordionContent.classList.add('active');
      }
    });
  });

  
  // ==================================================
  // 6. ADD TO CART FUNCTIONALITY
  // ==================================================
  const addToCartBtn = document.querySelector('.btn-add-to-cart-primary');
  const cartBadge = document.querySelector('.cart-badge');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      // Get selected values
      const selectedSize = document.querySelector('input[name="quantity"]:checked');
      const selectedFlavor = document.querySelector('.flavor-dropdown-select');
      const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      
      // Validation
      if (!selectedSize) {
        alert('Please select a pack size (6ct, 12ct, 24ct, or 48ct)');
        return;
      }
      
      const packSize = parseInt(selectedSize.value);
      
      // Validate flavor selection for smaller packs
      if (packSize < 24 && selectedFlavor && selectedFlavor.value === '') {
        alert('Please select a flavor');
        return;
      }
      
      // Validate combo builder for 24ct+
      if (packSize >= 24) {
        const comboSelects = document.querySelectorAll('.combo-flavor-select');
        let filledCount = 0;
        comboSelects.forEach(select => {
          if (select.value !== '') filledCount++;
        });
        
        if (filledCount === 0) {
          alert('Please select at least one flavor for your combo');
          return;
        }
      }
      
      // Add to cart logic (integrate with backend/cart system)
      console.log('Added to cart:', {
        packSize: packSize,
        flavor: selectedFlavor ? selectedFlavor.value : 'Combo',
        quantity: quantity,
        price: selectedSize.getAttribute('data-price')
      });
      
      // Update cart badge
      if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + quantity;
      }
      
      // Success feedback
      const originalText = this.textContent;
      const originalBg = this.style.background;
      
      this.textContent = 'ADDED TO CART ✓';
      this.style.background = '#10b981';
      
      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = originalBg;
      }, 2000);
    });
  }

  
  // ==================================================
  // 7. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  
  // ==================================================
  // 8. INITIALIZE - OPEN FIRST ACCORDION BY DEFAULT
  // ==================================================
  const firstAccordionHeader = document.querySelector('.accordion-header');
  const firstAccordionContent = document.querySelector('.accordion-content');
  
  if (firstAccordionHeader && firstAccordionContent) {
    firstAccordionHeader.classList.add('active');
    firstAccordionContent.classList.add('active');
  }

  
  // ==================================================
  // 9. INITIALIZE DEFAULT PRICE DISPLAY
  // ==================================================
  const checkedRadio = document.querySelector('input[name="quantity"]:checked');
  if (checkedRadio && productPriceDisplay && priceUnitDisplay) {
    const defaultPrice = checkedRadio.getAttribute('data-price');
    const defaultQty = checkedRadio.value;
    
    productPriceDisplay.textContent = '$' + defaultPrice;
    priceUnitDisplay.textContent = ' / ' + defaultQty + 'ct';
  }

});


// ==================================================
// 10. CONSOLE LOG CONFIRMATION
// ==================================================
console.log('✅ Product Page JavaScript Loaded Successfully');
