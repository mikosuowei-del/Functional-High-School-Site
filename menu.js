document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenu = document.getElementById('close-menu');
  const body = document.body;

  function openMenu() {
    body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenuFunc() {
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // Toggle menu on button click
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (body.classList.contains('menu-open')) {
        closeMenuFunc();
      } else {
        openMenu();
      }
    });
  }

  // Close menu on close button click
  if (closeMenu) {
    closeMenu.addEventListener('click', closeMenuFunc);
  }

  // Close menu when clicking on a link
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenuFunc);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar-menu');
    const menuBtn = document.getElementById('menu-toggle');
    
    if (body.classList.contains('menu-open')) {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenuFunc();
      }
    }
  });

  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenuFunc();
    }
  });
});
