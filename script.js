// ========== MAIN SITE SCRIPTS ==========
document.addEventListener('DOMContentLoaded', function() {
    // ----- Drone cursor -----
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

    // ----- Trail dots -----
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

    // ----- Animated stats counters -----
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const update = () => {
                    if (count < target) {
                        count += Math.ceil(target / 50);
                        if (count > target) count = target;
                        counter.innerText = count;
                        requestAnimationFrame(update);
                    }
                };
                update();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));

    // ----- Consultation modal -----
    const modal = document.getElementById('consultationModal');
    const triggers = document.querySelectorAll('.consultation-trigger');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const backBtn = document.getElementById('backBtn');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const timeSlots = document.querySelectorAll('.time-slot');

    triggers.forEach(t => t.addEventListener('click', () => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }));

    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    if (closeModal) closeModal.addEventListener('click', hideModal);
    if (cancelBtn) cancelBtn.addEventListener('click', hideModal);
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
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
    timeSlots.forEach(s => s.addEventListener('click', function() {
        timeSlots.forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
    }));

    // Date picker (flatpickr)
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#date", {
            minDate: "today",
            dateFormat: "Y-m-d",
            disable: [date => date.getDay() === 0 || date.getDay() === 6]
        });
    }

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Scroll events (sidebar & back to top)
    const sidebar = document.getElementById('consultationSidebar');
    const backTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (sidebar) {
            if (window.scrollY > 300) sidebar.classList.add('show');
            else sidebar.classList.remove('show');
        }
        if (backTop) {
            if (window.scrollY > 500) backTop.classList.add('show');
            else backTop.classList.remove('show');
        }
    });
    if (backTop) {
        backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Meet section circle animation
    const bgOverlay = document.querySelector('.bg-overlay');
    const meetSection = document.getElementById('meet-today-section');
    window.addEventListener('scroll', () => {
        if (bgOverlay && meetSection) {
            const rect = meetSection.getBoundingClientRect();
            const visible = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
            bgOverlay.style.clipPath = `ellipse(${visible * 100 + 20}% ${visible * 70 + 20}% at 50% 50%)`;
        }
    });

    // Hero video rotation
    const heroVideo = document.getElementById('heroVideo');
    const videoSources = ['videos/IQDRONE.mp4', 'videos/d2video.mp4', 'videos/d3video.mp4'];
    let videoIndex = 0;

    function playNextVideo() {
        videoIndex = (videoIndex + 1) % videoSources.length;
        if (heroVideo) {
            heroVideo.src = videoSources[videoIndex];
            heroVideo.load();
            heroVideo.play().catch(e => console.log('Video play failed:', e));
        }
    }

    if (heroVideo) {
        heroVideo.addEventListener('ended', playNextVideo);
        heroVideo.addEventListener('error', playNextVideo);
        // initial play attempt
        heroVideo.play().catch(e => console.log('Initial video play failed:', e));
    }
});

// ----- FAQ toggle -----
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        q.parentElement.classList.toggle('active');
    });
});

// ----- Gallery lightbox -----
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
        document.getElementById('lightbox').style.display = 'block';
        document.getElementById('lightbox-img').src = img.src;
    });
});
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
});



