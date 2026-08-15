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

// SECCIÓN 4 (MUSIC PR) - LÓGICA DIVIDIDA (Móvil vs PC)
  const container4 = document.querySelector("#carousel-container-4");
  if (container4) {
    if (window.innerWidth < 768) {
      // ---------------------------------------------------------
      // LÓGICA MÓVIL: Transición lenta con apilamiento a ambos lados
      // ---------------------------------------------------------
      const cards4 = container4.querySelectorAll(".carousel-card");
      let currentIndex4 = 0;
      
      // Prevenir el "pull-to-refresh" al deslizar
      container4.style.touchAction = 'pan-y';

      const updateMobileDeck4 = () => {
        cards4.forEach((card, i) => {
          // 1. Ampliamos las cartas desde JS para no tocar el HTML
          card.style.width = "65vw"; 
          card.style.maxWidth = "300px";
          // 2. Animación lenta y fluida de 0.8 segundos
          card.style.transition = "all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)";
          card.style.transformOrigin = "center center";
          
          if (i < currentIndex4) {
            // Cartas anteriores: Se apilan sutilmente en el borde IZQUIERDO
            const distance = currentIndex4 - i; // Distancia desde el centro
            const offset = distance * -8; // Desplazamiento negativo (hacia la izquierda)
            const scaleDrop = distance * 0.05; // Efecto de profundidad
            
            card.style.left = "50%";
            card.style.transform = `translate(calc(-50% + ${offset}vw), -50%) scale(${1 - scaleDrop})`;
            card.style.opacity = "1"; // Ya no se vuelven invisibles
            // El z-index asegura que la carta más cercana al centro tape a las más lejanas
            card.style.zIndex = 10 - distance; 
            
          } else if (i === currentIndex4) {
            // Carta actual: Queda perfectamente centrada para apreciarla
            card.style.left = "50%";
            card.style.transform = "translate(-50%, -50%) scale(1)";
            card.style.opacity = "1";
            card.style.zIndex = 10;
            
          } else {
            // Cartas futuras: Apiladas sutilmente en el borde DERECHO
            const distance = i - currentIndex4;
            const offset = distance * 8; // Desplazamiento positivo (hacia la derecha)
            const scaleDrop = distance * 0.05; // Efecto de profundidad
            
            card.style.left = "50%";
            card.style.transform = `translate(calc(-50% + ${offset}vw), -50%) scale(${1 - scaleDrop})`;
            card.style.opacity = "1";
            card.style.zIndex = 10 - distance;
          }
        });
      };

      // Cargar el estado inicial en móvil
      updateMobileDeck4();

      // Interacción: Avanzar por CLIC
      container4.addEventListener("click", () => {
        if (currentIndex4 < cards4.length - 1) currentIndex4++;
        else currentIndex4 = 0; // Regresa al inicio
        updateMobileDeck4();
      });

      // Interacción: Avanzar por DESLIZAMIENTO (SWIPE)
      let startX = 0;
      container4.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      
      container4.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 40 && currentIndex4 < cards4.length - 1) {
          currentIndex4++; // Swipe a la izquierda -> Siguiente foto
          updateMobileDeck4();
        } else if (endX - startX > 40 && currentIndex4 > 0) {
          currentIndex4--; // Swipe a la derecha -> Foto anterior
          updateMobileDeck4();
        }
      }, { passive: true });

    } else {
      // ---------------------------------------------------------
      // LÓGICA PC: Se mantiene intacto tu efecto de "Baraja Original"
      // ---------------------------------------------------------
      crearBarajaInteractiva({
        containerId: "#carousel-container-4",
        cardClass: ".carousel-card",
        unit: "cqw",
        offsetY: "-50%", 
        stackBase: 55,   
        stackGap: 4,     
        spreadBase: 10,  
        spreadGap: 20,   
        scaleDrop: 0.05  
      });
    }
  }

