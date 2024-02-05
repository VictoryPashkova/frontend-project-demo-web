document.addEventListener("DOMContentLoaded", () => {
    const slidesContainer = document.querySelector(".slider-items");
    const slides = slidesContainer.querySelectorAll(".slide-item");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const totalSlides = slides.length;
    const dotContainer = document.querySelector(".dots");
  
    let width = 500;
    let animationSpeed = 1200;
    let currentIndex = 0;
    let animationInterval;
    let prevIndex;
    let isAnimating = false;
  
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dotContainer.appendChild(dot);
    }
  
    const dots = document.querySelectorAll(".dot");
    dots[currentIndex].classList.add("current-dot");
  
    slides[0].style.right = 0;
  
    const updateDots = () => {
      dots.forEach((dot, index) => {
        dot.classList.toggle("current-dot", index === currentIndex);
      });

    };
  
    const stopAnimation = () => {
      clearInterval(animationInterval);
    };
  
    const reset = (newIndex) => {
      slides.forEach((slide) => {
        slide.style.right = "";
        slide.style.left = "";
      });
      slides[newIndex].style.right = 0;
    };
  
    const moveSlider = (prevIndex, newIndex, direction) => {
      if (isAnimating) {
        return;
      }
  
      const targetLeft = -width;
      const targetRight = width;
  
      let currentPositionActive = 0;
      let currentPositionNew = -width;
      const framesPerSecond = 60;
      const frameInterval = 1000 / framesPerSecond;
      const totalFrames = animationSpeed / frameInterval;
      let currentFrame = 0;
  
      isAnimating = true;
  
      animationInterval = setInterval(() => {
        if (currentFrame < totalFrames) {
          slides[prevIndex].style[direction] =
            currentPositionActive - (targetLeft / totalFrames) * currentFrame + "px";
          slides[newIndex].style[direction] =
            currentPositionNew + (targetRight / totalFrames) * currentFrame + "px";
          currentFrame++;
          updateDots();
        } else {
          stopAnimation();
          slides[prevIndex].style[direction] = -width + "px";
          slides[newIndex].style[direction] = 0;
          isAnimating = false;
        }
      }, frameInterval);
      reset(newIndex);
    };
  
    prevBtn.addEventListener("click", () => {
      if (isAnimating) {
        return;
      }
      prevIndex = currentIndex;
      currentIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
      moveSlider(prevIndex, currentIndex, "left");
    });
  
    nextBtn.addEventListener("click", () => {
      if (isAnimating) {
        return;
      }
      prevIndex = currentIndex;
      currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
      moveSlider(prevIndex, currentIndex, "right");
    });
  
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        prevIndex = currentIndex;
        currentIndex = index;
        if (prevIndex > currentIndex) {
          moveSlider(prevIndex, currentIndex, "left");
        }
        moveSlider(prevIndex, currentIndex, "right");
      });
    });
  });