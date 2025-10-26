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
const db = getFirestore(app); // You


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
            createdAt: new Date() // Timestamp for when it was saved
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
