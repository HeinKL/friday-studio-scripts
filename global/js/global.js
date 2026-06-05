window.addEventListener('load', () => {
gsap.registerPlugin(ScrollSmoother);
ScrollSmoother.create({
wrapper: '#smooth-wrapper',
content: '#smooth-content',
smooth: 1.5, // seconds to catch up (higher = smoother/slower)
effects: true, // enable data-speed and data-lag attributes
});
});

const menuItems = Array.from(document.querySelectorAll('[menu-link]'));

menuItems.forEach((el) => {
function onEnter() {
menuItems.forEach((other) => {
if (other !== el) {
    gsap.to(other, { filter: 'blur(4px)', opacity: 0.35, duration: 0.3 });
}
});
}

function onLeave() {
menuItems.forEach((other) => {
if (other !== el) {
    gsap.to(other, { filter: 'blur(0px)', opacity: 1, duration: 0.3 });
}
});
}

el.addEventListener('mouseenter', onEnter);
el.addEventListener('mouseleave', onLeave);
});

gsap.to(".phone-img", {
rotation: 5,
duration: 0.12,
repeat: -1,   // -1 = infinite
yoyo: true,   // reverses back and forth
ease: "power1.inOut"
});


function updateTimes() {
const now = new Date();

const aukTime = now.toLocaleTimeString("en-NZ", {
timeZone: "Pacific/Auckland",
hour: "2-digit",
minute: "2-digit",
});

const ygnTime = now.toLocaleTimeString("en-US", {
timeZone: "Asia/Yangon",
hour: "2-digit",
minute: "2-digit",
});

document.querySelectorAll("[data-auk-time]").forEach((el) => {
el.textContent = aukTime;
});

document.querySelectorAll("[data-ygn-time]").forEach((el) => {
el.textContent = ygnTime;
});
}

updateTimes();
setInterval(updateTimes, 1000);