// ========== SIMULATOR SCRIPT (Enhanced with Discount & Realistic Controls) ==========
(function() {
    const drone = document.getElementById('sim-drone');
    const path = document.getElementById('sim-path');
    const techBg = document.getElementById('sim-tech-bg');
    const banner = document.getElementById('sim-msg-banner');
    const audioBtn = document.getElementById('sim-audio-init');
    const stopBtn = document.getElementById('sim-audio-stop');
    const spdTxt = document.getElementById('sim-speed-val');
    const battTxt = document.getElementById('sim-batt-val');
    const modeTxt = document.getElementById('sim-mode-val');
    const thrTxt = document.getElementById('sim-thr-val');
    const yawTxt = document.getElementById('sim-yaw-val');
    const pitTxt = document.getElementById('sim-pit-val');
    const rolTxt = document.getElementById('sim-rol-val');

    let x = 100, y = 210, battery = 100, active = true, canUp = false, engine = false, keys = {};
    let speed = 0;              // current speed
    let maxSpeedAchieved = 0;   // highest speed during flight
    let audioCtx = null, osc = null, gainNode = null;
    let missionCompleted = false;

    function setDroneColor(color) {
        if (drone) drone.style.color = color;
    }
    setDroneColor('#00CCFF');

    function startEngines() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        osc = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        engine = true;
        drone?.classList.add('spinning');
        if (audioBtn) audioBtn.innerText = "ONLINE";
    }

    function hardKill() {
        if (audioCtx) {
            audioCtx.close().then(() => {
                audioCtx = null;
                osc = null;
                gainNode = null;
                engine = false;
                drone?.classList.remove('spinning');
                if (audioBtn) audioBtn.innerText = "IGNITION";
            });
        } else {
            engine = false;
            drone?.classList.remove('spinning');
        }
    }

    document.addEventListener("visibilitychange", () => {
        if (missionCompleted) return;
        if (document.hidden) {
            if (audioCtx) audioCtx.suspend();
        } else {
            if (audioCtx && engine) audioCtx.resume();
        }
    });

    if (audioBtn) {
        audioBtn.onclick = function() {
            if (!engine && !missionCompleted) {
                if (banner) {
                    banner.innerText = "Press forward (↑) to start engines";
                    banner.style.display = 'block';
                    setTimeout(() => banner.style.display = 'none', 2000);
                }
            }
        };
    }
    if (stopBtn) stopBtn.onclick = hardKill;

    const bind = (id, k) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.onmousedown = el.ontouchstart = (e) => {
            e.preventDefault();
            keys[k] = true;
        };
        el.onmouseup = el.onmouseleave = el.ontouchend = () => keys[k] = false;
    };
    bind('sim-up', 'ArrowUp');
    bind('sim-down', 'ArrowDown');
    bind('sim-left', 'ArrowLeft');
    bind('sim-right', 'ArrowRight');

    window.onkeydown = (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            if (!engine && !missionCompleted && (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
                startEngines();
            }
            keys[e.code] = true;
        }
    };
    window.onkeyup = (e) => keys[e.code] = false;

    function loop() {
        if (active && engine && !missionCompleted) {
            // --- GRADUAL SPEED SYSTEM (realistic) ---
            let accel = 0.6;      // acceleration rate
            let decel = 0.25;     // natural slowdown
            let brakePower = 0.8; // braking strength

            if (keys['ArrowRight']) {
                speed += accel;              // accelerate gradually
            } else if (keys['ArrowLeft']) {
                speed -= brakePower;         // strong brake
            } else {
                speed -= decel;              // natural drag
            }

            // Clamp speed
            speed = Math.max(0, Math.min(85, speed));

            // Movement
            let move = speed * 0.25;
            x += move;

            // Up/down movement (if license gate passed)
            let p = 0;
            if (canUp) {
                if (keys['ArrowUp']) { y -= 6; p = -8; }
                else if (keys['ArrowDown']) { y += 6; p = 8; }
            }

            // Yaw (Q/E)
            let yw = 0;
            if (keys['KeyQ']) yw = -20;
            else if (keys['KeyE']) yw = 20;

            // Boundaries
            x = Math.max(80, Math.min(3900, x));
            y = Math.max(70, Math.min(370, y));

            // Update max speed
            if (speed > maxSpeedAchieved) maxSpeedAchieved = speed;

            // --- BATTERY DRAIN (realistic energy model) ---
            if (speed > 0 && battery > 0) {
                let drain = 0.01 + (speed / 100) * 0.25;
                battery -= drain;
                battery = Math.max(0, battery);
                if (battTxt) battTxt.innerText = Math.floor(battery);
            }

            // Low battery warning
            if (battery < 20 && battery > 0) {
                if (banner && !missionCompleted) {
                    banner.innerText = "⚠ LOW BATTERY – FLY SMART";
                    banner.style.display = 'block';
                    setTimeout(() => banner.style.display = 'none', 2000);
                }
            }

            // Visual tilt effect based on throttle
            let r = 0;
            if (keys['ArrowRight']) r = 15;
            else if (keys['ArrowLeft']) r = -12;

            if (drone) {
                drone.style.left = x + 'px';
                drone.style.top = y + 'px';
                drone.style.transform = `translate(-50%, -50%) rotateZ(${r}deg) rotateX(${p}deg) rotateY(${yw}deg)`;
            }
            if (path) path.style.transform = `translateX(-${x - 200}px)`;
            if (techBg) techBg.style.backgroundPosition = `-${x/2}px -${y/2}px`;

            // Update HUD values
            if (spdTxt) spdTxt.innerText = Math.floor(speed);
            if (thrTxt) thrTxt.innerText = Math.floor((speed / 85) * 100);
            if (yawTxt) yawTxt.innerText = yw;
            if (pitTxt) pitTxt.innerText = p;
            if (rolTxt) rolTxt.innerText = r;

            // Gate detection and drone color change
            document.querySelectorAll('.sim-gate').forEach((g, i) => {
                if (!g.classList.contains('sim-fade-out') && x > g.offsetLeft && x < g.offsetLeft + 140) {
                    if (banner) {
                        banner.innerText = g.dataset.msg;
                        banner.style.display = 'block';
                        setTimeout(() => banner.style.display = 'none', 2000);
                    }
                    g.classList.add('sim-fade-out');
                    if (i === 0) setDroneColor('#FFFFFF');
                    else if (i === 1) setDroneColor('#F59E0B');
                    else if (i === 2) {
                        setDroneColor('#00FF66');
                        canUp = true;
                        if (modeTxt) modeTxt.innerText = 'PRO';
                    }
                }
            });

            // Mission completion when reaching far right zone
            if (x > 3400 && !window.discountTriggered) {
                window.discountTriggered = true;
                missionCompleted = true;
                active = false;
                hardKill();   // stop sound

                setDroneColor('#FFD700');

                // Fireworks on mission completion
                if (typeof confetti !== 'undefined') {
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, startVelocity: 25 });
                    setTimeout(() => {
                        confetti({ particleCount: 150, spread: 70, origin: { y: 0.4 }, startVelocity: 20 });
                    }, 150);
                }

                // Find nearest target for course
                let nearestTarget = null;
                let minDist = Infinity;
                document.querySelectorAll('.sim-target').forEach(t => {
                    const targetY = t.offsetTop;
                    const dist = Math.abs(y - targetY);
                    if (dist < minDist) {
                        minDist = dist;
                        nearestTarget = t;
                    }
                });

                let selectedCourse = "RPC";
                if (nearestTarget) {
                    const targetName = nearestTarget.dataset.c;
                    document.getElementById('sim-final-course').innerText = targetName;
                    window.sel = targetName;

                    const courseMap = {
                        'Agriculture': 'Agriculture',
                        'Cinematography': 'Videography',
                        'Survey': 'Survey',
                        'Mapping': 'Survey'
                    };
                    selectedCourse = courseMap[targetName] || 'RPC';
                }

                const batteryLeft = Math.floor(battery);
                const finalMaxSpeed = Math.floor(maxSpeedAchieved);

                // --- ADVANCED DISCOUNT SYSTEM ---
                let baseDiscount = 10;
                let batteryBonus = Math.floor(batteryLeft / 10);   // 0–10
                let speedBonus = Math.floor(finalMaxSpeed / 12);   // 0–8
                if (speedBonus > 8) speedBonus = 8;

                let finalDiscount = baseDiscount + batteryBonus + speedBonus;
                if (finalDiscount > 40) finalDiscount = 40;

                window.currentDiscount = {
                    percent: finalDiscount,
                    course: selectedCourse,
                    battery: batteryLeft,
                    speed: finalMaxSpeed,
                    batteryBonus: batteryBonus,
                    speedBonus: speedBonus
                };

                const discountInfo = document.getElementById('discountInfo');
                if (discountInfo) {
                    discountInfo.innerHTML = `
                        🎯 <strong>${selectedCourse}</strong><br>
                        🔋 Battery Efficiency Bonus: +${batteryBonus}%<br>
                        ⚡ Speed Skill Bonus: +${speedBonus}%<br>
                        🎁 <span style="color:#F59E0B; font-size:18px;">${finalDiscount}% OFF</span><br>
                        <small>Fly fast ⚡ but conserve energy 🔋 to maximize discount</small>
                    `;
                }

                document.getElementById('sim-overlay').style.display = 'flex';
                                     
                const nameInput = document.getElementById('sim-uname');
                const phoneInput = document.getElementById('sim-uphone');
                const claimBtn = document.getElementById('claimDiscountBtn');
                function checkFields() {
                    if (nameInput.value.trim() !== '' && phoneInput.value.trim() !== '') {
                        claimBtn.disabled = false;
                    } else {
                        claimBtn.disabled = true;
                    }
                }
                nameInput.addEventListener('input', checkFields);
                phoneInput.addEventListener('input', checkFields);
                checkFields();
            }
        }
        requestAnimationFrame(loop);
    }
    loop();

    const waBtn = document.getElementById('sim-wa-btn');
    if (waBtn) {
        waBtn.onclick = () => {
            const name = document.getElementById('sim-uname').value;
            const phone = document.getElementById('sim-uphone').value;
            const course = window.sel || 'a course';
            const message = `Hi, I'm ${name}. I completed the simulator and I'm interested in ${course}.`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        };
    }
    const exploreBtn = document.getElementById('sim-explore-btn');
    if (exploreBtn) {
        exploreBtn.onclick = () => {
            window.location.href = 'courses.html';
        };
    }

    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.onclick = () => location.reload();
    }
})();

