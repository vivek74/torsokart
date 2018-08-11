Stripe.setPublishableKey('pk_test_zPhY2OqFJrCtttGd3SMO9iWB');
var $form = $('#checkout-form');
$form.submit(function(event){
	$('#charge-error').addClass('hidden');
	$form.find('button').prop('disable',true);
	Stripe.card.createToken({
		number: $('#card-number').val(),
		cvc: $('#card-cvc').val(),
		exp_month: $('#card-expiry-month').val(),
		exp_year: $('#card-expiry-year').val(),
		name: $('#card-name').val(),
	}, stripeResponseHandler);
	return false;
});

function stripeResponseHandler(status, response){

	if (response.error){
		$('#charge-error').text(response.error.message);
		$('#charge-error').removeClass('invisible');
		$form.find('button').prop('disable', false);
	} else {
		var token= response.id;
		$form.append($('<input type="hidden" name="stripeToken" />').val(token));
		$form.get(0).submit();
	}
}

//changewith