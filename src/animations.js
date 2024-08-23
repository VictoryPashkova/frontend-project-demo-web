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

const horizontalLoop = (items, config) => {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}}),
      length = items.length,
      startX = items[0].offsetLeft,
      times = [],
      widths = [],
      xPercents = [],
      curIndex = 0,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
      totalWidth, curX, distanceToStart, distanceToLoop, item, i;

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
      xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
      return xPercents[i];
    }
  });
  
  gsap.set(items, {x: 0});
  totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = xPercents[i] / 100 * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
      .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  
  const toIndex = (index, vars) => {
    vars = vars || {};
    (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = vars => toIndex(curIndex+1, vars);
  tl.previous = vars => toIndex(curIndex-1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
};

const runScrollingMarqueeText = () => {
  gsap.utils.toArray('.How-works__content-container__animated-text__item').forEach((item) => {
    const texts = item.querySelectorAll("h1"),
          tl = horizontalLoop(texts, {
            repeat: -1, 
            speed: 1,
            reversed: false,
            paddingRight: parseFloat(gsap.getProperty(texts[0], "marginRight", "px")) || 0
          });
  
    texts.forEach(text => {
      text.addEventListener("mouseenter", () => gsap.to(tl, {timeScale: 0, overwrite: true}));
      text.addEventListener("mouseleave", () => gsap.to(tl, {timeScale: 1, overwrite: true}));
    });
  });
};

export {
  setupBackgroundAnimation,
  setupPageElScrollAnimation,
  setupInitialAnimation,
  runScrollingMarqueeText,
};
