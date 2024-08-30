document.querySelectorAll(".a-item").forEach((aItemElement, index) => {
  aItemElement.setAttribute("data-project-item", index);
});

// ————— ACCORDEONS
let firstClickFired = false;
document.querySelectorAll(".a-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (link.parentElement.classList.contains("is--active")) {
      return;
    }
    if (firstClickFired) {
      const activeAccordeon = document.querySelector(".a-item.is--active");
      const activeLink = activeAccordeon.querySelector(".a-link");
      const activeTimeline = activeLink.AccordeonTimeline;

      activeTimeline.timeScale(1.6).reverse();
      activeAccordeon.classList.remove("is--active");

      const aParent = link.parentElement;
      aParent.classList.add("is--active");

      setTimeout(() => {
        proceedWithClick(link);
      }, 650);
    } else {
      proceedWithClick(link);
    }
  });
});

function proceedWithClick(link) {
  let AccordeonTimeline = link.AccordeonTimeline;
  lenis.scrollTo(link)

  if (!AccordeonTimeline) {
    let parent = link.parentElement;
    let content = link.nextElementSibling;
    let bg = link.previousElementSibling;
    let linkText = link.querySelectorAll(".p-large");
    let description = parent.querySelectorAll(".line");
    let button = parent.querySelector(".button");
    let slides = parent.querySelectorAll(".slide-img__wrapper");
    let images = parent.querySelectorAll(".slide-img");
    let slider = parent.querySelector(".slider-container");

    AccordeonTimeline = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.8 },
      paused: true,
      reversed: true,
      onComplete: () => {
        ScrollTrigger.refresh();
      },
      onReverseComplete: () => {
        ScrollTrigger.refresh();
      },
    });

    AccordeonTimeline.fromTo(
      content,
      { height: "0px" },
      { height: "auto", duration: 1 },
    )
      .to(
        bg,
        {
          height: "100%",
          duration: 0.75,
          onStart: () => {
            gsap.fromTo(
              slides,
              {
                scale: 0.5,
              },
              {
                scale: 1,
                duration: 1,
                stagger: { each: 0.05, from: "end" },
              },
            );
            gsap.fromTo(
              images,
              {
                scale: 1.5,
              },
              {
                scale: 1,
                duration: 1,
                stagger: { each: 0.05, from: "end" },
              },
            );
            gsap.fromTo(
              slider,
              {
                xPercent: -180,
              },
              {
                xPercent: 0,
                duration: 1,
              },
            );
          },
        },
        0,
      )
      .to(
        linkText,
        {
          color: "#f1f1e7",
          duration: 0.2,
        },
        0.4,
      )
      .from(
        description,
        {
          yPercent: 60,
          opacity: 0,
          stagger: { each: 0.05 },
        },
        0.25,
      )
      .from(
        button,
        {
          yPercent: 60,
          opacity: 0,
        },
        "<",
      );

    link.AccordeonTimeline = AccordeonTimeline;
  }

  AccordeonTimeline.reversed()
    ? AccordeonTimeline.timeScale(1).play()
    : AccordeonTimeline.timeScale(1.3).reverse();
}

window.addEventListener("DOMContentLoaded", () => {
  let firstLink = document.querySelector(".a-link");
  gsap.delayedCall(1000, ScrollTrigger.refresh());

  if(firstLink){
    firstLink.click();
    firstLink.parentElement.classList.add("is--active");
    firstClickFired = true;
  }
});
