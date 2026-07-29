document.addEventListener("DOMContentLoaded", () => {
  // === SELECTORES ===
  const section4 = document.getElementById("section-4");
  
  // Carrusel 4 (Desktop)
  const carouselContainer4 = document.getElementById("carousel-container-4");
  const cards4 = carouselContainer4 ? carouselContainer4.querySelectorAll(".carousel-card") : [];
  
  // Carrusel 4 (Mobile)
  const carouselContainer4Mobile = document.getElementById("carousel-container-4-mobile");
  const cards4Mobile = carouselContainer4Mobile ? carouselContainer4Mobile.querySelectorAll(".carousel-card-mobile") : [];

  const section5 = document.getElementById("section-5");
  const carouselContainer5 = document.getElementById("carousel-container-5");
  const cards5 = section5 ? section5.querySelectorAll(".cinema-card") : [];

  const section7 = document.getElementById("section-7");
  const carouselContainer7 = document.getElementById("carousel-container-7");
  const cards7 = section7 ? section7.querySelectorAll(".carousel-card-7") : [];


  // =========================================================
  // MOTOR LÓGICO SECCIÓN 4 
  // =========================================================
  if (section4 && (cards4.length > 0 || cards4Mobile.length > 0)) {
    let progress4 = 0;       
    let targetProgress4 = 0; 
    let isAnimating4 = false;
    let isFocused4 = false;

    const renderSection4 = () => {
      // 1. Renderizar Cartas Desktop (Lógica original intacta)
      cards4.forEach((card, index) => {
        const startX = 75; 
        const gap = 8; 
        const margin = 10; 
        const endX = margin + (index * gap);
        const duration = 0.4; 
        const stagger = 0.2;  
        
        const cardStart = index * stagger;
        const cardEnd = cardStart + duration;
        
        let cardProgress = (progress4 - cardStart) / (cardEnd - cardStart);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        const easeProgress = cardProgress < 0.5 ? 2 * cardProgress * cardProgress : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;
        const currentX = startX - (easeProgress * (startX - endX));
        
        card.style.transform = `translate(${currentX}vw, -50%)`;
      });


      // 2. Renderizar Cartas Mobile (Alineadas a la derecha)
// 2. Renderizar Cartas Mobile (Adaptadas al celular - Efecto Baraja/Abanico)
      cards4Mobile.forEach((card, index) => {
        // Valores Iniciales (Cartas apiladas a la derecha)
        const startX = 0;
        const startY = 0;
        const startScale = 1;
        const startRotate = 0;

        // Valores Finales (Cartas expandidas)
        // 1. Reducimos el gap horizontal a 8vw para que NUNCA desborden la pantalla
        const endX = -(index * 8); 
        // 2. Agregamos un ligero escalón hacia abajo por carta (2vw)
        const endY = (index * 2); 
        // 3. Las cartas de más atrás se hacen ligeramente más chicas (4% menos cada una)
        const endScale = 1 - (index * 0.04); 
        // 4. Ligera rotación para dar un efecto de "abanico" (-3 grados por carta)
        const endRotate = -(index * 3); 

        const duration = 0.4; 
        const stagger = 0.2;  
        
        const cardStart = index * stagger;
        const cardEnd = cardStart + duration;
        
        let cardProgress = (progress4 - cardStart) / (cardEnd - cardStart);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        
        // Suavizado (Easing) original
        const easeProgress = cardProgress < 0.5 ? 2 * cardProgress * cardProgress : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;
        
        // Calculamos la posición geométrica exacta en este cuadro de la animación
        const currentX = startX + (easeProgress * endX);
        const currentY = startY + (easeProgress * endY);
        const currentScale = startScale + (easeProgress * (endScale - startScale));
        const currentRotate = startRotate + (easeProgress * endRotate);
        
        // Aplicamos todas las transformaciones CSS juntas para la magia 3D
        card.style.transform = `translateX(${currentX}vw) translateY(${currentY}vw) scale(${currentScale}) rotate(${currentRotate}deg)`;
      });
    };

    const smoothAnimate4 = () => {
      progress4 += (targetProgress4 - progress4) * 0.08;
      if (Math.abs(targetProgress4 - progress4) < 0.001) {
        progress4 = targetProgress4;
        renderSection4();
        isAnimating4 = false;
        return;
      }
      renderSection4();
      requestAnimationFrame(smoothAnimate4);
    };

    // Eventos para Desktop
    if (carouselContainer4) {
      carouselContainer4.addEventListener("click", (e) => {
        isFocused4 = true;
        e.stopPropagation();
      });
    }

    // Eventos para Mobile (MAGIA TÁCTIL)
    if (carouselContainer4Mobile) {
      carouselContainer4Mobile.addEventListener("click", (e) => {
        isFocused4 = true;
        e.stopPropagation();
        
        // Al tocar el carrusel en celular, la animación avanza. 
        // Si llega al final (0.9), se reinicia a 0.
        targetProgress4 = targetProgress4 >= 0.9 ? 0 : targetProgress4 + 0.34;
        if (!isAnimating4) { isAnimating4 = true; smoothAnimate4(); }
      });
    }

    document.addEventListener("click", (e) => {
      const clickedDesktop = carouselContainer4 && carouselContainer4.contains(e.target);
      const clickedMobile = carouselContainer4Mobile && carouselContainer4Mobile.contains(e.target);

      // Si tocas fuera del carrusel, las cartas se vuelven a apilar
      if (!clickedDesktop && !clickedMobile) {
        isFocused4 = false;
        targetProgress4 = 0; 
        if (!isAnimating4) { isAnimating4 = true; smoothAnimate4(); }
      }
    });
    

    document.addEventListener("keydown", (e) => {
      if (isFocused4) {
        if (e.key === "ArrowRight") {
          targetProgress4 = Math.max(0, targetProgress4 - 0.34); 
          e.preventDefault(); 
        } else if (e.key === "ArrowLeft") {
          targetProgress4 = Math.min(1, targetProgress4 + 0.34); 
          e.preventDefault(); 
        }
        if (!isAnimating4) { isAnimating4 = true; smoothAnimate4(); }
      }
    });

    renderSection4();
  }
  // =========================================================
  // MOTOR LÓGICO SECCIÓN 5
  // =========================================================
  if (section5 && cards5.length > 0 && carouselContainer5) {
    let progress5 = 0;       
    let targetProgress5 = 0; 
    let isAnimating5 = false;
    let isFocused5 = false;

    const renderSection5 = () => {
      cards5.forEach((card, index) => {
        const startX = 300; 
        const endX = index * 100;
        const duration = 0.4; 
        const stagger = 0.15;
        
        const cardStart = index * stagger;
        const cardEnd = cardStart + duration;
        
        let cardProgress = (progress5 - cardStart) / (cardEnd - cardStart);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        const easeProgress = cardProgress < 0.5 ? 2 * cardProgress * cardProgress : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;
        const currentX = startX - (easeProgress * (startX - endX));
        card.style.transform = `translateX(${currentX}%)`;
      });
    };

    const smoothAnimate5 = () => {
      progress5 += (targetProgress5 - progress5) * 0.08;
      if (Math.abs(targetProgress5 - progress5) < 0.001) {
        progress5 = targetProgress5;
        renderSection5();
        isAnimating5 = false;
        return;
      }
      renderSection5();
      requestAnimationFrame(smoothAnimate5);
    };

    carouselContainer5.addEventListener("click", (e) => {
      isFocused5 = true;
      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      if (!carouselContainer5.contains(e.target)) {
        isFocused5 = false;
        targetProgress5 = 0;
        if (!isAnimating5) { isAnimating5 = true; smoothAnimate5(); }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (isFocused5) {
        if (e.key === "ArrowRight") {
          targetProgress5 = Math.max(0, targetProgress5 - 0.34); 
          e.preventDefault(); 
        } else if (e.key === "ArrowLeft") {
          targetProgress5 = Math.min(1, targetProgress5 + 0.34); 
          e.preventDefault(); 
        }
        if (!isAnimating5) { isAnimating5 = true; smoothAnimate5(); }
      }
    });

    renderSection5();
  }

  // =========================================================
  // MOTOR LÓGICO SECCIÓN 7
  // =========================================================
  if (section7 && cards7.length > 0 && carouselContainer7) {
    let progress7 = 0;       
    let targetProgress7 = 0; 
    let isAnimating7 = false;
    let isFocused7 = false;

    const renderSection7 = () => {
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
        const easeProgress = cardProgress < 0.5 ? 2 * cardProgress * cardProgress : 1 - Math.pow(-2 * cardProgress + 2, 2) / 2;
        const currentX = startX - (easeProgress * (startX - endX));
        card.style.transform = `translateX(${currentX}vw)`;
      });
    };

    const smoothAnimate7 = () => {
      progress7 += (targetProgress7 - progress7) * 0.08;
      if (Math.abs(targetProgress7 - progress7) < 0.001) {
        progress7 = targetProgress7;
        renderSection7();
        isAnimating7 = false;
        return;
      }
      renderSection7();
      requestAnimationFrame(smoothAnimate7);
    };

    carouselContainer7.addEventListener("click", (e) => {
      isFocused7 = true;
      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      if (!carouselContainer7.contains(e.target)) {
        isFocused7 = false;
        targetProgress7 = 0;
        if (!isAnimating7) { isAnimating7 = true; smoothAnimate7(); }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (isFocused7) {
        if (e.key === "ArrowRight") {
          // La sección 7 tiene 6 tarjetas, por lo que avanzamos en pasos más cortos (0.20)
          targetProgress7 = Math.max(0, targetProgress7 - 0.20); 
          e.preventDefault(); 
        } else if (e.key === "ArrowLeft") {
          targetProgress7 = Math.min(1, targetProgress7 + 0.20); 
          e.preventDefault(); 
        }
        if (!isAnimating7) { isAnimating7 = true; smoothAnimate7(); }
      }
    });

    renderSection7();
  }
});