// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj0vowmaAyBWKFmHSXyk9K-R_a7N2HBpo",
  authDomain: "tours-and-travel-758d3.firebaseapp.com",
  projectId: "tours-and-travel-758d3",
  storageBucket: "tours-and-travel-758d3.firebasestorage.app",
  messagingSenderId: "356760379895",
  appId: "1:356760379895:web:37c1a9334670c25b5acef2",
  measurementId: "G-K86TV3CZ2M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 


function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
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

document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // --- Get data from your form (NOW MATCHING YOUR HTML IDs) ---
    const pickup = document.getElementById('pickup').value;
    const destination = document.getElementById('destination').value;
    const tripType = document.getElementById('trip-type').value;
    const taxiType = document.getElementById('taxi-type').value;
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const customerName = document.getElementById('name').value;
    const customerPhone = document.getElementById('mobile').value;

    // --- Combine date and time (Good for sorting later) ---
    const bookingDateTime = new Date(`${pickupDate}T${pickupTime}`);

    // --- Show loading state (optional) ---
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Booking...';

    
    try {
        // --- Save the booking to Firestore ---
        const docRef = await addDoc(collection(db, "bookings"), {
            pickup: pickup,
            destination: destination,
            tripType: tripType,
            taxiType: taxiType,
            bookingDateTime: bookingDateTime,
            name: customerName,
            phone: customerPhone,
            createdAt: new Date() 
        });

        console.log("Document written with ID: ", docRef.id);
        
        // --- Show success on the frontend ---
        showNotification('Thank you for your booking! We will contact you shortly to confirm your ride.', 'success');
        this.reset();

    } catch (error) {
        console.error("Error adding document: ", error);
        // --- Show error on the frontend ---
        showNotification('Booking failed. Please try again.', 'error');
    } finally {
        // --- Re-enable button ---
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Booking';
    }
});


document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();


    const contactName = document.getElementById('contact-name').value;
    const contactEmail = document.getElementById('contact-email').value;
    const contactPhone = document.getElementById('contact-phone').value;
    const contactSubject = document.getElementById('contact-subject').value;
    const contactMessage = document.getElementById('contact-message').value;


    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        const docRef = await addDoc(collection(db, "contacts"), {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            subject: contactSubject,
            message: contactMessage,
            createdAt: new Date()
        });

        console.log("Contact message saved with ID: ", docRef.id);
        

        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        this.reset();

    } catch (error) {
        console.error("Error saving contact message: ", error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
});

document.getElementById('reviewForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const reviewName = document.getElementById('review-name').value;
    const reviewEmail = document.getElementById('review-email').value;
    const ratingValue = document.getElementById('rating-value').value;
    const reviewTitle = document.getElementById('review-title').value;
    const reviewText = document.getElementById('review-text').value;

    if (!ratingValue) {
        showNotification('Please select a rating', 'error');
        return;
    }

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const docRef = await addDoc(collection(db, "reviews"), {
            name: reviewName,
            email: reviewEmail,
            rating: parseInt(ratingValue),
            title: reviewTitle,
            review: reviewText,
            createdAt: new Date()
        });

        console.log("Review saved with ID: ", docRef.id);
        
        showNotification('Thank you for your review! It will be published after moderation.', 'success');
        this.reset();

        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach(star => {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        });
        document.getElementById('rating-value').value = '';

    } catch (error) {
        console.error("Error saving review: ", error);
        showNotification('Failed to submit review. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Review';
    }
});
