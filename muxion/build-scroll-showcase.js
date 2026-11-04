const projects = [
  { image: 'assets/generated/portfolio-ell-commerce.png', name: 'ELL · Digital commerce', alt: 'ELL fashion ecommerce homepage and product collection', href: 'https://ellfashions.com/' },
  { image: 'assets/generated/portfolio-karakoram.png', name: 'Karakoram · Organic honey', alt: 'Karakoram organic honey ecommerce homepage', href: 'https://karakoramhoney.com/' },
  { image: 'assets/generated/portfolio-food-safety.png', name: 'Food Safety Genie · Food safety', alt: 'Food Safety Genie service website homepage', href: 'https://foodsafetygenie.com/' },
  { image: 'assets/generated/portfolio-skin-sense.png', name: 'The Skin Sensé · Healthcare', alt: 'The Skin Sensé dermatology website homepage', href: 'https://www.theskinsense.com/' },
  { image: 'assets/generated/portfolio-meegan.png', name: 'Meegan Exports · Global trade', alt: 'Meegan Exports company website homepage', href: 'https://meeganexports.com/' },
  { image: 'assets/generated/portfolio-waterman.png', name: 'Waterman · Mobile product', alt: 'Waterman service website with mobile ordering app screens', href: 'https://thewaterman.in/' },
  { image: 'assets/generated/portfolio-krea-healthcare.png', name: 'Krea · Healthcare research', alt: 'Krea healthcare research website homepage', href: 'https://krea.in/' },
  { image: 'assets/generated/portfolio-furnberry.png', name: 'Furnberry · Bespoke furniture', alt: 'Furnberry bespoke furniture website homepage', href: 'https://furnberry.in/' },
  { image: 'assets/generated/portfolio-textile-collective.png', name: 'Textile Collective · Interior design', alt: 'Textile Collective interior design website homepage', href: 'https://textilecollective.co.nz/' },
  { image: 'assets/generated/portfolio-shelkam-engineering.png', name: 'Shelkam · Engineering', alt: 'Shelkam Engineering website homepage', href: 'https://shelkamengineering.co.nz/' },
  { image: 'assets/generated/portfolio-maxwax.png', name: 'MaxWax · Automotive care', alt: 'MaxWax car wash and detailing website homepage', href: 'https://maxwaxcarwash.com.au/' },
  { image: 'assets/generated/portfolio-rapid-builders.png', name: 'Rapid Builders · Construction', alt: 'Rapid Builders construction website homepage', href: 'https://rapidbuilders.co.nz/' },
];

export function buildScrollShowcase() {
  return `<section id="muxion-build-work" class="build-scroll-story" aria-label="Selected MUXION Build projects and experience">
    <div class="build-scroll-track" data-build-scroll-track>
      <div class="build-scroll-sticky">
        <div class="build-scroll-stage" data-build-scroll-stage>
          ${projects.map((project, index) => `<a class="build-scroll-frame${index === 0 ? ' is-current' : ''}" data-build-frame="${index}" style="--frame-index:${index}" href="${project.href}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${project.name} website"${index ? ' tabindex="-1"' : ''}><img src="${project.image}" alt="${project.alt}"${index ? ' loading="lazy"' : ''} decoding="async"></a>`).join('')}
        </div>
        <section class="build-impact" data-build-impact aria-label="MUXION project impact metrics">
          <div class="build-impact-backdrop" data-build-impact-backdrop></div>
          <div class="build-impact-inner" data-build-impact-content>
            <div class="build-impact-metrics">
              <article><strong aria-label="100 plus"><span data-count data-from="50" data-to="100">50</span><span class="build-impact-plus" aria-hidden="true">+</span></strong><p>Websites designed</p></article>
              <article><strong aria-label="130 plus"><span data-count data-from="80" data-to="130">80</span><span class="build-impact-plus" aria-hidden="true">+</span></strong><p>Clients served</p></article>
              <article><strong aria-label="36 plus"><span data-count data-from="0" data-to="36">0</span><span class="build-impact-plus" aria-hidden="true">+</span></strong><p>Social accounts managed</p></article>
            </div>
            <p class="build-impact-terms">Standard terms apply.</p>
          </div>
        </section>
      </div>
    </div>
  </section>`;
}

let cleanup = () => {};

