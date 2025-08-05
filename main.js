document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            menu.classList.toggle('active');
            hamburger.classList.toggle('active');
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

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

    function updateSlider() {
        sliderContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function slideNext() {
        console.log(`Berpindah ke gambar indeks: ${currentIndex}`);
        currentIndex++;
        if (currentIndex >= totalImages) {
            currentIndex = 0;
            sliderContainer.style.transition = 'none';
            sliderContainer.style.transform = `translateX(0%)`;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    sliderContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
                    updateSlider();
                }, 50);
            });
        } else {
            updateSlider();
        }
    }

    // Ganti gambar setiap 5 detik secara otomatis
    let slideInterval = setInterval(slideNext, 5000);

    // Jeda slideshow saat hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(slideNext, 5000);
    });

    // Jeda saat halaman tidak aktif
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            slideInterval = setInterval(slideNext, 5000);
        }
    });
});