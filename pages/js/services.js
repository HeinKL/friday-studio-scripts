document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(hover: none)").matches) return;
  
  let cursorItem = document.querySelector(".cursor");
  let targets = document.querySelectorAll(".package-div");

  gsap.set(cursorItem, { opacity: 0, xPercent: 6, yPercent: 140 });

  let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
  let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });

  window.addEventListener("mousemove", e => {
    let scrollY = window.scrollY;
    let cursorX = e.clientX;
    let cursorY = e.clientY + scrollY;

    let xPercent = cursorX > window.innerWidth * 0.81 ? -100 : 6;
    let yPercent = cursorY > scrollY + window.innerHeight * 0.9 ? -120 : 140;

    gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "power3" });
    xTo(cursorX);
    yTo(cursorY - scrollY);
  });

  targets.forEach(target => {
    target.addEventListener("mouseenter", () => {
      gsap.killTweensOf(cursorItem, "opacity");
      gsap.to(cursorItem, { opacity: 1, duration: 0.3, ease: "power2.out" });
    });

    target.addEventListener("mouseout", e => {
      if (!target.contains(e.relatedTarget)) {
        gsap.killTweensOf(cursorItem, "opacity");
        gsap.to(cursorItem, { opacity: 0, duration: 0.2, ease: "power2.in" });
      }
    });
  });

});