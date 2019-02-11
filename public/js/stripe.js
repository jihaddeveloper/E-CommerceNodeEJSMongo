//Stripe Payment Key
Stripe.setPublishableKey('pk_test_B9EPqOse0u83mA81X2MgxPRL');

var $form = $('#stripe-checkout-form');

$form.submit(function(event) {

    $('#payment-errors').removeClass('hidden');
    // Disable the submit button to prevent repeated clicks:
    $form.find('button').prop('disabled', true);

    // Request a token from Stripe:
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
    }, stripeResponseHandler);

    // Prevent the form from being submitted:
    return false;
});


function stripeResponseHandler(status, response) {
    // Grab the form:
    var $form = $('#stripe-checkout-form');
  
    if (response.error) {

        // Problem!
  
        // Show the errors on the form:
        $('#payment-errors').text(response.error.message);
        $('#payment-errors').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission
  
    } else {
        // Token was created!
  
        // Get the token ID:
        var token = response.id;
  
        // Insert the token ID into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken">').val(token));
  
        // Submit the form:
        $form.get(0).submit();
      
        // For this demo, we're simply showing the token:
        //alert("Token: " + token);
    }
  };
