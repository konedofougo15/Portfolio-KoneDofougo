/* ==========================================================================
   Koné Defouge Portfolio Application Engine (js/app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // App State
  const state = {
    currentRoute: 'home', // 'home' | 'projects' | 'project-detail'
    activeCategory: 'all',
    currentProjectId: null
  };

  // DOM Elements
  const header = document.getElementById('site-header');
  const logoBtn = document.getElementById('logo-btn');
  const mobileToggle = document.getElementById('mobile-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const backToTopBtn = document.getElementById('back-to-top');

  const viewHome = document.getElementById('view-home');
  const viewProjects = document.getElementById('view-projects');
  const viewProjectDetail = document.getElementById('view-project-detail');
  const viewFigmaApp = document.getElementById('view-figma-app');
  const projectDetailContent = document.getElementById('project-detail-content');

  // Categories list
  const CATEGORIES = [
    { name: "Tous", slug: "all" },
    { name: "Mobile App", slug: "mobile-app" },
    { name: "Dashboard", slug: "dashboard" },
    { name: "Site Freelances", slug: "platform" },
    { name: "Website", slug: "website" },
    { name: "Gestion Locative", slug: "landing-page" },
    { name: "Mairie d'Adjamé", slug: "municipality-website" }
  ];

  /* ------------------------------------------------------------------------
     1. ROUTING & VIEW CONTROLLER
     ------------------------------------------------------------------------ */
  function navigateTo(route, params = {}) {
    state.currentRoute = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active state of nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.route === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Hide all views first
    if (viewHome) viewHome.style.display = 'none';
    if (viewProjects) viewProjects.style.display = 'none';
    if (viewProjectDetail) viewProjectDetail.style.display = 'none';
    if (viewFigmaApp) viewFigmaApp.style.display = 'none';

    if (route === 'home') {
      if (viewHome) viewHome.style.display = 'block';
    } else if (route === 'projects') {
      if (viewProjects) viewProjects.style.display = 'block';
      renderProjectsPage();
    } else if (route === 'figma-app') {
      if (viewFigmaApp) viewFigmaApp.style.display = 'block';
      initFigmaDashboardApp();
    } else if (route === 'project-detail' && params.id) {
      state.currentProjectId = params.id;
      if (viewProjectDetail) viewProjectDetail.style.display = 'block';
      renderProjectDetail(params.id);
    }

    // Refresh icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Handle Hash change for deep linking
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === 'home') {
      navigateTo('home');
    } else if (hash === 'projects') {
      navigateTo('projects');
    } else if (hash === 'figma-app') {
      navigateTo('figma-app');
    } else if (hash.startsWith('project/')) {
      const projectId = hash.replace('project/', '');
      navigateTo('project-detail', { id: projectId });
    } else if (['process', 'about', 'contact'].includes(hash)) {
      if (state.currentRoute !== 'home') {
        navigateTo('home');
      }
      setTimeout(() => {
        const el = document.getElementById(`${hash}-section`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  window.addEventListener('hashchange', handleHashChange);

  /* ------------------------------------------------------------------------
     2. RENDER HOMEPAGE SECTIONS
     ------------------------------------------------------------------------ */
  function renderHomepage() {
    // Process Steps
    const processContainer = document.getElementById('process-steps-container');
    if (processContainer) {
      processContainer.innerHTML = PROCESS_STEPS.map(step => `
        <div class="process-card">
          <div class="process-number">${step.number}</div>
          <h3 class="process-title">${step.title}</h3>
          <p class="process-desc">${step.desc}</p>
        </div>
      `).join('');
    }

    // Filter Tabs for Home
    renderFilterTabs('home-filter-tabs', (slug) => {
      state.activeCategory = slug;
      renderProjectsGrid('home-projects-grid', 6);
    });

    // Initial Projects Grid on Home
    renderProjectsGrid('home-projects-grid', 6);

    // Testimonials
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
      testimonialsContainer.innerHTML = TESTIMONIALS_DATA.map(t => `
        <div class="testimonial-card">
          <p class="testimonial-quote">"${t.quote}"</p>
          <div class="testimonial-author">
            <img src="${t.avatar}" alt="${t.author}" class="author-avatar">
            <div class="author-info">
              <h4>${t.author}</h4>
              <p>${t.role}</p>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Contact Form Component
    renderContactForm('contact-form-container');
  }

  /* ------------------------------------------------------------------------
     3. RENDER PROJECTS LISTING PAGE
     ------------------------------------------------------------------------ */
  function renderProjectsPage() {
    renderFilterTabs('projects-page-filter-tabs', (slug) => {
      state.activeCategory = slug;
      renderProjectsGrid('all-projects-grid', 99);
    });

    renderProjectsGrid('all-projects-grid', 99);
    renderContactForm('projects-contact-container');
  }

  /* ------------------------------------------------------------------------
     4. RENDER FILTER TABS & PROJECT CARDS GRID
     ------------------------------------------------------------------------ */
  function renderFilterTabs(containerId, onSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
      <button class="filter-tab ${state.activeCategory === cat.slug ? 'active' : ''}" data-slug="${cat.slug}">
        ${cat.name}
      </button>
    `).join('');

    container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        onSelect(tab.dataset.slug);
      });
    });
  }

  function renderProjectsGrid(gridId, limit = 99) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    let filtered = PROJECTS_DATA;
    if (state.activeCategory !== 'all') {
      filtered = PROJECTS_DATA.filter(p => p.categorySlug === state.activeCategory);
    }

    filtered = filtered.slice(0, limit);

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">Aucun projet trouvé dans cette catégorie.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(project => `
      <div class="project-card animate-fade-in" data-project-id="${project.id}">
        <div class="project-card-image">
          ${renderProjectCardMockupSVG(project)}
        </div>
        <div class="project-card-body">
          <div class="project-category">${project.category}</div>
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-card-desc">${project.description}</p>
          <div class="project-card-footer">
            <span>Découvrir l'étude de cas</span>
            <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click listeners to open project details
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const pid = card.dataset.projectId;
        window.location.hash = `project/${pid}`;
      });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ------------------------------------------------------------------------
     5. RENDER PROJECT CARD SVG MOCKUPS
     ------------------------------------------------------------------------ */
  function renderProjectCardMockupSVG(project) {
    if (project.id === 'municipality-website') {
      return `
        <img src="assets/adjame_hero.png" alt="Site Officiel Mairie d'Adjamé" style="width: 100%; height: 100%; object-fit: cover;">
      `;
    } else if (project.id === 'dashboard') {
      return `
        <img src="assets/sima_hero.jpg" alt="Conception UX/UI du site du SIMA" style="width: 100%; height: 100%; object-fit: cover;">
      `;
    } else if (project.id === 'mobile-app') {
      return `
        <img src="assets/mobile_station.png" alt="Application mobile pour station-service" style="width: 100%; height: 100%; object-fit: cover;">
      `;
    } else if (project.id === 'platform') {
      return `
        <img src="assets/akilyum_hero.png" alt="Site Web pour Freelances — Akilyum" style="width: 100%; height: 100%; object-fit: cover;">
      `;
    } else if (project.id === 'website') {
      return `
        <div style="width:100%; height:100%; background: #FBF9F5; display:flex; flex-direction:column; padding:1.25rem; justify-content:center; align-items:center;">
          <div style="border:1px solid #EBE4DC; background:#FFFFFF; border-radius:12px; padding:1rem; width:90%; box-shadow:0 8px 20px rgba(30,22,16,0.06);">
            <div style="font-size:0.7rem; font-weight:700; color:#8C5E3C; margin-bottom:0.25rem;">AURA STRATEGY GROUP</div>
            <h4 style="font-size:1rem; color:#1D1815; margin-bottom:0.5rem;">Conseil International & Strategy</h4>
            <div style="display:inline-block; padding:0.25rem 0.75rem; background:#1E1610; color:#FFF; border-radius:20px; font-size:0.65rem;">Explore Showcase</div>
          </div>
        </div>
      `;
    } else {
      // Gestion Locative / Landing Page
      return `
        <img src="assets/gestion_locative.png" alt="Plateforme de gestion locative digitale" style="width: 100%; height: 100%; object-fit: cover;">
      `;
    }
  }

  /* ------------------------------------------------------------------------
     6. RENDER PROJECT DETAIL VIEW (Case Study Template)
     ------------------------------------------------------------------------ */
  function renderProjectDetail(projectId) {
    const project = PROJECTS_DATA.find(p => p.id === projectId) || PROJECTS_DATA[0];
    const currentIndex = PROJECTS_DATA.findIndex(p => p.id === project.id);
    const prevProject = PROJECTS_DATA[(currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length];
    const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];

    projectDetailContent.innerHTML = `
      <!-- Detail Hero Banner -->
      <section class="section detail-hero">
        <div class="container">
          <a href="#projects" class="btn btn-secondary" style="margin-bottom: 1.5rem;" data-route="projects">
            <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i>
            <span>Retour aux projets</span>
          </a>

          <div class="project-category">${project.category}</div>
          <h1 style="margin-bottom: 1rem;">${project.title}</h1>
          <p style="font-size: 1.25rem; max-width: 750px; color: var(--text-secondary);">${project.subtitle}</p>
          ${project.websiteUrl ? `
            <div style="margin-top: 1rem; margin-bottom: 1.5rem;">
              <a href="${project.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                <span>Visiter le site simaonline.net</span>
                <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
              </a>
            </div>
          ` : ''}

          <div class="detail-banner-container" style="background: ${project.heroBgGradient};">
            <div style="padding: 3rem; text-align: center; color: white;">
              ${renderProjectDetailMainMockup(project)}
            </div>
          </div>

          <!-- Project Overview Grid -->
          <div class="overview-grid">
            <div class="overview-item">
              <h4>Client</h4>
              <p>${project.client}</p>
            </div>
            <div class="overview-item">
              <h4>Rôle</h4>
              <p>${project.role}</p>
            </div>
            <div class="overview-item">
              <h4>Année & Durée</h4>
              <p>${project.year} (${project.duration})</p>
            </div>
            <div class="overview-item">
              <h4>Outils Utilisés</h4>
              <p>${project.tools.join(', ')}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Problem & Solution Section -->
      <section class="section" style="padding-top: 0;">
        <div class="container">
          <div class="section-box">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
              <div>
                <h3 style="color: var(--accent-copper); margin-bottom: 0.75rem;">Le Problème</h3>
                <p style="font-size: 1.05rem; line-height: 1.7;">${project.problem}</p>
              </div>
              <div>
                <h3 style="color: var(--accent-copper); margin-bottom: 0.75rem;">La Solution</h3>
                <p style="font-size: 1.05rem; line-height: 1.7;">${project.solution}</p>
              </div>
            </div>
          </div>

          <!-- Objectives -->
          <div class="section-box">
            <h3 style="margin-bottom: 1.5rem;">Objectifs Stratégiques</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              ${project.objectives.map(obj => `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: var(--bg-primary); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-light);">
                  <i data-lucide="check-circle-2" style="color: var(--accent-copper); flex-shrink: 0; width: 20px; height: 20px; margin-top: 2px;"></i>
                  <span style="font-size: 0.95rem; color: var(--text-primary); font-weight: 500;">${obj}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Design Process -->
          <div class="section-box">
            <h3 style="margin-bottom: 1.5rem;">Processus de Design & Étapes</h3>
            <div class="process-grid" style="margin-top: 0;">
              ${project.process.map(p => `
                <div class="process-card" style="box-shadow: none; border-color: var(--border-light);">
                  <div class="process-number">${p.step}</div>
                  <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${p.title}</h4>
                  <p style="font-size: 0.85rem; color: var(--text-secondary);">${p.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- UI Showcase & Screens Gallery -->
          <div class="section-box">
            <h3 style="margin-bottom: 0.5rem;">Galerie d'Écrans & Prototype UI</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">Aperçu détaillé des maquettes et composants interactifs conçus pour ${project.title}.</p>
            
            <div class="mockup-gallery">
              ${project.screens.map(screen => `
                <div class="mockup-frame" style="background: ${screen.bg}; color: ${screen.dark ? '#FFFFFF' : 'var(--text-primary)'};">
                  <div style="margin-bottom: 1rem;">
                    <h4 style="font-size: 1.1rem; color: inherit; margin-bottom: 0.2rem;">${screen.title}</h4>
                    <p style="font-size: 0.85rem; opacity: 0.85; color: inherit;">${screen.desc}</p>
                  </div>
                  ${renderDetailScreenMockupGraphic(project.id, screen)}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Results & Impact -->
          <div class="section-box" style="background-color: var(--bg-dark); color: #FFFFFF;">
            <h3 style="color: #FFFFFF; margin-bottom: 1.5rem; text-align: center;">Résultats & Impact Mesuré</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; text-align: center;">
              ${project.results.map(res => `
                <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 2rem 1rem; border-radius: 16px;">
                  <div style="font-size: 2.75rem; font-weight: 800; color: var(--accent-amber); font-family: var(--font-heading); line-height: 1;">${res.metric}</div>
                  <div style="font-size: 0.9rem; color: var(--text-light-muted); margin-top: 0.5rem;">${res.label}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Previous / Next Project Navigation Bar -->
          <div class="project-nav-bar">
            <a href="#project/${prevProject.id}" class="project-nav-btn">
              <i data-lucide="arrow-left"></i>
              <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block;">Projet Précédent</span>
                <span>${prevProject.shortTitle}</span>
              </div>
            </a>

            <a href="#projects" class="btn btn-secondary" data-route="projects">
              <i data-lucide="grid" style="width: 16px; height: 16px;"></i>
              <span>Voir tout</span>
            </a>

            <a href="#project/${nextProject.id}" class="project-nav-btn">
              <div style="text-align: right;">
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block;">Projet Suivant</span>
                <span>${nextProject.shortTitle}</span>
              </div>
              <i data-lucide="arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- Reusable Contact Section -->
      <section class="section" style="background-color: var(--bg-secondary);">
        <div class="container" id="detail-contact-container">
          <!-- Reusable contact card -->
        </div>
      </section>
    `;

    renderContactForm('detail-contact-container');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ------------------------------------------------------------------------
     7. HIGH-FIDELITY GRAPHIC GENERATOR FOR DETAIL SHOWCASE
     ------------------------------------------------------------------------ */
  function renderProjectDetailMainMockup(project) {
    if (project.id === 'municipality-website') {
      return `
        <div style="max-width: 900px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15);">
          <img src="assets/adjame_hero.png" alt="Site Officiel de la Mairie d'Adjamé - Mockup Laptop" style="width: 100%; height: auto; display: block;">
        </div>
      `;
    } else if (project.id === 'mobile-app') {
      return `
        <div style="max-width: 900px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15);">
          <img src="assets/mobile_station.png" alt="Application mobile pour station-service" style="width: 100%; height: auto; display: block;">
        </div>
      `;
    } else if (project.id === 'dashboard') {
      return `
        <div style="max-width: 900px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15);">
          <img src="assets/sima_hero.jpg" alt="Conception UX/UI du site du SIMA - Laptop Mockup" style="width: 100%; height: auto; display: block;">
        </div>
      `;
    } else if (project.id === 'platform') {
      return `
        <div style="max-width: 900px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15);">
          <img src="assets/akilyum_hero.png" alt="Site Web pour Freelances — Akilyum" style="width: 100%; height: auto; display: block;">
        </div>
      `;
    } else if (project.id === 'landing-page') {
      return `
        <div style="max-width: 900px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15);">
          <img src="assets/gestion_locative.png" alt="Plateforme de gestion locative digitale" style="width: 100%; height: auto; display: block;">
        </div>
      `;
    } else {
      return `
        <div style="max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.08); border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); padding: 3rem; text-align: center;">
          <h2 style="color: #FFFFFF; font-size: 2rem; margin-bottom: 0.5rem;">${project.title}</h2>
          <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; max-width: 600px; margin: 0 auto 1.5rem auto;">${project.subtitle}</p>
          <div style="display: inline-block; background: #8C5E3C; color: white; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 700; font-size: 0.95rem;">
            Aperçu Haute Fidélité 4K
          </div>
        </div>
      `;
    }
  }

  function renderDetailScreenMockupGraphic(projectId, screen) {
    if (screen.image) {
      return `
        <div style="width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,0,0,0.1); box-shadow: var(--shadow-md);">
          <img src="${screen.image}" alt="${screen.title}" style="width: 100%; height: auto; display: block;">
        </div>
      `;
    }
    return `
      <div style="width: 100%; height: 220px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); background: rgba(0,0,0,0.03); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; text-align: center;">
        <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--accent-copper-light); color: var(--accent-copper); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; margin-bottom: 0.75rem;">
          UI
        </div>
        <strong style="font-size: 0.95rem; color: inherit;">${screen.title}</strong>
        <span style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.25rem;">Composant Interactif & Canvas</span>
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     8. REUSABLE CONTACT FORM RENDERER
     ------------------------------------------------------------------------ */
  function renderContactForm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div>
        <h3 style="margin-bottom: 1.5rem;">Coordonnées & Disponibilité</h3>
        
        <div class="contact-info-item">
          <div class="contact-info-icon">
            <i data-lucide="mail"></i>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.1rem;">Email Direct</h4>
            <p style="margin: 0;"><a href="mailto:konedof0512@gmail.com" style="color: var(--accent-copper); font-weight: 600;">konedof0512@gmail.com</a></p>
          </div>
        </div>

        <div class="contact-info-item">
          <div class="contact-info-icon">
            <i data-lucide="map-pin"></i>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.1rem;">Localisation</h4>
            <p style="margin: 0;"> Abidjan, Côte d'Ivoire (Remote & Hybride)</p>
          </div>
        </div>

        <div class="contact-info-item">
          <div class="contact-info-icon">
            <i data-lucide="clock"></i>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.1rem;">Temps de Réponse</h4>
            <p style="margin: 0;">Moins de 24 heures (Lundi - Vendredi)</p>
          </div>
        </div>
      </div>

      <form id="portfolio-contact-form" onsubmit="return false;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="form-name">Votre Nom</label>
            <input type="text" id="form-name" class="form-control" placeholder="Jean Dupont" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="form-email">Votre Email</label>
            <input type="email" id="form-email" class="form-control" placeholder="jean@entreprise.com" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="form-service">Type de Projet</label>
          <select id="form-service" class="form-control">
            <option value="mobile">Application Mobile (iOS / Android)</option>
            <option value="dashboard">Dashboard & Enterprise SaaS</option>
            <option value="website">Site Web Corporate & Agency</option>
            <option value="municipality">Portail Civique & Service Public</option>
            <option value="design-system">Design System & Audit UX</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="form-message">Message</label>
          <textarea id="form-message" class="form-control" placeholder="Parlez-moi de vos objectifs, délais et contraintes..." required></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;" id="submit-form-btn">
          <span>Envoyer le message</span>
          <i data-lucide="send" style="width: 18px; height: 18px;"></i>
        </button>

        <div id="form-success-msg" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(31,122,76,0.1); color: var(--accent-green); border-radius: 12px; border: 1px solid rgba(31,122,76,0.3); font-weight: 600; text-align: center;">
          <i data-lucide="check-circle" style="vertical-align: middle; margin-right: 0.5rem;"></i>
          Merci ! Votre message a bien été envoyé. Koné vous recontactera très rapidement.
        </div>
      </form>
    `;

    const form = document.getElementById('portfolio-contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-form-btn');
        const msg = document.getElementById('form-success-msg');
        btn.disabled = true;
        btn.innerHTML = `<span>Envoi en cours...</span>`;

        setTimeout(() => {
          btn.style.display = 'none';
          msg.style.display = 'block';
          if (window.lucide) window.lucide.createIcons();
        }, 800);
      });
    }
  }

  /* ------------------------------------------------------------------------
     9. EVENT LISTENERS & NAVIGATION INTERACTIVITY
     ------------------------------------------------------------------------ */
  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  function toggleMobileMenu() {
    mobileDrawer.classList.toggle('open');
    drawerBackdrop.classList.toggle('open');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
  if (drawerClose) drawerClose.addEventListener('click', toggleMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', toggleMobileMenu);

  // Logo returns to home
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = 'home';
      navigateTo('home');
    });
  }

  // Navigation Links routing
  document.querySelectorAll('[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetRoute = link.dataset.route;
      if (['home', 'projects', 'figma-app'].includes(targetRoute)) {
        e.preventDefault();
        window.location.hash = targetRoute;
        navigateTo(targetRoute);
        if (mobileDrawer && mobileDrawer.classList.contains('open')) toggleMobileMenu();
      }
    });
  });

  // Open project buttons
  document.querySelectorAll('.open-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pid = btn.dataset.projectId;
      window.location.hash = `project/${pid}`;
    });
  });

  // Back to top button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     FIGMA SAAS APPLICATION DASHBOARD ENGINE
     ------------------------------------------------------------------------ */
  let figmaState = {
    currentTab: 'overview',
    searchQuery: '',
    statusFilter: 'all',
    currentFormStep: 1
  };

  function initFigmaDashboardApp() {
    setupFigmaEventListeners();
    renderFigmaTabContent(figmaState.currentTab);
  }

  function setupFigmaEventListeners() {
    // View Tab Switcher Buttons
    document.querySelectorAll('.figma-tab-btn, .figma-menu-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.dataset.tabTarget || btn.dataset.figmaTab;
        if (target) {
          e.preventDefault();
          figmaState.currentTab = target;
          
          // Update Tab Buttons UI
          document.querySelectorAll('.figma-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tabTarget === target);
          });
          document.querySelectorAll('.figma-menu-item').forEach(m => {
            m.classList.toggle('active', m.dataset.figmaTab === target);
          });

          renderFigmaTabContent(target);
        }
      });
    });

    // Alert Banner Close
    const closeAlertBtn = document.getElementById('figma-close-alert');
    const alertBanner = document.getElementById('figma-alert-banner');
    if (closeAlertBtn && alertBanner) {
      closeAlertBtn.onclick = () => alertBanner.style.display = 'none';
    }

    // Drawer Backdrop & Close
    const drawerBackdrop = document.getElementById('figma-drawer-backdrop');
    const drawerPanel = document.getElementById('figma-drawer-panel');
    const drawerClose = document.getElementById('figma-drawer-close');

    function closeDrawer() {
      if (drawerPanel) drawerPanel.classList.remove('open');
      if (drawerBackdrop) drawerBackdrop.style.display = 'none';
    }

    if (drawerClose) drawerClose.onclick = closeDrawer;
    if (drawerBackdrop) drawerBackdrop.onclick = closeDrawer;

    // Trigger Drawer from User Bar
    const userBar = document.getElementById('figma-trigger-user-drawer');
    if (userBar) {
      userBar.onclick = () => openFigmaUserDrawer(DASHBOARD_DATA.tableData[0]);
    }

    // Export CSV Mock Action
    const exportBtn = document.getElementById('figma-export-btn');
    if (exportBtn) {
      exportBtn.onclick = () => {
        alert("Export CSV des 14 maquettes Figma généré avec succès !");
      };
    }
  }

  function renderFigmaTabContent(tab) {
    const container = document.getElementById('figma-dynamic-body');
    const screenTitle = document.getElementById('figma-screen-title');
    const screenSubtitle = document.getElementById('figma-screen-subtitle');
    if (!container) return;

    if (tab === 'overview') {
      if (screenTitle) screenTitle.textContent = "Vue d'ensemble — Tableau de Bord";
      if (screenSubtitle) screenSubtitle.textContent = "Synthèse globale des performances, KPI métriques et revenus mensuels (Écrans 1 à 6).";
      renderOverviewTab(container);
    } else if (tab === 'analytics') {
      if (screenTitle) screenTitle.textContent = "Analytics & Performance";
      if (screenSubtitle) screenSubtitle.textContent = "Graphiques de croissance, évolution du trafic et répartition par secteur (Écrans 4 à 6).";
      renderAnalyticsTab(container);
    } else if (tab === 'datatable') {
      if (screenTitle) screenTitle.textContent = "Gestion des Données & Grille";
      if (screenSubtitle) screenSubtitle.textContent = "Tableau dynamique avec filtres multi-critères, statut et pagination (Écrans 7 à 9).";
      renderDataTableTab(container);
    } else if (tab === 'stepper') {
      if (screenTitle) screenTitle.textContent = "Formulaire Multi-Étapes (Stepper)";
      if (screenSubtitle) screenSubtitle.textContent = "Flux d'onboarding et de saisie guidée avec barre de progression (Écran 12).";
      renderStepperTab(container);
    } else if (tab === 'settings') {
      if (screenTitle) screenTitle.textContent = "Profil & Paramètres Système";
      if (screenSubtitle) screenSubtitle.textContent = "Configuration du compte, sécurité et préférences de l'application (Écran 13).";
      renderSettingsTab(container);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /* --- SUB-VIEW 1: OVERVIEW (KPIs + BAR CHART + DONUT) --- */
  function renderOverviewTab(container) {
    container.innerHTML = `
      <!-- KPI Row -->
      <div class="figma-kpi-grid">
        ${DASHBOARD_DATA.kpis.map(kpi => `
          <div class="figma-kpi-card">
            <div class="figma-kpi-top">
              <span class="figma-kpi-title">${kpi.label}</span>
              <div class="figma-kpi-icon ${kpi.color}">
                <i data-lucide="${kpi.icon}" style="width: 18px; height: 18px;"></i>
              </div>
            </div>
            <div class="figma-kpi-value">${kpi.value}</div>
            <div class="figma-kpi-footer">
              <span class="figma-trend ${kpi.trendUp ? 'up' : 'down'}">
                <i data-lucide="${kpi.trendUp ? 'arrow-up-right' : 'arrow-down-right'}" style="width: 12px; height: 12px;"></i>
                ${kpi.trend}
              </span>
              <span class="figma-kpi-subtext">${kpi.subtext}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Charts Section -->
      <div class="figma-charts-grid">
        <!-- SVG Grouped Bar Chart -->
        <div class="figma-card">
          <div class="figma-card-header">
            <div>
              <h3 class="figma-card-title">Évolution des Ventes vs Objectifs</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0;">Comparatif mensuel en milliers d'euros</p>
            </div>
            <div class="figma-filter-group">
              <span style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: #2563EB; font-weight: 600;"><span style="width: 10px; height: 10px; background: #2563EB; border-radius: 2px;"></span> Ventes</span>
              <span style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: #93C5FD; font-weight: 600;"><span style="width: 10px; height: 10px; background: #93C5FD; border-radius: 2px;"></span> Cible</span>
            </div>
          </div>
          ${generateSVGBarChart(DASHBOARD_DATA.charts.monthlyBarChart)}
        </div>

        <!-- SVG Donut Chart -->
        <div class="figma-card">
          <div class="figma-card-header">
            <h3 class="figma-card-title">Répartition Réseau</h3>
          </div>
          <div class="figma-donut-chart-wrapper">
            ${generateSVGDonutChart(DASHBOARD_DATA.charts.donutDistribution)}
            <ul class="figma-legend-list">
              ${DASHBOARD_DATA.charts.donutDistribution.map(item => `
                <li class="figma-legend-item">
                  <span class="figma-legend-item-label">
                    <span class="figma-legend-dot" style="background-color: ${item.color};"></span>
                    ${item.category}
                  </span>
                  <strong style="color: #0F172A;">${item.percentage}%</strong>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- Quick Recent Table Preview -->
      <div class="figma-card">
        <div class="figma-card-header">
          <h3 class="figma-card-title">Dernières Transactions Traitées</h3>
          <button class="figma-btn figma-btn-outline" id="overview-go-datatable" style="font-size: 0.8rem;">
            <span>Voir tout le tableau</span>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
        ${generateTableHTML(DASHBOARD_DATA.tableData.slice(0, 4))}
      </div>
    `;

    const btnGoTable = document.getElementById('overview-go-datatable');
    if (btnGoTable) {
      btnGoTable.onclick = () => {
        figmaState.currentTab = 'datatable';
        renderFigmaTabContent('datatable');
      };
    }

    attachTableRowClickListeners();
  }

  /* --- SUB-VIEW 2: ANALYTICS (SVG LINE CHART WITH GRADIENT) --- */
  function renderAnalyticsTab(container) {
    container.innerHTML = `
      <div class="figma-card" style="margin-bottom: 1.5rem;">
        <div class="figma-card-header">
          <div>
            <h3 class="figma-card-title">Courbe de Croissance des Inscriptions (Septembre 2026)</h3>
            <p style="font-size: 0.8rem; color: #64748B; margin: 0;">Progression cumulée des utilisateurs certifiés</p>
          </div>
          <span class="figma-badge figma-badge-success">+24.8% ce mois</span>
        </div>
        ${generateSVGLineChart(DASHBOARD_DATA.charts.lineGrowthChart)}
      </div>

      <div class="figma-kpi-grid">
        <div class="figma-card">
          <h4 style="font-size: 0.85rem; color: #64748B; margin-bottom: 0.5rem;">Taux de Rétention Utilisateurs</h4>
          <p style="font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 0 0 0.5rem;">88.4%</p>
          <div style="width: 100%; height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
            <div style="width: 88.4%; height: 100%; background: #10B981; border-radius: 4px;"></div>
          </div>
        </div>

        <div class="figma-card">
          <h4 style="font-size: 0.85rem; color: #64748B; margin-bottom: 0.5rem;">Temps Moyen de Traitement</h4>
          <p style="font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 0 0 0.5rem;">1.2 min</p>
          <div style="width: 100%; height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
            <div style="width: 70%; height: 100%; background: #3B82F6; border-radius: 4px;"></div>
          </div>
        </div>

        <div class="figma-card">
          <h4 style="font-size: 0.85rem; color: #64748B; margin-bottom: 0.5rem;">Satisfaction NPS</h4>
          <p style="font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 0 0 0.5rem;">92 / 100</p>
          <div style="width: 100%; height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
            <div style="width: 92%; height: 100%; background: #8B5CF6; border-radius: 4px;"></div>
          </div>
        </div>

        <div class="figma-card">
          <h4 style="font-size: 0.85rem; color: #64748B; margin-bottom: 0.5rem;">Disponibilité Serveur (Uptime)</h4>
          <p style="font-size: 1.5rem; font-weight: 800; color: #0F172A; margin: 0 0 0.5rem;">99.98%</p>
          <div style="width: 100%; height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
            <div style="width: 99.98%; height: 100%; background: #059669; border-radius: 4px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  /* --- SUB-VIEW 3: DATA TABLE WITH FILTERS --- */
  function renderDataTableTab(container) {
    const filteredData = DASHBOARD_DATA.tableData.filter(row => {
      const matchSearch = row.user.name.toLowerCase().includes(figmaState.searchQuery.toLowerCase()) ||
                          row.user.email.toLowerCase().includes(figmaState.searchQuery.toLowerCase()) ||
                          row.id.toLowerCase().includes(figmaState.searchQuery.toLowerCase());
      const matchStatus = figmaState.statusFilter === 'all' || row.statusType === figmaState.statusFilter;
      return matchSearch && matchStatus;
    });

    container.innerHTML = `
      <div class="figma-card">
        <!-- Filter Toolbar -->
        <div class="figma-table-toolbar">
          <div class="figma-search-box" style="width: 280px;">
            <i data-lucide="search" style="width: 16px; height: 16px;"></i>
            <input type="text" id="figma-table-search-input" value="${figmaState.searchQuery}" placeholder="Filtrer par nom, email...">
          </div>

          <div class="figma-filter-group">
            <select class="figma-select" id="figma-status-select">
              <option value="all" ${figmaState.statusFilter === 'all' ? 'selected' : ''}>Tous les statuts</option>
              <option value="success" ${figmaState.statusFilter === 'success' ? 'selected' : ''}>Actif</option>
              <option value="info" ${figmaState.statusFilter === 'info' ? 'selected' : ''}>En cours</option>
              <option value="warning" ${figmaState.statusFilter === 'warning' ? 'selected' : ''}>En attente</option>
              <option value="danger" ${figmaState.statusFilter === 'danger' ? 'selected' : ''}>Urgent</option>
              <option value="neutral" ${figmaState.statusFilter === 'neutral' ? 'selected' : ''}>Suspendu</option>
            </select>

            <button class="figma-btn figma-btn-primary" id="btn-add-table-row">
              <i data-lucide="user-plus" style="width: 16px; height: 16px;"></i>
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        <!-- Render Table -->
        ${generateTableHTML(filteredData)}

        <!-- Pagination Bar -->
        <div class="figma-pagination">
          <div>Affichage de <strong>1</strong> à <strong>${filteredData.length}</strong> sur <strong>${DASHBOARD_DATA.tableData.length}</strong> entrées</div>
          <div class="figma-page-numbers">
            <button class="figma-page-num active">1</button>
            <button class="figma-page-num">2</button>
            <button class="figma-page-num">3</button>
          </div>
        </div>
      </div>
    `;

    // Bind Filter Events
    const searchInput = document.getElementById('figma-table-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        figmaState.searchQuery = e.target.value;
        renderDataTableTab(container);
      };
    }

    const statusSelect = document.getElementById('figma-status-select');
    if (statusSelect) {
      statusSelect.onchange = (e) => {
        figmaState.statusFilter = e.target.value;
        renderDataTableTab(container);
      };
    }

    const btnAddRow = document.getElementById('btn-add-table-row');
    if (btnAddRow) {
      btnAddRow.onclick = () => {
        figmaState.currentTab = 'stepper';
        renderFigmaTabContent('stepper');
      };
    }

    attachTableRowClickListeners();
  }

  /* --- SUB-VIEW 4: STEPPER FORM (SCREEN 12 FIGMA) --- */
  function renderStepperTab(container) {
    const step = figmaState.currentFormStep;
    container.innerHTML = `
      <!-- Stepper Header Bar -->
      <div class="figma-stepper-bar">
        <div class="figma-step-item ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}">
          <div class="figma-step-circle">${step > 1 ? '✓' : '1'}</div>
          <span>1. Informations Personnelles</span>
        </div>
        <div style="flex: 1; height: 2px; background: #E2E8F0; margin: 0 0.5rem;"></div>
        <div class="figma-step-item ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}">
          <div class="figma-step-circle">${step > 2 ? '✓' : '2'}</div>
          <span>2. Rôle & Abonnements</span>
        </div>
        <div style="flex: 1; height: 2px; background: #E2E8F0; margin: 0 0.5rem;"></div>
        <div class="figma-step-item ${step === 3 ? 'active' : ''}">
          <div class="figma-step-circle">3</div>
          <span>3. Confirmation</span>
        </div>
      </div>

      <div class="figma-form-grid">
        <div class="figma-card">
          ${step === 1 ? `
            <h3 style="font-size: 1.1rem; color: #0F172A; margin-bottom: 1.25rem;">Étape 1 : Identité & Contact</h3>
            <div class="figma-form-group">
              <label class="figma-form-label">Nom complet *</label>
              <input type="text" class="figma-input" placeholder="ex: Amadou Diallo" value="Amadou Diallo">
            </div>
            <div class="figma-form-group">
              <label class="figma-form-label">Adresse Email Professionnelle *</label>
              <input type="email" class="figma-input" placeholder="a.diallo@entreprise.com" value="a.diallo@entreprise.com">
            </div>
            <div class="figma-form-group">
              <label class="figma-form-label">Numéro de Téléphone</label>
              <input type="tel" class="figma-input" placeholder="+225 07 00 00 00" value="+225 07 89 45 12">
            </div>
          ` : step === 2 ? `
            <h3 style="font-size: 1.1rem; color: #0F172A; margin-bottom: 1.25rem;">Étape 2 : Configuration du Rôle & Forfait</h3>
            <div class="figma-form-group">
              <label class="figma-form-label">Rôle d'Accès Système</label>
              <select class="figma-select" style="width: 100%;">
                <option selected>Lead Designer / Product Owner</option>
                <option>Administrateur Système</option>
                <option>Développeur Senior</option>
                <option>Gestionnaire de Contenu</option>
              </select>
            </div>
            <div class="figma-form-group">
              <label class="figma-form-label">Type d'Abonnement</label>
              <select class="figma-select" style="width: 100%;">
                <option selected>Enterprise VIP (1,200 € / mois)</option>
                <option>Pro Annuel (450 € / an)</option>
                <option>Starter (120 € / mois)</option>
              </select>
            </div>
          ` : `
            <h3 style="font-size: 1.1rem; color: #0F172A; margin-bottom: 1.25rem;">Étape 3 : Validation Finalisée</h3>
            <div style="background: #DEF7EC; border: 1px solid #BCF0DA; border-radius: 8px; padding: 1.25rem; color: #03543F; margin-bottom: 1rem;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">✓ Données prêtes à être sauvegardées</h4>
              <p style="margin: 0; font-size: 0.875rem;">Le compte utilisateur sera créé instantanément et recevra une invitation par e-mail.</p>
            </div>
          `}

          <!-- Actions Footer -->
          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #E2E8F0;">
            <button class="figma-btn figma-btn-outline" id="stepper-prev-btn" ${step === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Précédent
            </button>
            <button class="figma-btn figma-btn-primary" id="stepper-next-btn">
              ${step === 3 ? 'Enregistrer le Profil' : 'Suivant'} <i data-lucide="${step === 3 ? 'check' : 'arrow-right'}" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>

        <!-- Right Helper Card -->
        <div class="figma-card" style="background: #F8FAFC; border-style: dashed;">
          <h4 style="font-size: 0.95rem; color: #0F172A; margin-bottom: 0.75rem;">💡 Guide de Saisie Figma UI</h4>
          <p style="font-size: 0.85rem; color: #64748B; line-height: 1.5;">
            Ce composant reproduit fidèlement la structure de formulaire multi-étapes visible dans l'écran 12 de la maquette Figma.
          </p>
        </div>
      </div>
    `;

    const prevBtn = document.getElementById('stepper-prev-btn');
    const nextBtn = document.getElementById('stepper-next-btn');

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (figmaState.currentFormStep > 1) {
          figmaState.currentFormStep--;
          renderStepperTab(container);
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (figmaState.currentFormStep < 3) {
          figmaState.currentFormStep++;
          renderStepperTab(container);
        } else {
          alert("Nouveau profil utilisateur enregistré avec succès !");
          figmaState.currentFormStep = 1;
          figmaState.currentTab = 'datatable';
          renderFigmaTabContent('datatable');
        }
      };
    }
  }

  /* --- SUB-VIEW 5: USER SETTINGS (SCREEN 13 FIGMA) --- */
  function renderSettingsTab(container) {
    container.innerHTML = `
      <div class="figma-card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <img src="assets/avatar.png" alt="Koné Dofougo" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #2563EB;">
          <div>
            <h3 style="margin: 0 0 0.25rem 0; font-size: 1.25rem; color: #0F172A;">Koné Dofougo</h3>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #64748B;">Senior Lead Product & UX/UI Designer</p>
            <span class="figma-badge figma-badge-success">Compte Vérifié</span>
          </div>
        </div>
      </div>

      <div class="figma-card">
        <h3 class="figma-card-title" style="margin-bottom: 1.25rem;">Paramètres du Compte</h3>
        <div class="figma-form-group">
          <label class="figma-form-label">Nom d'affichage</label>
          <input type="text" class="figma-input" value="Koné Dofougo">
        </div>
        <div class="figma-form-group">
          <label class="figma-form-label">Titre de poste</label>
          <input type="text" class="figma-input" value="Senior Product Designer">
        </div>
        <button class="figma-btn figma-btn-primary" onclick="alert('Modifications sauvegardées !')">Enregistrer les modifications</button>
      </div>
    `;
  }

  /* --- HELPER HTML & SVG GENERATORS --- */
  function generateTableHTML(data) {
    if (!data.length) {
      return `<p style="padding: 2rem; text-align: center; color: #94A3B8;">Aucune donnée trouvée.</p>`;
    }

    return `
      <div class="figma-table-responsive">
        <table class="figma-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Forfait</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr class="figma-row-clickable" data-user-id="${row.id}">
                <td style="font-weight: 700; color: #64748B;">${row.id}</td>
                <td>
                  <div class="figma-user-cell">
                    <img src="${row.user.avatar}" alt="${row.user.name}">
                    <div>
                      <p class="figma-user-cell-name">${row.user.name}</p>
                      <p class="figma-user-cell-email">${row.user.email}</p>
                    </div>
                  </div>
                </td>
                <td>${row.role}</td>
                <td><span style="font-weight: 600; color: #334155;">${row.plan}</span></td>
                <td style="font-weight: 700; color: #0F172A;">${row.amount}</td>
                <td><span class="figma-badge figma-badge-${row.statusType}">${row.status}</span></td>
                <td>
                  <button class="figma-icon-btn figma-row-inspect-btn" data-user-id="${row.id}" style="width: 30px; height: 30px;">
                    <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function attachTableRowClickListeners() {
    document.querySelectorAll('.figma-row-inspect-btn, .figma-row-clickable td:not(:last-child)').forEach(el => {
      el.onclick = (e) => {
        const row = el.closest('tr');
        if (row) {
          const uid = row.dataset.userId;
          const userObj = DASHBOARD_DATA.tableData.find(u => u.id === uid);
          if (userObj) openFigmaUserDrawer(userObj);
        }
      };
    });
  }

  function openFigmaUserDrawer(userObj) {
    const drawerPanel = document.getElementById('figma-drawer-panel');
    const drawerBackdrop = document.getElementById('figma-drawer-backdrop');
    const drawerContent = document.getElementById('figma-drawer-content');

    if (drawerContent) {
      drawerContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <img src="${userObj.user.avatar}" alt="${userObj.user.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 0.75rem; border: 3px solid #2563EB;">
          <h3 style="margin: 0; font-size: 1.2rem; color: #0F172A;">${userObj.user.name}</h3>
          <p style="margin: 0.25rem 0 0.5rem; font-size: 0.85rem; color: #64748B;">${userObj.user.email}</p>
          <span class="figma-badge figma-badge-${userObj.statusType}">${userObj.status}</span>
        </div>

        <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; font-size: 0.875rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: #64748B;">Identifiant :</span>
            <strong>${userObj.id}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: #64748B;">Rôle Système :</span>
            <strong>${userObj.role}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="color: #64748B;">Forfait souscrit :</span>
            <strong>${userObj.plan}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748B;">Facturation :</span>
            <strong>${userObj.amount}</strong>
          </div>
        </div>
      `;
    }

    if (drawerPanel) drawerPanel.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.style.display = 'block';
  }

  function generateSVGBarChart(data) {
    const svgWidth = 600;
    const svgHeight = 200;
    const maxVal = 100000;
    const barWidth = 18;

    return `
      <svg class="figma-bar-chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <line x1="40" y1="160" x2="580" y2="160" stroke="#E2E8F0" stroke-width="1" />
        <line x1="40" y1="100" x2="580" y2="100" stroke="#E2E8F0" stroke-dasharray="4" stroke-width="1" />
        <line x1="40" y1="40" x2="580" y2="40" stroke="#E2E8F0" stroke-dasharray="4" stroke-width="1" />

        ${data.map((item, idx) => {
          const x = 50 + idx * 60;
          const salesH = (item.sales / maxVal) * 140;
          const targetH = (item.target / maxVal) * 140;

          return `
            <g class="bar-group">
              <rect x="${x}" y="${160 - salesH}" width="${barWidth}" height="${salesH}" fill="#2563EB" rx="3" />
              <rect x="${x + barWidth + 3}" y="${160 - targetH}" width="${barWidth}" height="${targetH}" fill="#93C5FD" rx="3" />
              <text x="${x + 18}" y="180" font-size="11" fill="#64748B" text-anchor="middle">${item.month}</text>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  }

  function generateSVGDonutChart(data) {
    return `
      <svg width="140" height="140" viewBox="0 0 42 42" style="transform: rotate(-90deg);">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F1F5F9" stroke-width="5"></circle>
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563EB" stroke-width="5" stroke-dasharray="45 55" stroke-dashoffset="0"></circle>
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10B981" stroke-width="5" stroke-dasharray="30 70" stroke-dashoffset="-45"></circle>
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F59E0B" stroke-width="5" stroke-dasharray="15 85" stroke-dashoffset="-75"></circle>
      </svg>
    `;
  }

  function generateSVGLineChart(data) {
    return `
      <svg viewBox="0 0 600 200" style="width: 100%; height: 220px;">
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <path d="M 40 150 Q 150 120, 250 80 T 450 50 T 560 20 L 560 170 L 40 170 Z" fill="url(#chartGrad)" />
        <path d="M 40 150 Q 150 120, 250 80 T 450 50 T 560 20" fill="none" stroke="#2563EB" stroke-width="3" />
        <circle cx="560" cy="20" r="5" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" />
      </svg>
    `;
  }

  /* ------------------------------------------------------------------------
     10. INITIALIZATION
     ------------------------------------------------------------------------ */
  renderHomepage();
  handleHashChange();
});

