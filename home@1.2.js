function animateHeroWrap(heroWrap) {
  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: "expo.out" },
  });

  const heroes = heroWrap.querySelectorAll(".h-hero");
  heroes.forEach((hero, index) => {
    for (let i = 0; i < 7; i++) {
      tl.to(
        heroes[(index + i) % heroes.length].querySelectorAll(".char"),
        {
          yPercent: -122 * (i + 1),
          opacity: 1,
          duration: 1,
          stagger: { each: 0.025, from: "center" },
          ease: "expo.out",
        },
        3 * i
      );

      tl.fromTo(
        heroes[(index + i + 1) % heroes.length].querySelectorAll(".char"),
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.6,
          stagger: { each: 0.025, from: "center" },
          ease: "expo.out",
        },
        3 * i
      );
    }
  });

  tl.set(
    heroWrap.querySelectorAll(".h-hero .char"),
    { yPercent: 0, opacity: 1 },
    21
  );
  return tl;
}
function initTestimonials() {
  if (window.innerWidth > 991) {
    textSlider = new Swiper(".swiper.t-text__wrap", {
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 600,
      loop: true,
      allowTouchMove: false,
    });

    imgSlider = new Swiper(".swiper.is--t__img", {
      effect: "creative",
      creativeEffect: {
        prev: {
          shadow: false,
          translate: [0, 0, -400],
        },
        next: {
          translate: ["100%", 0, 0],
        },
      },
      speed: 600,
      loop: true,
      allowTouchMove: false,
      navigation: {
        prevEl: "[data-t-prev]",
        nextEl: "[data-t-next]",
      },
      controller: {
        control: textSlider,
      },
    });
  } else {
    textSlider = new Swiper(".swiper.t-text__wrap", {
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 600,
      loop: true,
      allowTouchMove: false,
      navigation: {
        prevEl: "[data-t-prev]",
        nextEl: "[data-t-next]",
      },
    });
  }
}
function initHomeLoad() {
  let wrap = document.querySelector(".load-w");
  let bg = wrap.querySelector(".load-bg");
  let logo = wrap.querySelector(".load-logo");
  let topLine = wrap.querySelector(".load-top__line");
  let loadLine = wrap.querySelector(".load-line");
  let loadProgress = wrap.querySelector(".load-progress");
  let loadNr = wrap.querySelector(".load-nr");
  let texts = wrap.querySelectorAll(".eyebrow");

  let counter = { value: 0 };

  function updateLoaderText() {
    let progress = Math.round(counter.value);
    loadNr.innerText = progress;
  }

  let tl = gsap.timeline({
    defaults: {
      ease: "power3.inOut",
      duration: 0.6,
    },
    onComplete: () => {
      lenis.start();
      gsap.set(".page-w", { height: "auto", transform: "unset" });
    },
  });

  tl.to([topLine, loadLine], { scale: 1 })
    .to(loadProgress, { scale: 1, duration: 2, ease: "circ.inOut" }, 0)
    .fromTo(
      texts,
      {
        autoAlpha: 0,
        yPercent: 100,
      },
      {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.05,
        ease: "power3.out",
      },
      0
    )
    .fromTo(
      logo,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        ease: "ease",
      },
      0
    )
    .to(
      counter,
      {
        value: 100,
        onUpdate: updateLoaderText,
        duration: 2,
        ease: "circ.inOut",
      },
      "<"
    )
    .to(".page-w", { y: 0, duration: 0.8, ease: "power4.inOut" })
    .to(
      ".page-w",
      {
        clipPath: "circle(75%)",
        duration: 1.2,
        ease: "expo.inOut",
        onStart: () => {
          gsap.delayedCall(0.65, () => {
            document.querySelectorAll(".hero-title__wrap").forEach((wrap) => {
              animateHeroWrap(wrap);
              ScrollTrigger.refresh();
            });
          });
        },
        onComplete: () => {
          gsap.set(".page-w", { clipPath: "circle(1000%)" });
        },
      },
      ">-=0.1"
    );
}
document.addEventListener("DOMContentLoaded", function () {
  initHomeLoad();
  initTestimonials();
});