// ========== DISCOUNT CLAIM HANDLER ==========
(function() {
    const claimBtn = document.getElementById('claimDiscountBtn');
    if (claimBtn) {
        claimBtn.addEventListener('click', function() {
            const discount = window.currentDiscount;
            if (!discount) return;

            const code = `IQDRONE${Math.floor(Math.random() * 100)}`;
            const resultDiv = document.getElementById('discountResult');
            resultDiv.innerHTML = `🎉 Code: <strong>${code}</strong> – ${discount.percent}% OFF on ${discount.course}! 🎉<br>Use this code at checkout.`;
            resultDiv.style.display = 'block';

            if (typeof confetti !== 'undefined') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }

            const waBtn = document.getElementById('sim-wa-btn');
            if (waBtn) {
                waBtn.onclick = () => {
                    const name = document.getElementById('sim-uname').value;
                    const phone = document.getElementById('sim-uphone').value;
                    const message = `Hi, I'm ${name}. I completed the simulator and got ${discount.percent}% off with code ${code}. I'm interested in ${discount.course}.`;
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                };
            }

            claimBtn.disabled = true;
            claimBtn.textContent = "Discount Claimed ✅";
        });
    }
})();
// ========== COURSE DETAIL PAGE MODULES ==========
(function() {
    // Tab switching for course details
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabBtns.length && tabContents.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Deactivate all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                // Activate current
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const activeContent = document.getElementById(tabId);
                if (activeContent) activeContent.classList.add('active');
            });
        });
    }

    // Testimonial carousel
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = document.querySelectorAll('.testimonial-card');
        let currentIndex = 0;

        if (cards.length > 0) {
            // Create dots
            cards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });

            function updateCarousel() {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                document.querySelectorAll('.dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCarousel();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateCarousel();
            });
        }
    }
})();
// ========== AOS (Animate on Scroll) Initialization ==========
(function() {
        if (typeof AOS !== 'undefined' && document.querySelector('[data-aos]')) {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
        setTimeout(() => {
    AOS.refresh();
}, 500);
    }
})();
// ========== LOCATION SLIDER (Contact page) ==========
(function() {
    const track = document.getElementById('locationTrack');
    const dotsContainer = document.getElementById('locationDots');
    if (track && dotsContainer) {
        const slides = document.querySelectorAll('.slider-item');
        let currentSlide = 0;

        if (slides.length > 0) {
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('slider-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            });

            function updateSlider() {
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                document.querySelectorAll('.slider-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            }, 5000);
        }
    }
})();

// ========== PARTNER PAGE INFINITE CAROUSEL ==========
// No JavaScript needed for auto-scroll! Pure CSS handles it.
// This block is only for manual control if you want to pause/resume
(function() {
    const carousel = document.querySelector('.carousel-container');
    
    if (carousel) {
        // Optional: Pause on manual drag
        let isDragging = false;
        let startX;
        let scrollLeft;
        
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
            carousel.style.animationPlayState = 'running';
        });
        
        carousel.addEventListener('mouseup', () => {
            isDragging = false;
            carousel.style.animationPlayState = 'running';
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }
})();
let captchaResult = 0;
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  captchaResult = num1 + num2;
  document.getElementById('captchaQuestion').innerText = `${num1} + ${num2} = ?`;
}
generateCaptcha();

