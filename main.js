document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 RoboNinjas Script Loaded Successfully!");

    // 1. Color Theme Picker Logic
    let currentHex = '#00d2ff';
    let currentRgb = '0, 210, 255';
    
    const colorDots = document.querySelectorAll('.color-dot');
    
    colorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            currentHex = dot.getAttribute('data-color');
            currentRgb = dot.getAttribute('data-rgb');
            
            document.documentElement.style.setProperty('--primary', currentHex);
            document.documentElement.style.setProperty('--primary-rgb', currentRgb);
        });
    });

    // 2. Custom Crosshair Cursor
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (cursor && window.innerWidth > 768) {
        document.body.classList.add('hide-default-cursor');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .team-card, .tier-card, .color-dot');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
                cursor.style.backgroundColor = `rgba(${currentRgb}, 0.2)`;
                if(cursorDot) cursorDot.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursor.style.backgroundColor = 'transparent';
                if(cursorDot) cursorDot.style.opacity = '1'; 
            });
        });
    } else if (cursor) {
        cursor.style.display = 'none'; 
    }

    // 3. Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            burger.classList.toggle('toggle');
        });
    }

    // 4. Advanced Particle Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 1.5) - 0.75;
                this.speedY = (Math.random() * 1.5) - 0.75;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = currentHex;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 12000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
                
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${currentRgb}, ${1 - distance/130})`; 
                        ctx.lineWidth = 1;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
    }

    // 5. Scroll Reveal Physics
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => scrollObserver.observe(el));
    
    setTimeout(() => {
        fadeElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // 6. Floating Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) { 
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 7. NEW: Animated Count-Up Numbers
    const countUpElements = document.querySelectorAll('.count-up');
    let hasCounted = false; // Prevents the animation from restarting every time you scroll past

    const fundingSection = document.querySelector('.funding-tracker');
    
    if (fundingSection && countUpElements.length > 0) {
        const countUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger only when the user can see at least 50% of the section
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true; 
                    
                    countUpElements.forEach(el => {
                        const target = parseInt(el.getAttribute('data-target'));
                        const duration = 2000; // 2 seconds total animation
                        const frameRate = 16; // Runs at roughly 60fps
                        const totalFrames = duration / frameRate;
                        const increment = target / totalFrames;
                        let current = 0;
                        
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                // Math.ceil rounds it to a whole number, toLocaleString adds the commas (e.g., 10,000)
                                el.innerText = Math.ceil(current).toLocaleString();
                                requestAnimationFrame(updateCounter);
                            } else {
                                el.innerText = target.toLocaleString();
                            }
                        };
                        
                        updateCounter();
                    });
                }
            });
        }, { threshold: 0.5 }); 

        countUpObserver.observe(fundingSection);
    }
});
