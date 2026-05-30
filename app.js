/* 
   SM-Enterprise - Super Logic
   GSAP + Lenis + Tailwind 4
*/

// --- DATA ---
const MOTOS = [
    // Galeria Internacional (Luxury)
    { id: 1, name: 'Yamaha YZF-R3', category: 'Sport', price: '850.000', rent: '2.500', image: 'assets/moto-1.png' },
    { id: 2, name: 'Ducati Monster 797', category: 'Sport', price: '1.200.000', rent: '4.500', image: 'assets/moto-2.png' },
    { id: 3, name: 'Honda PCX 150', category: 'Scooter', price: '380.000', rent: '1.200', image: 'assets/moto-3.png' },
    { id: 4, name: 'Yamaha NMAX 155', category: 'Scooter', price: '420.000', rent: '1.400', image: 'assets/moto-4.png' },
    { id: 5, name: 'Royal Enfield Himalayan', category: 'Off-road', price: '720.000', rent: '2.800', image: 'assets/moto-5.png' },
    { id: 6, name: 'KTM 390 Adventure', category: 'Off-road', price: '950.000', rent: '3.200', image: 'assets/moto-6.png' },
    
    // Coleção Nacionais (Malta Rico & TVS)
    { id: 9, name: 'TVS Apache RTR 160', category: 'Nacionais', price: '145.000', rent: '850', image: 'assets/1.jpg' },
    { id: 10, name: 'TVS Star HLX 150', category: 'Nacionais', price: '95.000', rent: '600', image: 'assets/2.jpg' },
    { id: 11, name: 'National Hero 125', category: 'Nacionais', price: '85.000', rent: '500', image: 'assets/3.jpg' },
    { id: 12, name: 'TVS Victor GX', category: 'Nacionais', price: '110.000', rent: '700', image: 'assets/4.jpg' },
    { id: 13, name: 'Lingken 150 Sport', category: 'Nacionais', price: '125.000', rent: '750', image: 'assets/5.jpg' },
    { id: 14, name: 'Haojin Exclusive 150', category: 'Nacionais', price: '115.000', rent: '700', image: 'assets/6.jpg' },
    { id: 15, name: 'TVS Max 4R', category: 'Nacionais', price: '88.000', rent: '550', image: 'assets/7.jpg' },
    { id: 16, name: 'National Express 150', category: 'Nacionais', price: '130.000', rent: '800', image: 'assets/8.jpg' },
    { id: 17, name: 'TVS XL100 Heavy Duty', category: 'Nacionais', price: '65.000', rent: '400', image: 'assets/9.jpg' }
];

const HERO_IMAGES = [
    'assets/hero-1.png',
    'assets/hero-2.png',
    'assets/hero-3.png',
    'assets/hero-4.png'
];

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initPreloader();
    initHero();
    initCatalog();
    initScrollAnimations();
    initHeader();
    initPremiumInteractions();
    initScrollProgress();
});

