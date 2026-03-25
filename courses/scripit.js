document.addEventListener('DOMContentLoaded', function() {
    // Drone cursor
    const wrapper = document.getElementById('drone-wrapper');
    const model = document.getElementById('drone-model');
    let lastX = window.innerWidth / 2, lastY = window.innerHeight / 2;
    let stopTimeout;
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX, y = e.clientY;
        wrapper.style.setProperty('--x', `${x}px`);
        wrapper.style.setProperty('--y', `${y}px`);
        const dx = x - lastX, dy = y - lastY;
        const tiltY = Math.min(Math.max(dx * 2.5, -60), 60);
        const tiltX = Math.min(Math.max(dy * -2.5, -60), 60);
        model.style.setProperty('--tiltX', `${tiltX}deg`);
        model.style.setProperty('--tiltY', `${tiltY}deg`);
        wrapper.classList.add('moving');
        lastX = x; lastY = y;
        clearTimeout(stopTimeout);
        stopTimeout = setTimeout(() => {
            model.style.setProperty('--tiltX', `0deg`);
            model.style.setProperty('--tiltY', `0deg`);
            wrapper.classList.remove('moving');
        }, 150);
    });
    // Trail dots
    for (let i = 0; i < 3; i++) {
        let dot = document.createElement('div');
        dot.className = 'trail-dot';
        document.body.appendChild(dot);
    }
    const trailDots = document.querySelectorAll('.trail-dot');
    let trailIndex = 0;
    setInterval(() => {
        if (trailDots[trailIndex]) {
            trailDots[trailIndex].style.left = (lastX - 2) + 'px';
            trailDots[trailIndex].style.top = (lastY - 2) + 'px';
            trailDots[trailIndex].style.opacity = '0.5';
            setTimeout(() => trailDots[trailIndex].style.opacity = '0', 100);
        }
        trailIndex = (trailIndex + 1) % trailDots.length;
    }, 50);

    // Consultation modal
    const modal = document.getElementById('consultationModal');
    const triggers = document.querySelectorAll('.consultation-trigger');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const backBtn = document.getElementById('backBtn');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const timeSlots = document.querySelectorAll('.time-slot');
    triggers.forEach(t => t.addEventListener('click', () => { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }));
    function hideModal() { modal.classList.remove('show'); document.body.style.overflow = ''; }
    closeModal?.addEventListener('click', hideModal);
    cancelBtn?.addEventListener('click', hideModal);
    nextStepBtn?.addEventListener('click', () => { step1.classList.remove('active'); step2.classList.add('active'); });
    backBtn?.addEventListener('click', () => { step2.classList.remove('active'); step1.classList.add('active'); });
    timeSlots.forEach(s => s.addEventListener('click', function() { timeSlots.forEach(s=>s.classList.remove('selected')); this.classList.add('selected'); }));
    
    flatpickr("#date", { minDate: "today", dateFormat: "Y-m-d", disable: [ date => date.getDay() === 0 || date.getDay() === 6 ] });

    // Hamburger menu
    document.querySelector('.hamburger')?.addEventListener('click', () => document.querySelector('nav ul').classList.toggle('active'));

    // Scroll events (sidebar & back to top)
    const sidebar = document.getElementById('consultationSidebar');
    const backTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) sidebar.classList.add('show'); else sidebar.classList.remove('show');
        if (window.scrollY > 500) backTop.classList.add('show'); else backTop.classList.remove('show');
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // FAQ toggle
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => q.parentElement.classList.toggle('active'));
    });

    // Auto‑select course and smooth scroll on "Start Career" click
    document.querySelectorAll('.start-career-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const course = this.dataset.course;
            const select = document.getElementById('course-select');
            if (course && select) {
                select.value = course;
            }
            document.getElementById('enrollForm').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // AJAX form submission for enrollment (with alert)
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Stop normal submission
            const formData = new FormData(enrollForm);
            try {
                const response = await fetch(enrollForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    alert('Thank you! Your enrollment request has been sent. We will contact you soon.');
                    enrollForm.reset(); // Clear form
                } else {
                    alert('Oops! Something went wrong. Please try again later.');
                }
            } catch (error) {
                alert('Network error. Please check your connection and try again.');
            }
        });
    }
});

// Cookie banner function (global)
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookie-banner').style.display = 'none';
}
if (localStorage.getItem('cookiesAccepted')) {
    document.getElementById('cookie-banner').style.display = 'none';
}