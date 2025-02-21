document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    // Gather form data
    const templateParams = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
  
    // Send the email via EmailJS
    emailjs.send('service_ppkg78d', 'template_l2pdu2u', templateParams) // Replace with your service and template IDs
      .then(function(response) {
        document.getElementById('formResponse').innerHTML = `<p>Thanks, ${templateParams.name}! Your message has been sent.</p>`;
      }, function(error) {
        document.getElementById('formResponse').innerHTML = `<p>Oops, something went wrong. Please try again later.</p>`;
      });
  
    this.reset();
  });
  