document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
  }

  // Click-to-open dropdowns (works for touch; desktop still has hover via CSS)
  document.querySelectorAll('.dropdown > a, .has-submenu > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var parent = link.parentElement;
      var hasChildren = parent.querySelector('.dropdown-menu, .submenu');
      if (!hasChildren) return;

      // On touch/small screens, toggle instead of navigating away immediately
      if (window.matchMedia('(max-width: 720px)').matches || link.getAttribute('href') === '#') {
        e.preventDefault();
        var isOpen = parent.classList.contains('open');

        // close sibling menus at the same level
        var siblings = parent.parentElement.children;
        Array.prototype.forEach.call(siblings, function (sib) {
          if (sib !== parent) sib.classList.remove('open');
        });

        parent.classList.toggle('open', !isOpen);
      }
    });
  });

  // Close menus when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.main-nav') && !e.target.closest('.nav-toggle')) {
      document.querySelectorAll('.dropdown.open, .has-submenu.open').forEach(function (el) {
        el.classList.remove('open');
      });
      if (mainNav) mainNav.classList.remove('open');
    }
  });

  // Photo gallery lightbox: click a thumbnail to view it large; arrows, Esc and swipe to navigate
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (galleryItems.length) {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous photo">&lsaquo;</button>' +
      '<img alt="">' +
      '<button class="lb-next" aria-label="Next photo">&rsaquo;</button>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector('img');
    var current = 0;

    function show(index) {
      current = (index + galleryItems.length) % galleryItems.length;
      var item = galleryItems[current];
      lbImg.src = item.getAttribute('href');
      lbImg.alt = item.querySelector('img').alt;
    }

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      galleryItems[current].focus();
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lb-close').focus();
      });
    });

    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    var touchStartX = null;
    lightbox.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      touchStartX = null;
    });
  }

  // Highlight current page link
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .sidebar-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
});
