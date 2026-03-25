document.addEventListener('DOMContentLoaded', function() {
    // Auto‑select course and smooth scroll on "Start Career" click
    const careerButtons = document.querySelectorAll('.start-career-btn');
    careerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const course = this.dataset.course;
            const select = document.getElementById('course-select');
            if (course && select) {
                select.value = course;
            }
            const enrollForm = document.getElementById('enrollForm');
            if (enrollForm) {
                enrollForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // AJAX form submission for enrollment (prevents page reload)
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(enrollForm);
            try {
                const response = await fetch(enrollForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    alert('Thank you! Your enrollment request has been sent. We will contact you soon.');
                    enrollForm.reset(); // Clear the form
                } else {
                    alert('Oops! Something went wrong. Please try again later.');
                }
            } catch (error) {
                alert('Network error. Please check your connection and try again.');
            }
        });
    }
});