const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// --- Twilio Setup (for WhatsApp) ---
const twilio = require("twilio");
const twilioSid = functions.config().twilio.sid;
const twilioToken = functions.config().twilio.token;
const twilioNumber = functions.config().twilio.sandbox_number;
const twilioClient = new twilio(twilioSid, twilioToken);

/**
 * Cloud Function to send WhatsApp notification
 * when a new booking is created.
 */
exports.sendBookingNotification = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snap, context) => {

        // 1. Get the booking data
        const booking = snap.data();

        // 2. Format the date
        const bookingDate = booking.bookingDateTime.toDate().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });

        // 3. --- Create WhatsApp Message ---
        const whatsappBody = `*New Booking!*
-------------------------
Name: ${booking.name}
Phone: ${booking.phone}
From: ${booking.pickup}
To: ${booking.destination}
Date: ${bookingDate}
Trip: ${booking.tripType}
Car: ${booking.taxiType}
-------------------------
Please confirm with the customer.`;

        // 4. --- Send WhatsApp Message ---
        try {
            await twilioClient.messages.create({
                from: twilioNumber, // Your Twilio Number
                body: whatsappBody,
                to: "whatsapp:+919876543210", // !! REPLACE with YOUR admin WhatsApp number
            });
            console.log("Successfully sent WhatsApp notification.");
        } catch (error) {
            console.error("Error sending WhatsApp notification:", error);
        }

        return null;
    });