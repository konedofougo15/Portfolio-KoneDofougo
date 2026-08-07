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
    viewHome.style.display = 'none';
    viewProjects.style.display = 'none';
    viewProjectDetail.style.display = 'none';

    if (route === 'home') {
      viewHome.style.display = 'block';
    } else if (route === 'projects') {
      viewProjects.style.display = 'block';
      renderProjectsPage();
    } else if (route === 'project-detail' && params.id) {
      state.currentProjectId = params.id;
      viewProjectDetail.style.display = 'block';
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
            <p style="margin: 0;"><a href="mailto:kone.dofougo@example.com" style="color: var(--accent-copper); font-weight: 600;">kone.dofougo@example.com</a></p>
          </div>
        </div>

        <div class="contact-info-item">
          <div class="contact-info-icon">
            <i data-lucide="map-pin"></i>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.1rem;">Localisation</h4>
            <p style="margin: 0;">Paris, France & Abidjan, Côte d'Ivoire (Remote & Hybride)</p>
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
      if (['home', 'projects'].includes(targetRoute)) {
        e.preventDefault();
        window.location.hash = targetRoute;
        navigateTo(targetRoute);
        if (mobileDrawer.classList.contains('open')) toggleMobileMenu();
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
     10. INITIALIZATION
     ------------------------------------------------------------------------ */
  renderHomepage();
  handleHashChange();
});
