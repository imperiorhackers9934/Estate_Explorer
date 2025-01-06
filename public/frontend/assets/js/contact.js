document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myform');
    if (!form) {
        console.error('Form not found!');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // URL encode the form inputs to handle special characters and spaces
        const subject = encodeURIComponent('Estate-Explorer Contact');
        const body = encodeURIComponent(`Name: ${name}\n\nMessage: ${message}`);
        const bcc = encodeURIComponent('someone.else@example.com');

        // Ensure the fields are filled before opening
        if (!email || !name || !message) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        // Create the Gmail URL with the encoded data
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}&bcc=${bcc}`;

        // Check if the email field is valid before trying to open Gmail
        if (isValidEmail(email)) {
            window.open(gmailUrl, '_blank');
        } else {
            alert("Please provide a valid email address.");
        }
    });

    // Function to validate email format
    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }
});
