document.addEventListener('DOMContentLoaded', function() {
    // ----- AOS (Animate On Scroll) -----
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }

    // ----- Typing effect for the "Why Drone Labs Matter" heading -----
    const typingElement = document.querySelector('.typing-heading .text');
    if (typingElement) {
        const textToType = "Why Drone Labs Matter";
        let i = 0;
        function typeWriter() {
            if (i < textToType.length) {
                typingElement.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }

    // ----- Carousel for lab images -----
    const carouselTrack = document.getElementById('carouselTrack');
    const prevCarousel = document.getElementById('prevCarousel');
    const nextCarousel = document.getElementById('nextCarousel');
    const dotsContainer = document.getElementById('carouselDots');
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    if (carouselTrack && slides.length > 0) {
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            document.querySelectorAll('#carouselDots .dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        prevCarousel.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextCarousel.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        });

        // Auto slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }
});