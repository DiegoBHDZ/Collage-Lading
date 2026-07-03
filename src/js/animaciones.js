document.addEventListener("DOMContentLoaded", () => {
  // === SELECTORES ===
  const section4 = document.getElementById("section-4");
  const cards4 = section4 ? section4.querySelectorAll(".carousel-card") : [];

  const section7 = document.getElementById("section-7");
  const cards7 = section7 ? section7.querySelectorAll(".carousel-card-7") : [];

  const section5 = document.getElementById("section-5");
  const cinemaCards = section5 ? section5.querySelectorAll(".cinema-card") : [];

  // === MOTOR DE SCROLL ÚNICO ===
  // Manejar el scroll en un solo listener mejora drásticamente el rendimiento
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;

    // ---------------------------------------------------
    // LÓGICA SECCIÓN 4 (Mazo de cartas apiladas)
    // ---------------------------------------------------
    if (section4) {
      const rect4 = section4.getBoundingClientRect();
      let progress4 = -rect4.top / (rect4.height - windowHeight);
      progress4 = Math.max(0, Math.min(1, progress4)); 

      cards4.forEach((card, index) => {
        const isMobile = window.innerWidth < 768;
        
        const startX = 75; 
        const gap = isMobile ? 12 : 8; 
        const margin = isMobile ? 5 : 10; 
        const endX = margin + (index * gap);
        
        const duration = 0.4; 
        const stagger = 0.2;  
        
        const cardStart = index * stagger;
        const cardEnd = cardStart + duration;
        
        let cardProgress = (progress4 - cardStart) / (cardEnd - cardStart);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        
        const easeProgress = cardProgress < 0.5
          ? 2 * cardProgress * cardProgress
          : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;
            
        const currentX = startX - (easeProgress * (startX - endX));
        
        // Requiere VW y centrado en Y (-50%)
        card.style.transform = `translate(${currentX}vw, -50%)`;
      });
    }

    // ---------------------------------------------------
    // LÓGICA SECCIÓN 7 (6 tarjetas estilo Sec 4)
    // ---------------------------------------------------
    if (section7) {
      const rect7 = section7.getBoundingClientRect();
      let progress7 = -rect7.top / (rect7.height - windowHeight);
      progress7 = Math.max(0, Math.min(1, progress7));

      cards7.forEach((card, index) => {
        const isMobile = window.innerWidth < 768;

        const startX = isMobile ? 54 : 58;
        const gap = isMobile ? 12 : 6;
        const margin = isMobile ? 5 : 8;
        const endX = margin + (index * gap);

        const duration = 0.3;
        const stagger = 0.14;

        const cardStart = index * stagger;
        const cardEnd = cardStart + duration;

        let cardProgress = (progress7 - cardStart) / (cardEnd - cardStart);
        cardProgress = Math.max(0, Math.min(1, cardProgress));

        const easeProgress = cardProgress < 0.5
          ? 2 * cardProgress * cardProgress
          : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;

        const currentX = startX - (easeProgress * (startX - endX));

        card.style.transform = `translateX(${currentX}vw)`;
      });
    }

// ---------------------------------------------------
    // LÓGICA SECCIÓN 5 (Feed de Cinema continuo)
    // ---------------------------------------------------
    if (section5) {
      const rect5 = section5.getBoundingClientRect();
      let progress5 = -rect5.top / (rect5.height - windowHeight);
      progress5 = Math.max(0, Math.min(1, progress5)); 

      cinemaCards.forEach((card, index) => {
        
        // startX: 300% las apila a todas en la 4ta posición visible (lado derecho del contenedor)
        const startX = 300; 
        
        // endX: Frena cada tarjeta en su posición exacta (0%, 100%, 200%, 300%)
        const endX = index * 100;
        
        const duration = 0.4; 
        const stagger = 0.15;
        
        const cardStart = index * stagger;
        const cardEnd = cardStart + duration;
        
        let cardProgress = (progress5 - cardStart) / (cardEnd - cardStart);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        
        const easeProgress = cardProgress < 0.5
          ? 2 * cardProgress * cardProgress
          : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;
            
        const currentX = startX - (easeProgress * (startX - endX));
        
        card.style.transform = `translateX(${currentX}%)`;
      });
    }    
  });

  // Forzar un evento de scroll al cargar para inicializar las posiciones
  window.dispatchEvent(new Event('scroll'));
});