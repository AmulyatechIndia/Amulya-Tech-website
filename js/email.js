// https://dashboard.emailjs.com/admin/templates/i34r28t/content

function sendEmail() {

   let submitBtn = document.getElementById("contact-submit");

   let username = document.getElementById("contact-name").value.trim();
   let email = document.getElementById("contact-email").value.trim();
   let phone = document.getElementById("contact-phone").value.trim();
   let service = document.getElementById("contact-service").value.trim();
   let message = document.getElementById("contact-message").value.trim();

   let errors = [];

   if (username === "") {
      errors.push("Name is required");
   }

   if (email === "") {
      errors.push("Email is required");
   }


   if (message === "") {
      errors.push("Message is required");
   }

   if (service === "") {
      errors.push("Service is required");
   }

   if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
   }


   let params = {
      name: username,
      email: email,
      service: service,
      phone: phone,
      subject: "Message From Your Website",
      message: message,
   };

   submitBtn.disabled = true;
   submitBtn.classList.add("is-loading");

   emailjs.send('service_8souimj', 'template_rkgjnja', params).then(function (response) {
      let msg = username + " mail has been sent successfully. We will connect with you shortly.";
      alert(msg);
      document.getElementById("contact-name").value = "";
      document.getElementById("contact-email").value = "";
      document.getElementById("contact-phone").value = "";
      document.getElementById("contact-service").value = "";
      document.getElementById("contact-message").value = "";
   }, function (error) {
      alert("Failed to send email. Please try again later.");
      console.error(error);
   }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
   });
}
