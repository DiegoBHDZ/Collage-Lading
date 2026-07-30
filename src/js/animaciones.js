document.addEventListener("DOMContentLoaded", () => {
  
  /**
   * MOTOR DE FÍSICAS UNIFICADO PARA CARRUSELES TIPO "LIBRO"
   * @param {Object} config - Configuración matemática para cada sección
   */
  function crearBarajaInteractiva(config) {
    const container = document.querySelector(config.containerId);
    if (!container) return;
    
    const cards = container.querySelectorAll(config.cardClass);
    if (cards.length === 0) return;

    // Prevenir el comportamiento de deslizar atrás/adelante nativo del navegador en móviles
    container.style.touchAction = 'pan-y';

    let progress = 0;       
    let targetProgress = 0; 
    let isAnimating = false;

    // Renderizador Matemático
    const render = () => {
      cards.forEach((card, index) => {
        // 1. ESTADO DE REPOSO: Apiladas a la derecha (Efecto Lomo de Libro)
        const startX = config.stackBase + (index * config.stackGap); 
        const startScale = 1 - ((cards.length - 1 - index) * config.scaleDrop); 
        
        // 2. ESTADO EXPANDIDO: Desplegadas hacia la izquierda (Páginas)
        const endX = config.spreadBase + (index * config.spreadGap);
        const endScale = 1; 
        
        // 3. CASCADA DE TIEMPOS
        const duration = 0.5; 
        const stagger = 0.12; 
        const cardStart = index * stagger;
        const cardEnd = cardStart + duration;
        
        let cardProgress = (progress - cardStart) / (cardEnd - cardStart);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        
        // Curva de aceleración (In-Out suave)
        const easeProgress = cardProgress < 0.5 ? 2 * cardProgress * cardProgress : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;
        
        // Interpolación fluida
        const currentX = startX + (easeProgress * (endX - startX));
        const currentScale = startScale + (easeProgress * (endScale - startScale));
        
        card.style.transformOrigin = "center center";
        card.style.transform = `translate(${currentX}${config.unit}, ${config.offsetY}) scale(${currentScale})`;
        card.style.zIndex = Math.round(cardProgress * 10) + index;
      });
    };

    // Bucle de animación suave a 60 FPS
    const smoothAnimate = () => {
      progress += (targetProgress - progress) * 0.1; // Velocidad del imán
      if (Math.abs(targetProgress - progress) < 0.001) {
        progress = targetProgress;
        render();
        isAnimating = false;
        return;
      }
      render();
      requestAnimationFrame(smoothAnimate);
    };

    // ==========================================
    // INTERACCIÓN DESKTOP: Tracking "Pull to Open"
    // ==========================================
    container.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return; 
      const rect = container.getBoundingClientRect();
      let mouseX = (e.clientX - rect.left) / rect.width;
      
      // Mapeo invertido: Jalar de derecha a izquierda
      targetProgress = Math.max(0, Math.min(1, (0.85 - mouseX) / 0.65));
      if (!isAnimating) { isAnimating = true; smoothAnimate(); }
    });

    container.addEventListener("mouseleave", () => {
      if (window.innerWidth < 768) return;
      targetProgress = 0; // Regresa al reposo
      if (!isAnimating) { isAnimating = true; smoothAnimate(); }
    });

    // ==========================================
    // INTERACCIÓN MOBILE: Fricción Táctil y "Snap"
    // ==========================================
    let isDragging = false;

    container.addEventListener("touchstart", (e) => {
      if (window.innerWidth >= 768) return;
      isDragging = true;
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
      if (!isDragging || window.innerWidth >= 768) return;
      const rect = container.getBoundingClientRect();
      let touchX = (e.touches[0].clientX - rect.left) / rect.width;
      
      targetProgress = Math.max(0, Math.min(1, (0.85 - touchX) / 0.65));
      if (!isAnimating) { isAnimating = true; smoothAnimate(); }
    }, { passive: true });

    container.addEventListener("touchend", () => {
      if (!isDragging || window.innerWidth >= 768) return;
      isDragging = false;
      
      // Efecto Resorte (Snap): Si pasa del 30%, se abre completo; si no, se cierra.
      targetProgress = targetProgress > 0.3 ? 1 : 0; 
      if (!isAnimating) { isAnimating = true; smoothAnimate(); }
    });

    // Fallback para toque rápido (Tap)
    container.addEventListener("click", () => {
      if (window.innerWidth < 768 && !isDragging) {
        targetProgress = targetProgress > 0.5 ? 0 : 1;
        if (!isAnimating) { isAnimating = true; smoothAnimate(); }
      }
    });

    // Render inicial
    render();
  }

  // =========================================================
  // INICIALIZACIÓN DE SECCIONES CON SUS PARÁMETROS ESPECÍFICOS
  // =========================================================

  // SECCIÓN 4 (MUSIC PR) - 4 Cartas
  crearBarajaInteractiva({
    containerId: "#carousel-container-4",
    cardClass: ".carousel-card",
    unit: "cqw",
    offsetY: "-50%", // Centrado vertical especial de esta sección
    stackBase: 55,   // Posición inicial (Lomo derecho)
    stackGap: 4,     // Cuánto se asoma cada carta apilada
    spreadBase: 10,  // Posición de la primera carta al abrir
    spreadGap: 20,   // Distancia entre cartas abiertas
    scaleDrop: 0.05  // Reducción de tamaño en el fondo
  });

  // SECCIÓN 5 (CINEMA POSTERS) - 4 Cartas
  crearBarajaInteractiva({
    containerId: "#carousel-container-5",
    cardClass: ".cinema-card",
    unit: "%",
    offsetY: "0px",
    stackBase: 285,   // Alineado a la derecha del pequeño contenedor
    stackGap: 15,
    spreadBase: 0,
    spreadGap: 55,   // 4 cartas x 25% = 100% de distribución perfecta
    scaleDrop: 0.05
  });

  // SECCIÓN 7 (PHOTOGRAPHER) - 6 Cartas
  crearBarajaInteractiva({
    containerId: "#carousel-container-7",
    cardClass: ".carousel-card-7",
    unit: "%",
    offsetY: "0px",
    stackBase: 200,
    stackGap: 13,
    spreadBase: 0,
    spreadGap: 16,   // 6 cartas x 16% = 96% de distribución
    scaleDrop: 0.04
  });

});