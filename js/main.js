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

  // Highlight current page link
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .sidebar-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
});
