document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    // Dropdown menu toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.submenu');
        if (link && submenu) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    link.setAttribute('aria-expanded', dropdown.classList.contains('active'));
                }
            });

            // Desktop hover effect
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    dropdown.classList.add('active');
                    link.setAttribute('aria-expanded', 'true');
                }
            });
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    dropdown.classList.remove('active');
                    link.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    // Section switching for profil.html
    if (window.location.pathname.includes('profil.html')) {
        const submenuLinks = document.querySelectorAll('.submenu a');
        const profileSections = document.querySelectorAll('.profile-section');
        if (profileSections.length > 0) {
            // Set default section
            profileSections.forEach(section => section.classList.remove('active'));
            const defaultSection = document.getElementById('profil-sekolah') || profileSections[0];
            if (defaultSection) {
                defaultSection.classList.add('active');
            }

            // Handle submenu clicks
            submenuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        profileSections.forEach(section => section.classList.remove('active'));
                        targetSection.classList.add('active');
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    // Close menu on mobile
                    if (window.innerWidth <= 768 && hamburger && menu) {
                        hamburger.classList.remove('active');
                        menu.classList.remove('active');
                    }
                });
            });
        }
    }

      // Slider for index.html
    const sliderContainer = document.querySelector('.slider-container');
    const sliderItems = document.querySelectorAll('.slider-item');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    if (sliderContainer && sliderItems.length > 0) {
        const totalImages = sliderItems.length;
        let currentIndex = 0;
        let slideInterval;

        const updateSlider = () => {
            sliderContainer.style.transition = `transform 0.3s ease-in-out`;
            sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            sliderItems.forEach((item, index) => {
                item.classList.toggle('active', index === currentIndex);
            });
        };

        const slideNext = () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateSlider();
        };

        const slidePrev = () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
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

        if (prevButton && nextButton) {
            nextButton.addEventListener('click', () => {
                stopSlider();
                slideNext();
                startSlider();
            });
            prevButton.addEventListener('click', () => {
                stopSlider();
                slidePrev();
                startSlider();
            });
        }

        document.addEventListener('visibilitychange', () => {
            document.hidden ? stopSlider() : startSlider();
        });
    }
});