// =========================================================
  // SECCIÓN 5 (CINEMA POSTERS) - LÓGICA DIVIDIDA (Móvil vs PC)
  // =========================================================
  const container5 = document.querySelector("#carousel-container-5");
  if (container5) {
    if (window.innerWidth < 768) {
      // ---------------------------------------------------------
      // LÓGICA MÓVIL: Transición lenta con apilamiento a ambos lados
      // ---------------------------------------------------------
      const cards5 = container5.querySelectorAll(".cinema-card");
      let currentIndex5 = 0;
      
      container5.style.touchAction = 'pan-y'; // Prevenir recargas al deslizar

      const updateMobileDeck5 = () => {
        cards5.forEach((card, i) => {
          // Asignamos dimensiones móviles desde JS para anular el w-1/4
          card.style.width = "55vw"; 
          card.style.height = "100%"; 
          card.style.maxWidth = "280px";
          card.style.borderRadius = "8px"; // Bordes sutiles
          card.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.4)"; // Sombra individual
          card.style.top = "50%"; // Centrado vertical manual
          
          card.style.transition = "all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)";
          card.style.transformOrigin = "center center";
          
          if (i < currentIndex5) {
            // Cartas anteriores: Apiladas a la IZQUIERDA
            const distance = currentIndex5 - i; 
            const offset = distance * -10; 
            const scaleDrop = distance * 0.05; 
            
            card.style.left = "50%";
            card.style.transform = `translate(calc(-50% + ${offset}vw), -50%) scale(${1 - scaleDrop})`;
            card.style.opacity = "1"; 
            card.style.zIndex = 10 - distance; 
            
          } else if (i === currentIndex5) {
            // Carta actual: Protagonista en el CENTRO
            card.style.left = "50%";
            card.style.transform = "translate(-50%, -50%) scale(1)";
            card.style.opacity = "1";
            card.style.zIndex = 10;
            
          } else {
            // Cartas futuras: Apiladas a la DERECHA
            const distance = i - currentIndex5;
            const offset = distance * 10; 
            const scaleDrop = distance * 0.05; 
            
            card.style.left = "50%";
            card.style.transform = `translate(calc(-50% + ${offset}vw), -50%) scale(${1 - scaleDrop})`;
            card.style.opacity = "1";
            card.style.zIndex = 10 - distance;
          }
        });
      };

      updateMobileDeck5();

      // Avanzar con clic
      container5.addEventListener("click", () => {
        if (currentIndex5 < cards5.length - 1) currentIndex5++;
        else currentIndex5 = 0; 
        updateMobileDeck5();
      });

      // Avanzar deslizando el dedo (Swipe)
      let startX5 = 0;
      container5.addEventListener("touchstart", (e) => {
        startX5 = e.touches[0].clientX;
      }, { passive: true });
      
      container5.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX5 - endX > 40 && currentIndex5 < cards5.length - 1) {
          currentIndex5++; 
          updateMobileDeck5();
        } else if (endX - startX5 > 40 && currentIndex5 > 0) {
          currentIndex5--; 
          updateMobileDeck5();
        }
      }, { passive: true });

    } else {
      // ---------------------------------------------------------
      // LÓGICA PC: Se mantiene intacto tu efecto original
      // ---------------------------------------------------------
      crearBarajaInteractiva({
        containerId: "#carousel-container-5",
        cardClass: ".cinema-card",
        unit: "%",
        offsetY: "0px",
        stackBase: 285,   
        stackGap: 15,
        spreadBase: 0,
        spreadGap: 55,   
        scaleDrop: 0.05
      });
    }
  }

// =========================================================
  // SECCIÓN 7 (PHOTOGRAPHER) - LÓGICA DIVIDIDA (Móvil vs PC)
  // =========================================================
  const container7 = document.querySelector("#carousel-container-7");
  if (container7) {
    if (window.innerWidth < 768) {
      // ---------------------------------------------------------
      // LÓGICA MÓVIL: Transición lenta con apilamiento a ambos lados
      // ---------------------------------------------------------
      const cards7 = container7.querySelectorAll(".carousel-card-7");
      let currentIndex7 = 0;
      
      container7.style.touchAction = 'pan-y'; // Prevenir recargas al deslizar

const updateMobileDeck7 = () => {
        cards7.forEach((card, i) => {
          // =========================================================
          // ¡MAGIA DE PROPORCIÓN UNIFORME!
          // =========================================================
          card.style.width = "60vw"; 
          card.style.aspectRatio = "3/4"; // Obliga a todas a ser rectángulos verticales idénticos
          card.style.height = "auto"; 
          card.style.maxHeight = "50vh"; // Límite para que no se salgan de la pantalla
          card.style.objectFit = "cover"; // Centra y recorta lo que sobra sin deformar
          card.style.borderRadius = "8px"; 
          card.style.top = "50%"; 
          
          // Animación suave de 0.8s
          card.style.transition = "all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)";
          card.style.transformOrigin = "center center";
          
          if (i < currentIndex7) {
            // Cartas anteriores: Apiladas a la IZQUIERDA
            const distance = currentIndex7 - i; 
            const offset = distance * -10; 
            const scaleDrop = distance * 0.05; 
            
            card.style.left = "50%";
            card.style.transform = `translate(calc(-50% + ${offset}vw), -50%) scale(${1 - scaleDrop})`;
            card.style.opacity = "1"; 
            card.style.zIndex = 10 - distance; 
            
          } else if (i === currentIndex7) {
            // Carta actual: Protagonista en el CENTRO
            card.style.left = "50%";
            card.style.transform = "translate(-50%, -50%) scale(1)";
            card.style.opacity = "1";
            card.style.zIndex = 10;
            
          } else {
            // Cartas futuras: Apiladas a la DERECHA
            const distance = i - currentIndex7;
            const offset = distance * 10; 
            const scaleDrop = distance * 0.05; 
            
            card.style.left = "50%";
            card.style.transform = `translate(calc(-50% + ${offset}vw), -50%) scale(${1 - scaleDrop})`;
            card.style.opacity = "1";
            card.style.zIndex = 10 - distance;
          }
        });
      };

      updateMobileDeck7();

      // Avanzar con clic
      container7.addEventListener("click", () => {
        if (currentIndex7 < cards7.length - 1) currentIndex7++;
        else currentIndex7 = 0; 
        updateMobileDeck7();
      });

      // Avanzar deslizando el dedo (Swipe)
      let startX7 = 0;
      container7.addEventListener("touchstart", (e) => {
        startX7 = e.touches[0].clientX;
      }, { passive: true });
      
      container7.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX7 - endX > 40 && currentIndex7 < cards7.length - 1) {
          currentIndex7++; 
          updateMobileDeck7();
        } else if (endX - startX7 > 40 && currentIndex7 > 0) {
          currentIndex7--; 
          updateMobileDeck7();
        }
      }, { passive: true });

    } else {
      // ---------------------------------------------------------
      // LÓGICA PC: Se mantiene intacto tu efecto original
      // ---------------------------------------------------------
      crearBarajaInteractiva({
        containerId: "#carousel-container-7",
        cardClass: ".carousel-card-7",
        unit: "%",
        offsetY: "0px",
        stackBase: 200,
        stackGap: 13,
        spreadBase: 0,
        spreadGap: 16,
        scaleDrop: 0.04
      });
    }
  }

});