// --- SMOOTH SCROLL (LENIS) ---
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Global Lenis integration for GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// --- PRELOADER (GARAGE REVEAL) ---
function initPreloader() {
    const tl = gsap.timeline();
    
    tl.to('#preloader-bar', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
      .to('#preloader-text', { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, '-=0.4')
      .to('.preloader-panel:nth-child(1)', { xPercent: -100, duration: 1.5, ease: 'expo.inOut' }, 'reveal')
      .to('.preloader-panel:nth-child(2)', { xPercent: 100, duration: 1.5, ease: 'expo.inOut' }, 'reveal')
      .to('#preloader-text, #preloader-bar', { opacity: 0, scale: 1.2, duration: 0.8, ease: 'power2.in' }, 'reveal-=0.4')
      .set('#preloader', { display: 'none' })
      .from('#hero-title span', { y: 100, opacity: 0, duration: 1.8, stagger: 0.2, ease: 'expo.out' }, '-=0.8')
      .from('#hero-tag', { x: -50, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.5')
      .from('#hero-btns', { opacity: 0, y: 30, duration: 1.2, ease: 'power3.out' }, '-=1.2');
}

// --- HERO CAROUSEL ---
let currentSlide = 0;
function initHero() {
    const container = document.getElementById('hero-slides');
    const indicators = document.getElementById('hero-indicators');
    
    HERO_IMAGES.forEach((img, index) => {
        // Create Slides
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${img}" class="w-full h-full object-cover">`;
        container.appendChild(slide);

        // Create Indicators
        const dot = document.createElement('div');
        dot.className = `w-12 h-[2px] bg-white/20 relative overflow-hidden cursor-pointer group`;
        dot.innerHTML = `<div class="absolute inset-0 bg-primary scale-x-0 origin-left transition-transform duration-[6000ms] ${index === 0 ? 'scale-x-100' : ''}"></div>`;
        dot.onclick = () => goToSlide(index);
        indicators.appendChild(dot);
    });

    setInterval(nextSlide, 6000);
}

function nextSlide() {
    goToSlide((currentSlide + 1) % HERO_IMAGES.length);
}

function goToSlide(index) {
    if (currentSlide === index) return;
    
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('#hero-indicators > div > div');
    const indexDisplay = document.getElementById('current-index');

    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('scale-x-100');
    indicators[currentSlide].style.transform = 'scaleX(0)';

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('scale-x-100');
    
    indexDisplay.textContent = (currentSlide + 1).toString().padStart(2, '0');
    
    // Tiny bounce on text when slide changes
    gsap.fromTo('#hero-title', { opacity: 0.8, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });
}

// --- CATALOG LOGIC ---
function initCatalog() {
    renderMotos('Todas');

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Adaptive Atmosphere Color Shift
            const light = document.getElementById('studio-light');
            let color = 'rgba(212, 160, 23, 0.08)'; // Gold
            if (filter === 'Sport') color = 'rgba(255, 50, 50, 0.08)'; // Red
            if (filter === 'Scooter') color = 'rgba(50, 150, 255, 0.08)'; // Blue
            if (filter === 'Off-road') color = 'rgba(50, 255, 100, 0.08)'; // Green
            if (filter === 'Nacionais') color = 'rgba(255, 165, 0, 0.1)'; // Orange/Vibrant
            
            gsap.to(light, { background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`, duration: 1 });

            // Fade out grid, swap, fade in
            gsap.to('#motos-grid', { 
                opacity: 0, 
                y: 20, 
                duration: 0.4, 
                onComplete: () => {
                    renderMotos(filter);
                    gsap.to('#motos-grid', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 });
                }
            });
        });
    });
}

function renderMotos(filter) {
    const grid = document.getElementById('motos-grid');
    grid.innerHTML = '';

    const filtered = filter === 'Todas' ? MOTOS : MOTOS.filter(m => m.category === filter);

    filtered.forEach((moto, i) => {
        const card = document.createElement('div');
        card.className = "moto-card group relative";
        card.innerHTML = `
            <div class="card-inner relative overflow-hidden aspect-[4/5] bg-card border border-white/5">
                <img src="${moto.image}" alt="${moto.name}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                <!-- Hover Info -->
                <div class="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span class="text-[9px] uppercase font-black tracking-[0.5em] text-primary mb-2 block">${moto.category}</span>
                    <h3 class="font-display text-2xl font-black uppercase mb-6">${moto.name}</h3>
                    
                    <div class="flex justify-between items-end border-t border-white/10 pt-6">
                        <div>
                            <span class="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Venda</span>
                            <span class="font-bold text-lg">MZN ${moto.price}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-[9px] text-white/40 uppercase tracking-widest block mb-1">Aluguel / dia</span>
                            <span class="text-primary font-bold">MZN ${moto.rent}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Floating CTA -->
            <a href="https://wa.me/258840000000?text=Interesse na ${moto.name}" 
               class="magnetic-btn absolute -bottom-6 -right-6 w-20 h-20 bg-primary text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500 z-20 shadow-2xl">
                <i data-lucide="message-circle" class="w-8 h-8"></i>
            </a>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

// --- SCROLL ANIMATIONS ---
function initScrollAnimations() {
    gsap.utils.toArray('.reveal-el').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// --- HEADER LOGIC ---
function initHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('glass-nav');
        } else {
            header.classList.remove('glass-nav');
        }
    });
}

// --- PREMIUM INTERACTIONS ---
function initPremiumInteractions() {
    // 3D Tilt for cards
    document.addEventListener('mousemove', (e) => {
        const studioLight = document.getElementById('studio-light');
        if (studioLight) {
            gsap.to(studioLight, {
                background: `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(212, 160, 23, 0.08) 0%, transparent 60%)`,
                duration: 0.5
            });
        }

        document.querySelectorAll('.moto-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                
                gsap.to(card.querySelector('.card-inner'), {
                    rotationY: dx / 10,
                    rotationX: -dy / 10,
                    duration: 0.5
                });
            } else {
                gsap.to(card.querySelector('.card-inner'), {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.5
                });
            }
        });
    });

    // Magnetic Buttons
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// --- SCROLL PROGRESS ---
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scroll-progress').style.width = scrolled + "%";
    });
}
