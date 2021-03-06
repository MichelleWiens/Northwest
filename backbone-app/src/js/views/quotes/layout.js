define([
	'jquery',
    'marionette',
    'hbs!tpl/quotes/layout',
    'jquery-validation'
], function ($, Marionette, Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        events: {
        	'click .submit': 'submit'
        },

        onShow: function() {
          grecaptcha.render('recaptcha', {'sitekey':'6Le7sfgSAAAAAEKHFn6AmFsNz-pq2mZtGMWJF0V0', 'theme': 'light'})

 $("input,textarea").jqBootstrapValidation({
   preventSubmit: true,
      submitError: function($form, event, errors) {
      // something to have when submit produces an error ?
      // Not decided if I need it yet
   },
   submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from ORM
      var name = $("input#fullName").val();  
      var address = $("input#address").val();  
      var phone = $("input#phone").val();  
      var email = $("input#email").val(); 
      var comments = $("textarea#comments").val(); 
      var products = '';
      var heard = $('select#heard').val();


      $('input[type="checkbox"]:checked').each(function() {
        products += $(this).val() + ', '
      });

      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      $.ajaxSetup({ jsonp: null, jsonpCallback: null});
      $.ajax({
        url: "./php/emails.php/",
        type: "POST",
        dataType: "text",
        data: {
          name: name, 
          email: email, 
          phone: phone,
          comments: comments,
          address: address,
          products: products,
          heard: heard,
          recaptcha_response_field: grecaptcha.getResponse(),
        },
        cache: false,
        success: function() {  
          // Success message
          $('#notification').html("<div class='alert alert-success'>");
          $('#notification > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
          .append( "</button>");
          $('#notification > .alert-success')
          .append("<strong>Your request has been sent. </strong>");
          $('#notification > .alert-success')
          .append('</div>');
                
          //clear all fields
          $('#contactForm').trigger("reset");
        },
        error: function(error, error1, error2) {    
            // Fail message
          $('#notification').html("<div class='alert alert-danger'>");
          $('#notification > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>");
          $('#notification > .alert-danger').append("<strong>Sorry "+firstName+" it seems that my mail server is not responding...</strong> Could you please email us directly at <a href='mailto:contactus@northwestresidential.com?Subject=Request a quote'>contactus@northwestresidential.com</a> ? Sorry for the inconvenience!");
          $('#notification > .alert-danger').append('</div>');
        }
      });
    }
  });

        }
    });
});