
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    if (hamburger && menu) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    // Slider functionality
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) {
        console.error('Slider container tidak ditemukan.');
        return;
    }

    const images = document.querySelectorAll('.slider-image');
    if (images.length === 0) {
        console.error('Gambar slider tidak ditemukan.');
        return;
    }

    const totalImages = images.length;
    const transitionDuration = 300;
    let currentIndex = 0;
    let slideInterval;

    function updateSlider() {
        sliderContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function slideNext() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateSlider();
    }

    function startSlider() {
        slideInterval = setInterval(slideNext, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Initialize slider
    startSlider();

    // Pause on hover
    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);

    // Pause when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });
});