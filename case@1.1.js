const vimeoPlayers = {};

function initVideos() {
  let vids = document.querySelectorAll("[data-vimeo-player-target]");
  vids.forEach((vid, index) => {
    let videoIndexID = "vimeo-player-index-" + index;
    vid.id = videoIndexID;

    const player = new Vimeo.Player(vid);

    vimeoPlayers[videoIndexID] = player;

    player.on("play", () => {
      vid.setAttribute("data-vimeo-status-loaded", "true");
    });

    if (vid.getAttribute("data-vimeo-player-autoplay") === "false") {
      player.setVolume(1);
      player.pause();
    } else {
      player.setVolume(0);
      vid.setAttribute("data-vimeo-status-muted", "true");
      if (vid.getAttribute("data-vimeo-status-paused-by-user") === "false") {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: vid,
            start: "0% 100%",
            end: "100% 0%",
            toggleActions: "play none none none",
            markers: false,
            onEnter: () => vimeoPlayerPlay(vid, player),
            onLeave: () => vimeoPlayerPause(vid, player),
            onEnterBack: () => vimeoPlayerPlay(vid, player),
            onLeaveBack: () => vimeoPlayerPause(vid, player),
          },
        });
      }
    }

    // Control event bindings
    vid.querySelectorAll('[data-vimeo-control="play"]').forEach((button) => {
      button.addEventListener("click", () => {
        if (vid.getAttribute("data-vimeo-status-muted") === "true") {
          player.setVolume(0);
        } else {
          player.setVolume(1);
        }
        vimeoPlayerPlay(vid, player);
      });
    });

    vid.querySelectorAll('[data-vimeo-control="pause"]').forEach((button) => {
      button.addEventListener("click", () => {
        vimeoPlayerPause(vid, player);
        if (vid.getAttribute("data-vimeo-player-autoplay") === "true") {
          vid.setAttribute("data-vimeo-status-paused-by-user", "true");
          if (tl) tl.kill();
        }
      });
    });

    // Duration and timeline updates
    player.getDuration().then((duration) => {
      const formatDuration = secondsTimeSpanToHMS(duration);
      const vimeoDuration = vid.querySelector(".vimeo-duration .duration");
      if (vimeoDuration) {
        vimeoDuration.textContent = formatDuration;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.max = duration;
        });
    });

    // Timeline
    vid
      .querySelectorAll('[data-vimeo-control="timeline"]')
      .forEach((timeline) => {
        timeline.addEventListener("input", function () {
          player.setCurrentTime(parseFloat(timeline.value));
          const progress = vid.querySelector("progress");
          if (progress) {
            progress.value = timeline.value;
          }
        });
      });

    // Progress Time & Timeline
    player.on("timeupdate", function (data) {
      const timeUpdate = secondsTimeSpanToHMS(Math.trunc(data.seconds));
      const vimeoTime = vid.querySelector(".vimeo-duration .time");
      if (vimeoTime) {
        vimeoTime.textContent = timeUpdate;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.value = data.seconds;
        });
    });

    // Remove Controls after hover
    let vimeoHoverTimer;
    document.addEventListener("mousemove", function () {
      clearTimeout(vimeoHoverTimer);
      vid.setAttribute("data-vimeo-status-hover", "true");
      vimeoHoverTimer = setTimeout(() => {
        vid.setAttribute("data-vimeo-status-hover", "false");
      }, 3000);
    });

    // Time update handling
    player.on("timeupdate", (data) => {
      const formattedTime = secondsTimeSpanToHMS(Math.trunc(data.seconds));
      const vimeoTime = vid.querySelector(".vimeo-duration .time");
      if (vimeoTime) {
        vimeoTime.textContent = formattedTime;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.value = data.seconds;
        });
    });

    // Listen for ended event
    player.on("ended", () => {
      vid.setAttribute("data-vimeo-status-activated", "false");
      vid.setAttribute("data-vimeo-status-play", "false");
      player.unload();
    });
  });
}

function vimeoPlayerPlay(vid, player) {
  vid.setAttribute("data-vimeo-status-activated", "true");
  vid.setAttribute("data-vimeo-status-play", "true");
  player.play();
}

function vimeoPlayerPause(vid, player) {
  vid.setAttribute("data-vimeo-status-play", "false");
  player.pause();
}

function secondsTimeSpanToHMS(s) {
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return m + ":" + (s < 10 ? "0" + s : s);
}

function initReels() {
  let reelsWrap = document.querySelector(".swiper.is--reels");
  if (!reelsWrap) return;
  
  let textBox = document.querySelector("[data-reel-wrap]")
  let items = textBox.querySelectorAll("[data-reel-content]")
  let dot = textBox.querySelector("[data-reel-dot]")
  
  let tl = gsap.timeline({
    defaults:{
      ease:"power3.inOut",
      duration: 0.8
    },
    scrollTrigger:{
      trigger: textBox,
      start:"top 80%",
      once: true,
    }
  })
  tl.from(textBox,{clipPath:"inset(90% 90% 0px 0px round 2rem)", duration:1.2})
  .from(items,{y:"2rem",autoAlpha:0,stagger: 0.06}, 0.6)
  .from(dot,{scale: 0},"<+=0.1")

  let slideWidth = reelsWrap.querySelector(".swiper-slide").offsetWidth;

  let reelSlider = new Swiper(".swiper.is--reels", {
    grabCursor: true,
    loop:true,
    slidesPerView: 1.5,
    spaceBetween: 0,
    speed: 600,
    observer: true,
    observeParents: true,
    effect: "creative",
    slidesOffsetAfter: slideWidth + slideWidth,
    breakpoints: {
      480: {
        slidesPerView: 3,
      },
    },
    navigation: {
      prevEl: "[data-reels-prev]",
      nextEl: "[data-reels-next]",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    mousewheel: {
      invert: false,
      forceToAxis: true,
    },
    creativeEffect: {
      prev: {
        shadow: false,
        translate: [-50, 0, -120],
        rotate: [0, 0, -0.5],
      },
      next: {
        translate: ["105%", 0, 1],
      },
      limitProgress: 5,
      shadowPerProgress: false,
    },
  });
}

function initVideoSlider() {
  let videoWrap = document.querySelector(".swiper.is--vids");
  if (!videoWrap) return;

  let vidSlider = new Swiper(videoWrap, {
    grabCursor: true,
    slidesPerView: 1.4,
    spaceBetween: 24,
    speed: 800,
    centerInsufficientSlides: true,
    centeredSlides: true,
    slideToClickedSlide: true,
    loop: true,
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    mousewheel: {
      invert: false,
      forceToAxis: true,
    },
  });
}

function initResultSlider() {
  let resultWrap = document.querySelector(".swiper.is--results");
  if (!resultWrap) return;

  let resultSlider = new Swiper(resultWrap, {
    grabCursor: true,
    slidesPerView: "auto",
    spaceBetween: 20,
    speed: 600,
    slideToClickedSlide: true,
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    mousewheel: {
      invert: false,
      forceToAxis: true,
    },
    navigation: {
      prevEl: "[data-results-prev]",
      nextEl: "[data-results-next]",
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initVideos();
  initReels();
  initVideoSlider();
  initResultSlider();
});
