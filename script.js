document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE MENU NAVIGATION ENGINE ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // --- 2. CORE TEAM INTERACTIVE FLIP MECHANISM ---
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });


    // --- 3. AJAX SUPPORT TICKET ENGINE (NO REDIRECT + POPUP) ---
    const form = document.getElementById('support-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents Formspree redirect sequence

        const data = new FormData(form);
        const submitBtn = form.querySelector('.form-submit-btn');
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Display custom success modal engine
                successModal.style.display = 'flex';
                form.reset();
            } else {
                const responseData = await response.json();
                alert(responseData.errors ? responseData.errors.map(err => err.message).join(', ') : 'Submission failed.');
            }
        } catch (error) {
            alert('Network error encountered. Please verify internet connectivity.');
        } finally {
            submitBtn.innerText = 'Submit Ticket';
            submitBtn.disabled = false;
        }
    });

    closeModalBtn.addEventListener('click', () => {
        successModal.style.display = 'none';
    });


    // --- 4. MINIMAL AMBIENT PARTICLE BACKGROUND ANIMATION ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 112, 243, 0.3)'; // Neon Blue tint
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
});
