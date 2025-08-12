document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    // Navigasi menu Kontak ke kontak.html
    const kontakMenu = document.querySelector('a[href="kontak.html"]');
    if (kontakMenu) {
        kontakMenu.addEventListener('click', function(e) {
            // Jika sudah di kontak.html, cegah reload
            if (window.location.pathname.endsWith('kontak.html')) {
                e.preventDefault();
            }
        });
    }

    // Jika di kontak.html, scroll ke tengah otomatis
    if (window.location.pathname.endsWith('kontak.html')) {
        setTimeout(function() {
            window.scrollTo({
                top: document.body.scrollHeight / 4,
                behavior: 'smooth'
            });
        }, 300);
    }
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
    }

    // Slider (hanya jalan kalau ada elemen slider)
    const sliderContainer = document.querySelector('.slider-container');
    const images = document.querySelectorAll('.slider-image');

    if (sliderContainer && images.length > 0) {
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

        updateSlider();
        startSlider();

        sliderContainer.addEventListener('mouseenter', stopSlider);
        sliderContainer.addEventListener('mouseleave', startSlider);

        document.addEventListener('visibilitychange', () => {
            document.hidden ? stopSlider() : startSlider();
        });
    }
});
