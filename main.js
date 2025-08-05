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
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) {
        console.error('Slider container tidak ditemukan.');
        return;
    }}

    const images = document.querySelectorAll('.slider-image');
    if (images.length === 0) {
        console.error('Gambar slider tidak ditemukan.');
        return;
    }

    const totalImages = images.length; // Total 3 gambar
    const transitionDuration = 600; // Durasi transisi dalam ms
    let currentIndex = 0;

    function slideNext() {
        currentIndex++;
        sliderContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
        sliderContainer.style.transform = `translateX(-${currentIndex * (100 / totalImages)}%)`;

        // Reset ke posisi awal tanpa transisi saat mencapai gambar terakhir
        if (currentIndex === totalImages) {
            setTimeout(() => {
                sliderContainer.style.transition = 'none';
                currentIndex = 0;
                sliderContainer.style.transform = `translateX(0%)`;
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        sliderContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
                    }, 50);
                });
            }, transitionDuration);
        }
    }

    // Ganti gambar setiap 5 detik
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
