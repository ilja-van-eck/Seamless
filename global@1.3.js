gsap.registerPlugin(ScrollTrigger, Observer, CustomEase, ScrambleTextPlugin);

CustomEase.create(
  "loader",
  "M0,0 C0.02,0.04 0.197,0.202 0.197,0.202 0.197,0.202 0.265,0.203 0.265,0.203 0.265,0.203 0.285,0.388 0.4,0.5 0.429,0.528 0.475,0.51 0.504,0.542 0.57,0.615 0.627,0.815 0.699,0.886 0.847,1.033 0.85,0.98 1,1"
);

// —————  100VH MINUS NAV  —————
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", appHeight);
appHeight();
window.addEventListener("DOMContentLoaded", (event) => {
  appHeight();
});

let firstLoad = true;
let lenis;
let isHome;

const pageElement = document.querySelector(".page-w");
isHome = pageElement && pageElement.getAttribute("data-page") === "home";

if (!sessionStorage.getItem("firstLoad")) {
  sessionStorage.setItem("firstLoad", "false");
  firstLoad = true;
} else {
  firstLoad = false;
}

if (Webflow.env("editor") === undefined) {
  lenis = new Lenis({
    duration: 1.2,
    infinite: false,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (firstLoad && isHome) {
    lenis.stop();
  }

  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  function connectToScrollTrigger() {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  }
  connectToScrollTrigger();
}

// ————— SPLIT TEXT
let splitLetters;
let splitLines;
let splitHeadings;
function runSplit() {
  splitLetters = new SplitType("[data-split-letters]", {
    types: "words, chars",
  });
  splitLines = new SplitType("[data-split-lines]", {
    types: "lines",
  });
  splitHeadings = new SplitType("[data-heading]", {
    types: "lines",
  });
}
runSplit();

// ————— Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    splitLetters.revert();
    splitLines.revert();
    splitHeadings.revert();
    runSplit();
  }
});

let duration = 800;
let exclude = "no-transition";

gsap.fromTo(".transition",{ scaleY: 1,},
  {
    scaleY: 0,
    duration: 0.8,
    ease: "power4.inOut",
    onComplete: () => {
      gsap.set(".transition", { display: "none" });
    },
  }
);
gsap.fromTo(".page-w",{ y: 300,},
  {
    y: 0,
    duration: 0.8,
    ease: "power4.inOut",
    clearProps: "all",
  }
);
gsap.fromTo("[data-load-fade]",{autoAlpha:0,yPercent:25},{autoAlpha:1,yPercent:0,duration:0.8,stagger:0.08,ease:"power3.inOut",delay:0.4,clearProps:"all"})

$("a").on("click", function (e) {
  if (
    $(this).prop("hostname") === window.location.host &&
    $(this).attr("href").indexOf("#") === -1 &&
    !$(this).hasClass(exclude) &&
    $(this).attr("target") !== "_blank"
  ) {
    e.preventDefault();
    let transitionURL = $(this).attr("href");
    gsap.set(".transition", {
      display: "block",
      transformOrigin: "center bottom",
    });
    gsap.fromTo(
      ".transition",
      {
        scaleY: 0,
      },
      {
        scaleY: 1,
        duration: 0.8,
        ease: "power4.inOut",
      }
    );
    gsap.fromTo(
      ".page-w",
      {
        y: -0,
      },
      {
        y: -300,
        duration: 0.8,
        ease: "power4.inOut",
      }
    );

    setTimeout(function () {
      window.location = transitionURL;
    }, duration);
  }
});

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

function initHeadingIntro() {
  let targets = document.querySelectorAll("[data-heading]");
  if (targets) {
    targets.forEach((target) => {
      gsap.delayedCall(1, () => {
        ScrollTrigger.refresh();
        lenis.resize();
        let lines = target.querySelectorAll(".line");
        gsap.fromTo(
          lines,
          {
            yPercent: 80,
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.05,
            duration: 1.1,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: target,
              start: "top 90%",
            },
          }
        );
      });
    });
  }
}

function initFooterAnimation() {
  const spacer = document.querySelector(".footer-spacer");
  let footer = document.querySelector(".section.is--footer");
  let hLines = footer.querySelectorAll(".h-line");
  let vLine = footer.querySelector(".v-line");
  let textLines = footer.querySelectorAll(".line");

  const footerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: spacer,
      start: "top 70%",
      end: "bottom bottom",
      toggleActions: "play none none none",
    },
  });
  footerTimeline
    .fromTo(
      hLines,
      {
        scaleX: 0,
      },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "expo.out",
        overwrite: true,
        stagger: { each: 0.25, from: "end" },
      }
    )
    .from(vLine, { scaleY: 0, duration: 1.2, ease: "expo.out" }, 0)
    .from(
      textLines,
      {
        yPercent: 50,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power4.out",
      },
      0
    );
}

function initNumbers() {
  const nrWrappers = document.querySelectorAll("[data-nr-wrapper]");
  nrWrappers.forEach((wrapper) => {
    const nrValues = wrapper.querySelectorAll("[data-nr-value]");

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        gsap.to(nrValues, {
          yPercent: (i, el) => -parseInt(el.getAttribute("data-nr-value")) * 10,
          duration: 2,
          ease: "expo.inOut",
          stagger: { each: 0.1 },
          overwrite: "auto",
        });
      },
      onLeaveBack: () => {
        gsap.to(nrValues, {
          yPercent: 0,
          duration: 0.1,
          ease: "ease",
        });
      },
    });
  });
}

function initCursor() {
  let cursorTl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.inOut",
      duration: 0.5,
    },
    onReverseComplete: () => {
      gsap.set(".cursor-text", { display: "none" });
    },
  });

  let cursorTriggers = document.querySelectorAll("[data-cursor]");
  if (cursorTriggers) {
    cursorTriggers.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        let cursorTextValue = element.getAttribute("data-cursor-text");
        let matchingCursorText = document.querySelector(
          `.cursor-text[data-cursor-text="${cursorTextValue}"]`
        );
        let matchingCursorLetters =
          matchingCursorText.querySelectorAll(".char");

        cursorTl.clear();
        cursorTl
          .set(".cursor-w", { display: "flex" })
          .set(matchingCursorText, { display: "block" })
          .fromTo(
            ".cursor-e",
            { width: 0, height: 0 },
            { width: "6rem", height: "6rem" }
          )
          .fromTo(
            matchingCursorLetters,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              stagger: { each: 0.03, from: "center" },
            },
            "<"
          );
        cursorTl.play();
      });

      element.addEventListener("mouseleave", () => {
        cursorTl.reverse();
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initHeadingIntro();
  initFooterAnimation();
  initCursor();
  initNumbers();
});
