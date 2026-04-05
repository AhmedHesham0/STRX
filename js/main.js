// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Global Initial Animations
document.addEventListener("DOMContentLoaded", (event) => {
    
    // Ultimate Content Protection (Disable Right Click & Drag)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => {
        if(e.target.nodeName === 'IMG' || e.target.nodeName === 'VIDEO') e.preventDefault();
    });
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: {className: 'navbar-scrolled', targets: '.navbar'}
    });

    const tl = gsap.timeline({ paused: true });
    
    // Entry animations
    tl.from(".nav-logo, .nav-links li, .nav-actions", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });

    if (document.querySelector(".hero-title")) {
        tl.from(".hero-title", {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.6")
        .from(".hero-subtitle", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.8")
        .from(".hero-buttons", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.6")
        .from(".hero-img", {
            scale: 0.8,
            opacity: 0,
            rotation: 15,
            x: 50,
            duration: 1.5,
            ease: "elastic.out(1, 0.7)"
        }, "-=1.2");
    }

    // Preloader Splash Logic
    const preloader = document.querySelector('.preloader');
    const hasPlayedIntro = sessionStorage.getItem('strx_intro_played');
    
    const navEntries = window.performance.getEntriesByType("navigation");
    const isReload = navEntries.length > 0 && navEntries[0].type === "reload";
    
    if (preloader && (!hasPlayedIntro || isReload)) {
        document.body.style.overflow = 'hidden'; // Lock scroll while loading
        
        const completePreloaderFade = () => {
            sessionStorage.setItem('strx_intro_played', 'true'); // Flag as played for session
            gsap.to(preloader, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = "none";
                    document.body.style.overflow = '';
                    
                    const splashVid = preloader.querySelector('video');
                    if (splashVid) {
                        splashVid.pause();
                        splashVid.removeAttribute('src'); // Completely unload video buffer
                        splashVid.load();
                        splashVid.remove();
                    }
                    
                    tl.play(); // Kick off the hero staggered animations!
                }
            });
        };

        const splashVid = preloader.querySelector('video');
        if (splashVid) {
            splashVid.muted = false; // Force sound
            splashVid.play().catch(e => console.log("Autoplay blocked. Waiting for click."));
            splashVid.addEventListener('ended', completePreloaderFade);
            
            preloader.addEventListener('click', () => {
                splashVid.play();
                const overlay = preloader.querySelector('.intro-overlay');
                if (overlay) overlay.style.display = 'none';
            });
        } else {
            setTimeout(completePreloaderFade, 2500);
        }
    } else {
        if(preloader) {
            preloader.style.display = "none"; // Hide immediately if bypassing
            const v = preloader.querySelector('video');
            if (v) { 
                v.pause(); 
                v.removeAttribute('src'); 
                v.load(); 
                v.remove(); 
            }
            preloader.remove(); // Nuke from DOM completely
        }
        tl.play(); // Play site timeline immediately
    }

    // Parallax background elements
    gsap.to(".bg-element-1", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        } 
    });

    // Setup Lenis + ScrollTrigger sync
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0, 0)

    // Benefits animation
    gsap.utils.toArray('.benefit-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: ".benefits-section",
                start: "top 80%"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out"
        });
    });

    // Products animation
    gsap.utils.toArray('.products-carousel .product-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: ".featured-products",
                start: "top 80%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out"
        });
    });

    // Science Section animation
    gsap.from(".science-content > *", {
        scrollTrigger: {
            trigger: ".science-section",
            start: "top 80%"
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });
    
    gsap.from(".science-image", {
        scrollTrigger: {
            trigger: ".science-section",
            start: "top 80%"
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
    
    // Custom Cursor tracking
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out"
            });
        });
        
        const hoverElements = document.querySelectorAll('a, button, .cart-btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Hero Mouse Parallax Effect
    // Hero Mouse Parallax Effect
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroTitle = document.querySelector('.hero-title');
    const heroSection = document.querySelector('.hero');
    if (heroSection && heroImageWrapper && heroTitle) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            // Track the wrapper so it doesn't kill the CSS float animation on the internal image
            gsap.to(heroImageWrapper, {
                x: x * 3,
                y: y * 3,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.to(heroTitle, {
                x: -x * 2,
                y: -y * 2,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.to(".bg-element-1", {
                x: -x * 4,
                y: -y * 4,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
        
        // Reset position when leaving
        heroSection.addEventListener('mouseleave', () => {
             gsap.to([heroImageWrapper, heroTitle], {
                 x: 0,
                 y: 0,
                 duration: 1,
                 ease: "power2.out"
             });
        });
    }

    // --- GLOBAL CART LOGIC ---
    const updateCartBadge = () => {
        const cart = JSON.parse(localStorage.getItem('strx_cart')) || [];
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.innerText = totalItems;
        });
    };
    
    updateCartBadge(); // Init immediately on page load

    document.querySelectorAll('.btn-add, .btn-block').forEach(btn => {
        if (btn.innerText.toLowerCase().includes("add to cart") || btn.classList.contains("btn-add")) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.classList.contains('is-adding')) return;
                this.classList.add('is-adding');
                
                const originalText = this.innerHTML;
                const originalWidth = this.offsetWidth;
                this.style.minWidth = originalWidth + 'px';
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ADDING...';
                
                // Get Product Info
                let name = "STRX Pure Creatine";
                let price = 49.99;
                let img = "img/16.png";
                let qtyToAdd = 1;
                
                const card = this.closest('.product-card');
                if (card) {
                    name = card.querySelector('.product-title')?.innerText || name;
                    const pText = card.querySelector('.product-price')?.innerText || "$49.99";
                    price = parseFloat(pText.replace(/[^0-9.]/g, ''));
                    img = card.querySelector('.product-img')?.getAttribute('src') || img;
                } else if (this.closest('.purchase-actions')) {
                    name = document.querySelector('.product-info h1')?.innerText || name;
                    const pText = document.querySelector('.product-info .price')?.innerText || "$49.99";
                    price = parseFloat(pText.replace(/[^0-9.]/g, ''));
                    img = document.querySelector('#main-product-img')?.getAttribute('src') || img;
                    const qtyInput = document.getElementById('qty');
                    if (qtyInput) qtyToAdd = parseInt(qtyInput.value) || 1;
                }

                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> ADDED!';
                    this.style.backgroundColor = '#1b5e20'; 
                    this.style.borderColor = '#1b5e20';
                    this.style.color = '#ffffff';
                    
                    // Push to local storage
                    const cart = JSON.parse(localStorage.getItem('strx_cart')) || [];
                    const existingItem = cart.find(i => i.name === name);
                    if (existingItem) {
                        existingItem.qty += qtyToAdd;
                    } else {
                        cart.push({ name, price, img, qty: qtyToAdd });
                    }
                    localStorage.setItem('strx_cart', JSON.stringify(cart));
                    
                    updateCartBadge();
                    
                    document.querySelectorAll('.cart-badge').forEach(badge => {
                        gsap.from(badge, {scale: 1.8, duration: 0.4, ease: "back.out(2)", color: "#1b5e20", backgroundColor: "#ffffff"});
                    });
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.backgroundColor = '';
                        this.style.borderColor = '';
                        this.style.color = '';
                        this.style.minWidth = '';
                        this.classList.remove('is-adding');
                    }, 1200);
                }, 400); 
            });
        }
    });

    // --- RENDER CART PAGE --- 
    const cartContainer = document.querySelector('.cart-items');
    if (cartContainer) {
        const renderCart = () => {
            const cart = JSON.parse(localStorage.getItem('strx_cart')) || [];
            
            let html = '<h1 style="font-size: 3rem; margin-bottom: 2rem;">YOUR CART</h1>';
            let subtotal = 0;
            
            if (cart.length === 0) {
                html += '<p style="font-size: 1.2rem; margin-bottom: 2rem; color: var(--text-secondary);">Your cart is currently empty.</p><a href="products.html" class="btn-primary" style="display:inline-block">Shop Premium Formulas</a>';
                document.querySelector('.cart-summary').style.display = 'none';
            } else {
                document.querySelector('.cart-summary').style.display = 'block';
                cart.forEach((item, index) => {
                    subtotal += item.price * item.qty;
                    html += `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="item-details">
                            <h3 class="item-title">${item.name}</h3>
                            <div class="item-price">$${item.price.toFixed(2)}</div>
                            <div class="item-actions">
                                <div class="qty-controls">
                                    <button class="qty-btn" onclick="window.updateCartItem(${index}, -1)">-</button>
                                    <span>${item.qty}</span>
                                    <button class="qty-btn" onclick="window.updateCartItem(${index}, 1)">+</button>
                                </div>
                                <button class="remove-btn" onclick="window.removeCartItem(${index})">Remove</button>
                            </div>
                        </div>
                    </div>`;
                });
            }
            
            cartContainer.innerHTML = html;
            
            const summaryTitle = document.querySelector('.summary-title');
            if (summaryTitle) {
                const summaryContainer = summaryTitle.parentElement;
                summaryContainer.innerHTML = `
                    <h3 class="summary-title">ORDER SUMMARY</h3>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total (USD)</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <a href="checkout.html" class="btn-primary btn-checkout" style="display: block; text-align: center;">PROCEED TO CHECKOUT</a>
                `;
            }
            updateCartBadge();
        };

        window.updateCartItem = (index, change) => {
            const cart = JSON.parse(localStorage.getItem('strx_cart')) || [];
            if (cart[index]) {
                cart[index].qty += change;
                if (cart[index].qty <= 0) cart.splice(index, 1);
                localStorage.setItem('strx_cart', JSON.stringify(cart));
                renderCart();
            }
        };

        window.removeCartItem = (index) => {
            const cart = JSON.parse(localStorage.getItem('strx_cart')) || [];
            if (cart[index]) {
                cart.splice(index, 1);
                localStorage.setItem('strx_cart', JSON.stringify(cart));
                renderCart();
            }
        };

        renderCart();
    }

    // --- RENDER CHECKOUT PAGE TOTAL ---
    const checkoutSummary = document.querySelector('.checkout-section .summary-total span:last-child');
    if (checkoutSummary) {
        const cart = JSON.parse(localStorage.getItem('strx_cart')) || [];
        const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
        if (subtotal > 0) checkoutSummary.innerText = '$' + subtotal.toFixed(2);
    }

});
