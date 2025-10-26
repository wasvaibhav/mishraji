
        
        
        // Navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('nav a');
            const mobileMenu = document.querySelector('.mobile-menu');
            const nav = document.querySelector('nav');
            const pages = document.querySelectorAll('.page-content');
            const header = document.querySelector('header');

            // Header scroll effect
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // Mobile menu toggle
            mobileMenu.addEventListener('click', function() {
                nav.classList.toggle('active');
                this.textContent = nav.classList.contains('active') ? '✕' : '☰';
            });

            // Navigation click handler
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();

                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    // Hide all pages
                    pages.forEach(page => {
                        page.style.display = 'none';
                    });

                    // Show selected page
                    const targetId = this.getAttribute('href').substring(1);
                    document.getElementById(targetId).style.display = 'block';

                    // Animate review cards when reviews page is shown
                    if (targetId === 'reviews') {
                        setTimeout(animateReviewCards, 300);
                    }

                    // Close mobile menu if open
                    nav.classList.remove('active');
                    mobileMenu.textContent = '☰';

                    // Scroll to top
                    window.scrollTo(0, 0);
                });
            });

            // Form submission handlers
            document.getElementById('bookingForm').addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you for your booking! We will contact you shortly to confirm your ride.', 'success');
                this.reset();
            });

            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                this.reset();
            });
            

            // Form submission handlers






            // Star rating functionality
            const stars = document.querySelectorAll('.star-rating i');
            const ratingInput = document.getElementById('rating-value');

            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = this.getAttribute('data-rating');
                    ratingInput.value = rating;

                    stars.forEach(s => {
                        if (s.getAttribute('data-rating') <= rating) {
                            s.classList.remove('far');
                            s.classList.add('fas', 'active');
                        } else {
                            s.classList.remove('fas', 'active');
                            s.classList.add('far');
                        }
                    });
                });

                star.addEventListener('mouseover', function() {
                    const rating = this.getAttribute('data-rating');

                    stars.forEach(s => {
                        if (s.getAttribute('data-rating') <= rating) {
                            s.classList.remove('far');
                            s.classList.add('fas');
                        } else {
                            s.classList.remove('fas');
                            s.classList.add('far');
                        }
                    });
                });

                star.addEventListener('mouseout', function() {
                    const currentRating = ratingInput.value;

                    if (currentRating) {
                        stars.forEach(s => {
                            if (s.getAttribute('data-rating') <= currentRating) {
                                s.classList.remove('far');
                                s.classList.add('fas', 'active');
                            } else {
                                s.classList.remove('fas', 'active');
                                s.classList.add('far');
                            }
                        });
                    } else {
                        stars.forEach(s => {
                            s.classList.remove('fas');
                            s.classList.add('far');
                        });
                    }
                });
            });

            // Review form submission
            document.getElementById('reviewForm').addEventListener('submit', function(e) {
                e.preventDefault();

                if (!ratingInput.value) {
                    showNotification('Please select a rating', 'error');
                    return;
                }

                showNotification('Thank you for your review! It will be published after moderation.', 'success');
                this.reset();

                // Reset stars
                stars.forEach(star => {
                    star.classList.remove('fas', 'active');
                    star.classList.add('far');
                });
                ratingInput.value = '';
            });

            // Animate review cards
            function animateReviewCards() {
                const reviewCards = document.querySelectorAll('.review-card');
                reviewCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, index * 200);
                });
            }

            // Show notification
            function showNotification(message, type) {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                notification.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 15px 25px;
                    background: ${type === 'success' ? 'var(--success)' : 'var(--secondary)'};
                    color: white;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 10000;
                    transform: translateX(300px);
                    transition: transform 0.3s ease;
                `;

                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);

                setTimeout(() => {
                    notification.style.transform = 'translateX(300px)';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 4000);
            }

            // Initialize animations
            animateReviewCards();
        });