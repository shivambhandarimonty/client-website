// Form submission handle karne ke liye event listener
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Default form submit ko rokna taaki hum pehle logic chala sake

    // Form se saari details nikalna
    const name = document.getElementById('customer_name').value;
    const phone = document.getElementById('customer_phone').value;
    const email = document.getElementById('customer_email').value;
    const date = document.getElementById('booking_date').value;
    const beds = document.getElementById('beds_count').value;
    const guests = document.getElementById('guests_count').value;
    const submitBtn = document.getElementById('finalBookBtn');

    // Button ko disable karna taaki baar baar click na ho
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    // --- STEP 1: Data ko Database mein save karna (AJAX use karke) ---
    const formData = new FormData();
    formData.append('customer_name', name);
    formData.append('customer_phone', phone);
    formData.append('customer_email', email);
    formData.append('booking_date', date);
    formData.append('beds_count', beds);
    formData.append('guests_count', guests);

    fetch('save_booking.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // --- STEP 2: Database mein save hone ke baad GPay kholna ---
        const upiId = "hotelkedar@okaxis"; // Bhai yahan client ki asli UPI ID daal dena
        const amount = "2100.00"; // Room ka price (Fix ya dynamic kar sakte ho)
        const hotelName = "Hotel Kedareshwaram";
        const note = `Booking for ${name} on ${date}`;

        // UPI Deep Link jo mobile par GPay/UPI apps trigger karega
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(hotelName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

        // User ko Payment page par bhejna
        window.location.href = upiUrl;

        // Thodi der baad success message dikhana (agar redirect na ho)
        setTimeout(() => {
            alert("Agar GPay nahi khula, toh kripya manual payment karein ya WhatsApp par contact karein.");
            submitBtn.innerText = "CONFIRM BOOKING & PAY";
            submitBtn.disabled = false;
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Kuch error aaya hai, kripya dobara koshish karein.");
        submitBtn.innerText = "CONFIRM BOOKING & PAY";
        submitBtn.disabled = false;
    });
});

// Payment button UI toggle
function initiateGPay() {
    const btns = document.querySelectorAll('.payment-btn');
    btns.forEach(btn => btn.classList.remove('active', 'bg-gold', 'text-white'));
    
    // Select kiye gaye button ko highlight karna
    event.currentTarget.classList.add('active', 'bg-gold', 'text-white');
}

// Check-in date ko aaj se pehle ki date par select na hone dena
const today = new Date().toISOString().split('T')[0];
document.getElementById('booking_date').setAttribute('min', today); 