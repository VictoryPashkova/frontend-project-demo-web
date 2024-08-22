import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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

export { setupBackgroundAnimation };
