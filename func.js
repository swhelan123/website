// Basic form submission handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    // Collect form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // For now, simply display a success message.
    // In a real-world scenario, you'd send this data to a server.
    const responseDiv = document.getElementById('formResponse');
    responseDiv.innerHTML = `<p>Thanks, ${name}! Your message has been received.</p>`;
    
    // Optionally, clear the form fields
    this.reset();
  });
  