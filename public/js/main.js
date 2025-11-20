// Auto slider
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  if (slides.length <= 1) return;
  
  let current = 0;
  const next = () => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  };
  setInterval(next, 6000);
});