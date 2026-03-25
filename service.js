// ===== SERVICE PAGE SPECIFIC =====
// AOS initialisation
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 100 });
}

// Service cards open modal and set hidden service field
const serviceCards = document.querySelectorAll('.service-card');
const serviceHidden = document.getElementById('serviceSelected');
const modal = document.getElementById('consultationModal');
serviceCards.forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        if (serviceHidden) {
            serviceHidden.value = this.getAttribute('data-service') || '';
        }
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Fix modal step navigation – use correct IDs
const nextModalBtn = document.getElementById('nextModalBtn');
const backBtn = document.getElementById('backBtn');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
if (nextModalBtn) {
    nextModalBtn.addEventListener('click', () => {
        step1.classList.remove('active');
        step2.classList.add('active');
    });
}
if (backBtn) {
    backBtn.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
    });
}

// Form submission
document.getElementById('consultForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! We will contact you soon.');
    modal.classList.remove('show');
    document.body.style.overflow = '';
});

// Testimonial carousel
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const dotsContainer = document.getElementById('testimonialDots');
const cards = document.querySelectorAll('.testimonial-card');
let currentIndex = 0;
let autoSlideInterval;

if (cards.length > 0) {
    cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
        resetAutoSlide();
    });

    autoSlideInterval = setInterval(nextSlide, 4000);
}