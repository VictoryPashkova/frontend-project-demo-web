import { gsap, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const setupBackgroundAnimation = (sections) => {
  sections.forEach((section) => {
    const colorAttr = section.getAttribute('data-color');
    if (colorAttr) {
      gsap.to('body', {
        backgroundColor: colorAttr,
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          scrub: 3,
          start: 'top bottom',
          end: '+=10%'
        }
      });
    }
  });
};

const setupPageElScrollAnimation = () => {

  gsap.utils.toArray('section *:not(.no-animation)').forEach((element) => {
    gsap.fromTo(element, 
      { opacity: 0.5, y: 50 },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.5, 
        ease: 'power2.out', 
        scrollTrigger: {
          trigger: element,
          start: 'top 150%',
          end: 'bottom 100%',
          scrub: 1,
          toggleActions: 'play pause resume reverse',
          markers: false
        }
      }
    );
  });
};

const setupInitialAnimation = () => {
  gsap.utils.toArray('.Title *').forEach((element) => {

    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.2
      }
    );
  });
};

export { setupBackgroundAnimation, setupPageElScrollAnimation, setupInitialAnimation };
