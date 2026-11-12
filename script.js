/* ==========================================================
   AC SERVICE CO. — JavaScript
   --------------------------------------------------------
   Handles:
   1. Mobile menu toggle
   2. Sticky header shadow on scroll
   3. Scroll reveal animations
   4. Product modal (Buy Now → details)
   5. WhatsApp order button
   6. Contact form validation
   ========================================================== */

/* ⚠️ IMPORTANT — CHANGE THIS TO YOUR WHATSAPP NUMBER
   Format: country code + number, NO +, NO spaces, NO leading 0
   Example: India number +91 85909 61145 → '918590961145' */
const WHATSAPP_NUMBER = '918590961145';


document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================
     1. MOBILE MENU
     ======================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });
  }


  /* ========================================================
     2. STICKY HEADER SHADOW
     ======================================================== */
  const header = document.getElementById('site-header');

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }


  /* ========================================================
     3. SCROLL REVEAL ANIMATIONS
     ======================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }


  /* ========================================================
     4. PRODUCT MODAL — populate details from card data
     ======================================================== */
  const productModal = document.getElementById('productModal');
  const modalBuyBtn = document.getElementById('modalBuyBtn');
  let currentProduct = null;

  if (productModal) {
    productModal.addEventListener('show.bs.modal', (event) => {
      const btn = event.relatedTarget;
      if (!btn) return;

      // Store for WhatsApp button
      currentProduct = {
        title: btn.dataset.title,
        price: btn.dataset.price
      };

      // Fill modal fields
      productModal.querySelector('#modalTitle').textContent = btn.dataset.title;
      productModal.querySelector('#modalImg').src = btn.dataset.img;
      productModal.querySelector('#modalImg').alt = btn.dataset.title;
      productModal.querySelector('#modalPrice').textContent = btn.dataset.price;
      productModal.querySelector('#modalOld').textContent = btn.dataset.old || '';
      productModal.querySelector('#modalDesc').textContent = btn.dataset.desc;
      productModal.querySelector('#modalRating').innerHTML = `
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-half"></i>
        <span class="text-muted ms-1">${btn.dataset.rating} (${btn.dataset.reviews} reviews)</span>
      `;
    });
  }


  /* ========================================================
     5. WHATSAPP ORDER BUTTON (inside modal)
     ======================================================== */
  if (modalBuyBtn) {
    modalBuyBtn.addEventListener('click', () => {
      if (!currentProduct) return;

      const message =
        `Hello! I'd like to book:\n\n` +
        `🔧 Service: ${currentProduct.title}\n` +
        `💰 Price: ${currentProduct.price}\n\n` +
        `📍 My location: \n` +
        `📅 Preferred date: \n` +
        `📝 Notes: \n\n` +
        `Please confirm availability. Thank you!`;

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        '_blank'
      );
    });
  }


  /* ========================================================
     6. CONTACT FORM — validation + success message
     ======================================================== */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = form.querySelector('#name');
      const phoneEl = form.querySelector('#phone');
      const serviceEl = form.querySelector('#service');
      const messageEl = form.querySelector('#message');

      const name = nameEl.value.trim();
      const phone = phoneEl.value.trim();

      if (name.length < 2) {
        status.textContent = 'Please enter your full name.';
        status.className = 'error';
        nameEl.focus();
        return;
      }

      if (phone.replace(/\D/g, '').length < 10) {
        status.textContent = 'Please enter a valid 10-digit phone number.';
        status.className = 'error';
        phoneEl.focus();
        return;
      }

      // Build WhatsApp message from form data
      const service = serviceEl.value || 'Not selected';
      const userMessage = messageEl.value.trim() || '-';

      const waMessage =
        `Hello! I have an AC service enquiry:\n\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `🔧 Service needed: ${service}\n` +
        `📝 Message: ${userMessage}`;

      // Open WhatsApp with the enquiry
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`,
        '_blank'
      );

      // Show success message
      status.textContent = '✓ Opening WhatsApp to send your request...';
      status.className = 'success';
      form.reset();

      setTimeout(() => {
        status.textContent = '';
        status.className = '';
      }, 6000);
    });
  }

});