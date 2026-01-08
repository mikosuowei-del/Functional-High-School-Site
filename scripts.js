/* Enhanced interactions: mobile menu, mega-menu, hero handling, gallery rotation, testimonials */
document.addEventListener('DOMContentLoaded', ()=>{
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sidebar menu handler
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarNav = document.getElementById('sidebar-nav');
  const sidebarClose = document.querySelector('.sidebar-close');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function closeSidebar() {
    if (sidebarNav) {
      sidebarNav.classList.remove('open');
      sidebarNav.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  function openSidebar() {
    if (sidebarNav) {
      sidebarNav.classList.add('open');
      sidebarNav.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function toggleSidebar() {
    if (sidebarNav && sidebarNav.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  // Close sidebar when clicking on a link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (sidebarNav && sidebarNav.classList.contains('open')) {
      if (!e.target.closest('.sidebar-nav') && !e.target.closest('.menu-toggle')) {
        closeSidebar();
      }
    }
  });

  // Close sidebar with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarNav && sidebarNav.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Mobile menu (supports legacy and new button)
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const legacyBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  let _previouslyFocused = null;
  // focus trap helper
  function createFocusTrap(container){
    if(!container) return null;
    const FOCUSABLE = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
    let nodes = [];
    let onKeydown = (e)=>{
      if(e.key !== 'Tab') return;
      nodes = Array.from(container.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null);
      if(nodes.length === 0) { e.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length-1];
      if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
      else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
    };
    return {
      activate(){
        nodes = Array.from(container.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null);
        container.addEventListener('keydown', onKeydown);
        container.setAttribute('data-focus-trap','true');
      },
      deactivate(){
        container.removeEventListener('keydown', onKeydown);
        container.removeAttribute('data-focus-trap');
      }
    };
  }
  const mobileFocusTrap = mobileNav ? createFocusTrap(mobileNav) : null;

  function closeMobile(){
    [mobileBtn, legacyBtn].forEach(b=>b && b.setAttribute('aria-expanded','false'));
    // remove overlay if present
    const overlay = document.getElementById('nav-overlay');
    if(overlay){ overlay.classList.remove('visible'); overlay.parentNode && overlay.parentNode.removeChild(overlay); }
    if(mobileNav){ mobileNav.classList.remove('open'); mobileNav.style.display='none'; mobileNav.setAttribute('aria-hidden','true'); }
    document.body.classList.remove('mobile-open');
    // deactivate focus trap and restore prior focus
    if(mobileFocusTrap) mobileFocusTrap.deactivate();
    if(_previouslyFocused && _previouslyFocused.focus) _previouslyFocused.focus();
  }

  function openMobile(btn){
    btn && btn.setAttribute('aria-expanded','true');
    // create overlay
    let overlay = document.getElementById('nav-overlay');
    if(!overlay){ overlay = document.createElement('div'); overlay.id = 'nav-overlay'; overlay.tabIndex = -1; overlay.setAttribute('aria-hidden','false'); document.body.appendChild(overlay); }
    overlay.classList.add('visible');
    overlay.addEventListener('click', closeMobile);

    if(mobileNav){ mobileNav.classList.add('open'); mobileNav.style.display='flex'; mobileNav.setAttribute('aria-hidden','false'); }
    document.body.classList.add('mobile-open');
    // store previous focus and focus first interactive element
    if(mobileNav){
      _previouslyFocused = document.activeElement;
      const first = mobileNav.querySelector('#mobile-close, a, button, input');
      if(mobileFocusTrap) mobileFocusTrap.activate();
      (first || mobileNav).focus();
    }
  }

  function toggleMobile(e){
    const btn = e.currentTarget;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if(expanded) closeMobile(); else openMobile(btn);
  }

  if(mobileBtn) mobileBtn.addEventListener('click', toggleMobile);
  if(legacyBtn) legacyBtn.addEventListener('click', toggleMobile);

  // Close mobile on Escape or click outside; use header selector present in pages
  document.addEventListener('keydown', (ev)=>{ if(ev.key === 'Escape') closeMobile(); });
  document.addEventListener('click', (ev)=>{ if(!ev.target.closest('header') && !ev.target.closest('#mobile-nav') && !ev.target.closest('#menu-toggle')) closeMobile(); });

  // Basic focus trap for mobile nav while open
  document.addEventListener('focusin', (ev)=>{
    if(!mobileNav) return;
    if(document.body.classList.contains('mobile-open') && !mobileNav.contains(ev.target) && ev.target !== legacyBtn){
      // move focus back into mobile nav
      const first = mobileNav.querySelector('a'); first && first.focus();
    }
  });

  // Mega-menu: hover + focus with accessible keyboard support
  document.querySelectorAll('.has-mega').forEach(item => {
    const menu = item.querySelector('.mega-menu');
    const link = item.querySelector('a');
    if(!menu || !link) return;

    function open(){ menu.setAttribute('aria-hidden','false'); item.classList.add('mega-open'); link.setAttribute('aria-expanded','true'); }
    function close(){ menu.setAttribute('aria-hidden','true'); item.classList.remove('mega-open'); link.setAttribute('aria-expanded','false'); }

    let closeTimer;
    item.addEventListener('mouseenter', ()=>{ clearTimeout(closeTimer); open(); });
    item.addEventListener('mouseleave', ()=>{ closeTimer = setTimeout(close, 150); });
    link.addEventListener('focus', open);
    link.addEventListener('blur', ()=>{ closeTimer = setTimeout(close, 150); });

    // ArrowDown opens menu and focuses first item
    link.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowDown'){
        e.preventDefault(); open(); const first = menu.querySelector('a'); first && first.focus();
      }
    });
  });

  // Hero cinematic: play video if present, respect reduced motion, subtle parallax on pointer move
  const hero = document.querySelector('.hero--cinematic');
  if(hero){
    const video = hero.querySelector('video');
    if(video){
      if(prefersReduced){ video.pause(); video.style.display = 'none'; hero.classList.add('hero--static'); }
      else{ video.play().catch(()=>{}); }

      // subtle pointer parallax effect
      hero.addEventListener('pointermove', (ev)=>{
        const r = hero.getBoundingClientRect();
        const x = (ev.clientX - r.left)/r.width - 0.5;
        const y = (ev.clientY - r.top)/r.height - 0.5;
        hero.style.transform = `translate3d(${x*6}px, ${y*4}px, 0)`;
      });
      hero.addEventListener('pointerleave', ()=>{ hero.style.transform = ''; });
    } else {
      // fallback parallax on scroll for image backgrounds
      window.addEventListener('scroll', ()=>{
        const r = hero.getBoundingClientRect();
        const offset = Math.max(0, -r.top/6);
        hero.style.backgroundPosition = `center ${50+offset}%`;
      });
    }
  }

  // Rotating gallery: fade between images if multiple
  const gallery = document.querySelector('.rotating-gallery');
  if(gallery){
    const imgs = Array.from(gallery.querySelectorAll('img'));
    if(imgs.length > 1){
      imgs.forEach((img,i)=>{ img.style.transition = 'opacity 700ms ease'; img.style.opacity = i===0? '1':'0'; img.setAttribute('aria-hidden', i===0? 'false':'true'); });
      let gi = 0, gTimer = null;
      const nextImg = ()=>{ imgs[gi].style.opacity='0'; imgs[gi].setAttribute('aria-hidden','true'); gi = (gi+1) % imgs.length; imgs[gi].style.opacity='1'; imgs[gi].setAttribute('aria-hidden','false'); };
      const startGallery = ()=> gTimer = setInterval(nextImg, 5000);
      const stopGallery = ()=> { if(gTimer){ clearInterval(gTimer); gTimer=null; } };
      gallery.addEventListener('mouseenter', stopGallery); gallery.addEventListener('mouseleave', startGallery);
      gallery.addEventListener('focusin', stopGallery); gallery.addEventListener('focusout', startGallery);
      startGallery();
    }
  }

  // Testimonials rotate
  const testimonials = Array.from(document.querySelectorAll('.testimonial-grid .testimonial'));
  if(testimonials.length > 1){
    testimonials.forEach((t,i)=>{ t.style.transition='opacity 600ms ease'; t.style.opacity = i===0? '1':'0'; t.setAttribute('aria-hidden', i===0? 'false':'true'); });
    let ti = 0;
    setInterval(()=>{ testimonials[ti].style.opacity='0'; testimonials[ti].setAttribute('aria-hidden','true'); ti = (ti+1) % testimonials.length; testimonials[ti].style.opacity='1'; testimonials[ti].setAttribute('aria-hidden','false'); }, 6000);
  }

  /* Governance accordions: accessible toggles */
  const accordions = document.querySelectorAll('.accordion-group .accordion-item');
  if(accordions.length){
    accordions.forEach(item=>{
      const btn = item.querySelector('.accordion-toggle');
      const panel = item.querySelector('.accordion-panel');
      if(!btn || !panel) return;
      // ensure ARIA states
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');

      btn.addEventListener('click', ()=>{
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if(expanded){
          btn.setAttribute('aria-expanded','false');
          panel.setAttribute('aria-hidden','true');
          panel.style.display = 'none';
        } else {
          btn.setAttribute('aria-expanded','true');
          panel.setAttribute('aria-hidden','false');
          panel.style.display = 'block';
        }
      });
      // keyboard: Enter / Space
      btn.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    });
  }

  // Org-chart reveal: toggles a larger view or link to profiles
  const orgChart = document.getElementById('orgChart');
  if(orgChart){
    orgChart.addEventListener('click', ()=>{
      // try to open the org-chart in a new tab if image available, otherwise toggle a class
      const img = orgChart.querySelector('img');
      if(img && img.src){
        window.open(img.src, '_blank');
        return;
      }
      orgChart.classList.toggle('expanded');
    });
  }

});

function openMenu() {
  document.querySelector('.sidebar').classList.add('active');
  document.querySelector('.overlay').classList.add('active');
}

function closeMenu() {
  document.querySelector('.sidebar').classList.remove('active');
  document.querySelector('.overlay').classList.remove('active');
}