export function enhanceBuildScroll() {
  cleanup();
  const track = document.querySelector('[data-build-scroll-track]');
  if (!track) return;

  const stage = track.querySelector('[data-build-scroll-stage]');
  const sticky = track.querySelector('.build-scroll-sticky');
  const frames = [...track.querySelectorAll('[data-build-frame]')];
  const impact = track.querySelector('[data-build-impact]');
  const impactBackdrop = track.querySelector('[data-build-impact-backdrop]');
  const impactContent = track.querySelector('[data-build-impact-content]');
  const countNodes = [...track.querySelectorAll('[data-count]')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let countStartedAt = 0;
  let countRaf = 0;

  const countUp = (now) => {
    if (!countStartedAt) countStartedAt = now;
    const progress = Math.min(1, (now - countStartedAt) / 2600);
    const eased = 1 - Math.pow(1 - progress, 3);
    countNodes.forEach((node) => {
      const from = Number(node.dataset.from);
      const to = Number(node.dataset.to);
      node.textContent = String(Math.round(from + (to - from) * eased));
    });
    if (progress < 1) countRaf = requestAnimationFrame(countUp);
    else countRaf = 0;
  };

  const update = () => {
    raf = 0;
    if (reduceMotion.matches) return;
    const rect = track.getBoundingClientRect();
    // Separate foreground, orbital background and exit layers without adding scroll distance.
    const entry = Math.max(0, Math.min(1, rect.top / Math.max(1, innerHeight)));
    track.style.setProperty('--showcase-entry-y', `${(entry * Math.min(innerHeight * .34, innerWidth <= 760 ? 160 : 300)).toFixed(2)}px`);
    track.style.setProperty('--showcase-entry-scale', (1 - entry * .1).toFixed(4));
    const exit = Math.max(0, Math.min(1, (sticky.clientHeight - rect.bottom) / sticky.clientHeight));
    const travel = Math.max(1, track.offsetHeight - sticky.clientHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    const depth = Math.sin(Math.min(1, progress / .76) * Math.PI);
    track.style.setProperty('--showcase-depth-y', `${(-depth * (innerWidth <= 760 ? 14 : 34)).toFixed(2)}px`);
    track.style.setProperty('--showcase-halo-y', `${(-entry * innerHeight * .12 + depth * 56 - exit * 90).toFixed(2)}px`);
    track.style.setProperty('--showcase-impact-y', `${(exit * sticky.clientHeight * .2).toFixed(2)}px`);
    const position = progress <= 0.1 ? 0 : Math.min(3, ((progress - 0.1) / 0.27) * 3);
    const deckBlend = Math.max(0, Math.min(1, (progress - 0.37) / 0.035));
    const deckReveal = Math.max(0, Math.min(1, (progress - 0.34) / 0.03));
    const sequencePosition = 3 + Math.max(0, Math.min(1, (progress - 0.37) / 0.39)) * 8;
    const zoom = progress <= 0.76 ? 0 : Math.min(1, (progress - 0.76) / 0.11);
    const blackProgress = Math.max(0, Math.min(1, (progress - 0.88) / 0.045));
    const statsProgress = Math.max(0, Math.min(1, (progress - 0.925) / 0.035));
    const active = progress >= 0.37 ? Math.min(frames.length - 1, Math.floor(sequencePosition + 0.5)) : Math.min(3, Math.floor(position + 0.5));
    const compactOrbit = innerWidth <= 760;
    const orbitRadius = Math.min(innerWidth * (compactOrbit ? 0.54 : 0.36), compactOrbit ? 340 : 700);
    const orbitStep = compactOrbit ? 80 : 72;
    const orbitPerspective = compactOrbit ? 2400 : 1800;

    stage.style.setProperty('--scroll-position', position.toFixed(4));
    stage.style.setProperty('--final-zoom', zoom.toFixed(4));
    stage.style.setProperty('--scroll-progress', progress.toFixed(4));
    frames.forEach((frame, index) => {
      const zoomToFill = Math.max(innerWidth / Math.max(1, frame.clientWidth), innerHeight / Math.max(1, frame.clientHeight)) * 1.04;
      if (index < 3) {
        const angle = (index - position) * orbitStep;
        const radians = angle * Math.PI / 180;
        const orbitX = Math.sin(radians) * orbitRadius;
        const orbitZ = Math.cos(radians) * orbitRadius;
        const perspectiveScale = 1 - orbitZ / orbitPerspective;
        frame.style.transform = `translate3d(calc(-50% + ${orbitX}px), -50%, ${orbitZ}px) rotateY(${angle}deg) rotateX(2deg) scale(${perspectiveScale})`;
        frame.style.opacity = String(1 - deckBlend);
        frame.style.zIndex = String(10 + Math.round(Math.cos(radians) * 10));
      } else if (index === 3) {
        const distance = index - sequencePosition;
        const angle = (index - position) * orbitStep;
        const radians = angle * Math.PI / 180;
        const orbitX = Math.sin(radians) * orbitRadius * (1 - deckBlend);
        const orbitZ = Math.cos(radians) * orbitRadius * (1 - deckBlend);
        const offsetY = distance < 0 ? distance * innerHeight * 0.9 : 0;
        const perspectiveScale = 1 - orbitZ / orbitPerspective;
        frame.style.transform = `translate3d(calc(-50% + ${orbitX}px), calc(-50% + ${offsetY}px), ${orbitZ}px) rotateY(${angle * (1 - deckBlend)}deg) rotateX(2deg) scale(${perspectiveScale})`;
        frame.style.opacity = '1';
        const carouselLayer = 10 + Math.round(Math.cos(radians) * 10);
        const deckLayer = 20 - Math.round(Math.abs(distance) * 10);
        frame.style.zIndex = String(progress < 0.37 ? carouselLayer : deckLayer);
      } else if (index < frames.length - 1) {
        const distance = index - sequencePosition;
        const depth = Math.min(5, Math.abs(distance));
        const offsetX = 0;
        const offsetY = distance > 0 ? depth * 18 : distance * innerHeight * 0.9;
        const scale = 1 - depth * 0.035;
        const stackOpacity = distance > 0 ? Math.max(0.3, 1 - depth * 0.12) : Math.max(0, 1 + distance * 1.05);
        frame.style.transform = `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0) scale(${scale})`;
        frame.style.opacity = String(deckReveal * stackOpacity * (1 - zoom));
        frame.style.zIndex = String(20 - Math.round(Math.abs(distance) * 10));
      } else if (index === frames.length - 1) {
        const distance = index - sequencePosition;
        const depth = Math.min(5, Math.abs(distance));
        const offsetX = 0;
        const offsetY = distance > 0 ? depth * 18 : distance * innerHeight * 0.9;
        const scale = 1 - depth * 0.035 + zoom * (zoomToFill - 1);
        frame.style.transform = `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0) scale(${scale})`;
        frame.style.opacity = String(deckReveal * (1 - blackProgress));
        frame.style.zIndex = String(20 - Math.round(Math.abs(distance) * 10));
      }
      frame.classList.toggle('is-current', index === active);
      frame.setAttribute('aria-hidden', String(index !== active));
      frame.tabIndex = index === active ? 0 : -1;
      frame.style.pointerEvents = index === active ? 'auto' : 'none';
    });
    impactBackdrop.style.opacity = String(blackProgress);
    impact.style.visibility = blackProgress > 0 ? 'visible' : 'hidden';
    impactContent.style.opacity = String(statsProgress);
    impactContent.style.visibility = statsProgress > 0 ? 'visible' : 'hidden';
    impact.setAttribute('aria-hidden', String(statsProgress <= 0));
    track.classList.toggle('is-impact', progress >= 0.925);
    if (progress >= 0.925 && !countRaf && countNodes.some(node => Number(node.textContent) !== Number(node.dataset.to))) {
      countStartedAt = 0;
      countRaf = requestAnimationFrame(countUp);
    }
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  const staticMode = () => {
    track.classList.toggle('is-static', reduceMotion.matches);
    track.classList.toggle('has-entry-parallax', !reduceMotion.matches);
    if (reduceMotion.matches) {
      if (countRaf) cancelAnimationFrame(countRaf);
      countRaf = 0;
      frames.forEach((frame, index) => { frame.style.transform = ''; frame.classList.toggle('is-current', index === 0); frame.setAttribute('aria-hidden', 'false'); frame.tabIndex = 0; frame.style.pointerEvents = 'auto'; });
      frames.forEach(frame => { frame.style.opacity = '1'; });
      impactBackdrop.style.opacity = '1';
      impact.style.visibility = 'visible';
      impactContent.style.opacity = '1';
      impactContent.style.visibility = 'visible';
      impact.setAttribute('aria-hidden', 'false');
      countNodes.forEach(node => { node.textContent = node.dataset.to; });
      track.classList.remove('is-impact');
    } else update();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reduceMotion.addEventListener?.('change', staticMode);
  staticMode();
  cleanup = () => {
    track.classList.remove('has-entry-parallax');
    ['--showcase-entry-y','--showcase-entry-scale','--showcase-halo-y','--showcase-depth-y','--showcase-impact-y'].forEach(name=>track.style.removeProperty(name));
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    reduceMotion.removeEventListener?.('change', staticMode);
    if (raf) cancelAnimationFrame(raf);
    if (countRaf) cancelAnimationFrame(countRaf);
  };
}

