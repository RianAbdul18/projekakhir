document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    if (hamburger && menu) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
            
            if (window.innerWidth <= 768) {
                const dropdowns = menu.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.addEventListener('click', (e) => {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    });
                });
            }
        });
    } else {
        console.error('Hamburger atau menu tidak ditemukan.');
    }

    // Slider Functionality
    const sliderContainer = document.querySelector('.slider-container');
    const images = document.querySelectorAll('.slider-image');
    
    if (!sliderContainer || images.length === 0) {
        console.error('Slider container atau gambar tidak ditemukan.');
        return;
    }

    const totalImages = images.length;
    const transitionDuration = 300;
    let currentIndex = 0;
    let slideInterval;

    const updateSlider = () => {
        sliderContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const slideNext = () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateSlider();
    };

    const startSlider = () => {
        slideInterval = setInterval(slideNext, 5000);
    };

    const stopSlider = () => {
        clearInterval(slideInterval);
    };

    // Initialize Slider
    updateSlider();
    startSlider();

    // Slider Controls
    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);

    // Handle Page Visibility
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopSlider() : startSlider();
    });
});
