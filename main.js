document.addEventListener('DOMContentLoaded', function() {
    // Toggle hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    // Toggle dropdown1 submenu on click
    const dropdowns1 = document.querySelectorAll('.dropdown1');
    dropdowns1.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            dropdown.classList.toggle('active');
            // Close dropdown2 if open
            document.querySelectorAll('.dropdown2').forEach(d => d.classList.remove('active'));
        });
    });

    // Toggle dropdown2 submenu on click
    const dropdowns2 = document.querySelectorAll('.dropdown2');
    dropdowns2.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            dropdown.classList.toggle('active');
            // Close dropdown1 if open
            document.querySelectorAll('.dropdown1').forEach(d => d.classList.remove('active'));
        });
    });

    // Handle submenu1 clicks to navigate and hide submenus
    const submenu1Links = document.querySelectorAll('.submenu1 a');
    submenu1Links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow navigation to the href
            const href = link.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
            // Close all submenus and hamburger menu
            dropdowns1.forEach(d => d.classList.remove('active'));
            dropdowns2.forEach(d => d.classList.remove('active'));
            if (window.innerWidth <= 768 && hamburger && menu) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    });

    // Handle submenu2 clicks to navigate and hide submenus
    const submenu2Links = document.querySelectorAll('.submenu2 a');
    submenu2Links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow navigation to the href
            const href = link.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
            // Close all submenus and hamburger menu
            dropdowns1.forEach(d => d.classList.remove('active'));
            dropdowns2.forEach(d => d.classList.remove('active'));
            if (window.innerWidth <= 768 && hamburger && menu) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    });

    // Close submenus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown1') && !e.target.closest('.dropdown2')) {
            dropdowns1.forEach(dropdown => dropdown.classList.remove('active'));
            dropdowns2.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Section switching for profil.html
    if (window.location.pathname.includes('profil.html')) {
        const profileSections = document.querySelectorAll('.profile-section');
        if (profileSections.length > 0) {
            // Set default section based on URL hash or fallback to first section
            const hash = window.location.hash.substring(1);
            profileSections.forEach(section => section.classList.remove('active'));
            const targetSection = hash ? document.getElementById(hash) : document.getElementById('profil-sekolah') || profileSections[0];
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Handle submenu clicks for section switching
            const submenuLinks = document.querySelectorAll('.submenu1 a');
            submenuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').split('#')[1];
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        profileSections.forEach(section => section.classList.remove('active'));
                        targetSection.classList.add('active');
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                        // Update URL hash without reloading
                        window.history.pushState(null, null, `#${targetId}`);
                    }
                });
            });
        }
    }

        // Section switching for ekskul.html
        if (window.location.pathname.includes('ekskul.html')) {
            const ekskulSections = document.querySelectorAll('.ekskul-section');
            if (ekskulSections.length > 0) {
                // Set default section based on URL hash or fallback to first section
                const hash = window.location.hash.substring(1);
                ekskulSections.forEach(section => section.classList.remove('active'));
                const targetSection = hash ? document.getElementById(hash) : document.getElementById('pramuka') || ekskulSections[0];
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }

                // Handle submenu clicks for section switching
                const submenuLinks = document.querySelectorAll('.submenu2 a');
                submenuLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href').split('#')[1];
                        const targetSection = document.getElementById(targetId);
                        if (targetSection) {
                            ekskulSections.forEach(section => section.classList.remove('active'));
                            targetSection.classList.add('active');
                            targetSection.scrollIntoView({ behavior: 'smooth' });
                            // Update URL hash without reloading
                            window.history.pushState(null, null, `#${targetId}`);
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
