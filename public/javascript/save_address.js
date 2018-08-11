//change url
function ChangeUrl(title, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Title: title, Url: url };
        history.pushState(obj, obj.Title, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}
// end

function selectAdd(user, addressId){
		event.preventDefault();
		event.stopPropagation();
		var data={ch_address:{"add_id":addressId}};
		console.log(user);
		console.log(addressId);
		$.ajax({
			beforeSend: function(){
				
				$('.lodingLogin').css("visibility", "visible");
			},
			url:"/checkout/update/" + user +"?_method=PUT",
			type:"POST",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('check').innerHTML=result;
			//$("#check").html(JSON.stringify(result));
			
			$('.lodingLogin').css("visibility", "hidden");
			enableButton2();
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
}

//comments
$(document).ready(function(){
	$("#comment_ajax").on('click',function(event) 
	{	
		event.preventDefault();
		event.stopPropagation();
		var data={new:$("#comment_input").val()};
		console.log(JSON.stringify(data));
		$.ajax({
			beforeSend: function(){
				
				$('.commentLogin').css("visibility", "visible");
			},
			url:"/category/" + $("#comment_data").data("categoryname") + "/" + $("#comment_data").data("categoryid") + "/comments",
			type:"POST",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('show_comments').innerHTML=result;
			removeTextFromInput("comment_input");
			$('.commentLogin').css("visibility", "hidden");
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
	});
});

var removeTextFromInput = function(input){
	var removeThis = document.getElementById(input);
	removeThis.value = "";
};

//add address
$(document).ready(function(){
	$("#addNewAdd").on('click',function(event) 
	{	
		event.preventDefault();
		event.stopPropagation();
		var data={ch_address:{"firstName":$("#firstName").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val(), "phoneNo": $("#phoneNo").val()}};
		console.log(JSON.stringify(data));
		$.ajax({
			url:"/checkout/add/" + $("#addAddres").data("userid"),
			type:"POST",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('showAdd').innerHTML=result;
			$('#exampleModalCenter').modal('hide');
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
	});
});

//increse qty(cart)

$(document).ready(function(){
	$("#addQty").on('click',function(event) 
	{	
		event.preventDefault();
		event.stopPropagation();
		//var data={ch_address:{"firstName":$("#firstName").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val()}};
		//console.log(JSON.stringify(data));
		$.ajax({
			//url:"/checkout/add/" + $("#addAddres").data("userid"),
			url:"/increase/" + $("#addQty").data("productId"),
			type:"GET",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('showAdd').innerHTML=result;
			//$('#exampleModalCenter').modal('hide');
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
	});
});

//allshirts landing page
function allshirts(data){
		event.preventDefault();
		event.stopPropagation();
		//var data={ch_address:{"firstName":$("#alltshirts").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val(), "phoneNo": $("#phoneNo").val()}};
		console.log(JSON.stringify(data));
		$.ajax({
			beforeSend: function(){
				$('.ajax-loader-page').css("visibility", "visible");
			},
			url:"/allproduct/" + data,
			type:"GET",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('showAllshirts').innerHTML=result;
			$('.ajax-loader-page').css("visibility", "hidden");
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
}

//trending landing page
function trending(data){
		event.preventDefault();
		event.stopPropagation();
		//var data={ch_address:{"firstName":$("#alltshirts").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val(), "phoneNo": $("#phoneNo").val()}};
		console.log(JSON.stringify(data));
		$.ajax({
			beforeSend: function(){
				$('.ajax-loader-page').css("visibility", "visible");
			},
			url:"/trending/" + data,
			type:"GET",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('showtrending').innerHTML=result;
			$('.ajax-loader-page').css("visibility", "hidden");
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
}

//text landing page
function textlanding(data){
	//alert(data);
		event.preventDefault();
		event.stopPropagation();
		//var data={ch_address:{"firstName":$("#alltshirts").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val(), "phoneNo": $("#phoneNo").val()}};
		console.log(JSON.stringify(data));
		$.ajax({
			beforeSend: function(){
				$('.ajax-loader-page').css("visibility", "visible");
			},
			url:"/text/" + data,
			type:"GET",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('showtext').innerHTML=result;
			$('.ajax-loader-page').css("visibility", "hidden");
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
}

//best deals landing page
function bestDeals(data){
		event.preventDefault();
		event.stopPropagation();
		//var data={ch_address:{"firstName":$("#alltshirts").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val(), "phoneNo": $("#phoneNo").val()}};
		console.log(JSON.stringify(data));
		$.ajax({
			beforeSend: function(){
				$('.ajax-loader-page').css("visibility", "visible");
			},
			url:"/best-deals/" + data,
			type:"GET",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('showbestdeals').innerHTML=result;
			$('.ajax-loader-page').css("visibility", "hidden");
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert(err);
		});
}

//show all lode more when scrolling

// $(window).scroll(function() {
//   if($(window).scrollTop() + $(window).height() >= $(document).height()){
//      //Your code here
//   }
// });

// $(window).scroll(function() {
//     if($(window).scrollTop() == $(document).height() - $(window).height()) {
           
//     }
// });


//main page load more

function mainPageLoad(data,category){
	event.preventDefault();
	event.stopPropagation();
	console.log(JSON.stringify(data));
	$.ajax({
		beforeSend: function(){
			$('.ajax-loader-page').css("visibility", "visible");
		},
		url:"/page/" + category + "/" + data,
		type:"GET",
		contentType:"application/json",
		data:JSON.stringify(data)
	}).done(function(result){
		document.getElementById('mainLoadShow').innerHTML=result;
		$('.ajax-loader-page').css("visibility", "hidden");

	})
	.fail(function(err)
	{
		alert(err);
		$('.ajax-loader-page').css("visibility", "hidden");
	});
}

//front page

function frontPageAll(data,category){
	// alert(category);
	event.preventDefault();
	event.stopPropagation();

	//console.log(JSON.stringify(data));
	$.ajax({
		global: true,
		beforeSend: function(category){
			$('.ajax-loader').css("visibility", "visible");
			
		},
		url:"/StartingPage/" + category + "/" + data,
		type:"GET",
		contentType:"application/json",
		data:JSON.stringify(data)
	}).done(function(result){
		document.getElementById('content').innerHTML=result;
		$('.ajax-loader').css("visibility", "hidden");
		ChangeUrl(category, category);
	})
	.fail(function(err)
	{
		alert(err);
		$('.ajax-loader-page').css("visibility", "hidden");
	});
	//alert("hi");
}


//login through ajax

$(document).ready(function(){
	$("#loginAjaxSubmit").on('click',function(event) 
	{	
		event.preventDefault();
		event.stopPropagation();
		 var data={"username":$("#username").val(), "password":$("#password").val()};
		 //console.log(JSON.stringify(data));
		$.ajax({
			beforeSend: function(category){
				$('.lodingLogin').css("visibility", "visible");
				
			},
			url:"/login-model",
			type:"POST",
			contentType:"application/json",
			data:JSON.stringify(data)
		}).done(function(result){
			//alert(result);
			document.getElementById('user-status-header').innerHTML=result;
			$('#loginModal').modal('hide');
			$('.lodingLogin').css("visibility", "hidden");
			// window.location="/checkout";
		})
		.fail(function(err)
		{
			alert("Username and password is wrong");
			$('.lodingLogin').css("visibility", "hidden");
		});
		//alert("hi");
	});
});

//logout

$(document).ready(function(){
	$("#logoutAjaxSubmit").on('click',function(event) 
	{	
		//alert("logout");
		event.preventDefault();
		event.stopPropagation();
		$.ajax({
			beforeSend: function(category){
				$('.header-loading').css("visibility", "visible");
			},
			url:"/logout-model",
			type:"GET",
			contentType:"application/json",
		}).done(function(result){
			document.getElementById('user-status-header').innerHTML=result;
			$('.header-loading').css("visibility", "hidden");
		})
		.fail(function(err)
		{
			alert("Something went wrong");
			$('.lodingLogin').css("visibility", "hidden");
		});
	});
});

// adding cart

function cartUpdate(categoryID){
	// alert(category);
	event.preventDefault();
	event.stopPropagation();
	var data={ "size" : $("#sizehide").val() };
	//alert(JSON.stringify(data));
	//var data={ch_address:{"firstName":$("#firstName").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val(), "phoneNo": $("#phoneNo").val()}};
	console.log(JSON.stringify(data));
	$.ajax({
		global: true,
		beforeSend: function(categoryID){
			$('.lodingLogin').css("visibility", "visible");	
		},
		url:"/add-to-cart/" + categoryID,
		type:"POST",
		contentType:"application/json",
		data:JSON.stringify(data)
	}).done(function(result){
		document.getElementById('cart-status-header').innerHTML=result;
		$('#add_to_cart').attr('disabled', 'disabled');
		$('.lodingLogin').css("visibility", "hidden");
		alert("Successfully added");
		//ChangeUrl(category, category);
	})
	.fail(function(err)
	{
		alert(err);
		//$('.ajax-loader-page').css("visibility", "hidden");
	});
}
// upload image to s3

$(document).ready(function(){
	$("#upload").on('click',function(event) 
	{	
		// event.preventDefault();
		// event.stopPropagation();
		// var data={ch_address:{"firstName":$("#firstName").val(), "lastName": $("#lastName").val(), "hostalno": $("#Hostal_no").val(), "roomno": $("#room_no").val(), "phoneNo": $("#phoneNo").val()}};
		// console.log(JSON.stringify(data));
		// $.ajax({
		// 	url:"/checkout/add/" + $("#addAddres").data("userid"),
		// 	type:"POST",
		// 	contentType:"application/json",
		// 	data:JSON.stringify(data)
		// }).done(function(result){
		// 	//alert(result);
		// 	document.getElementById('showAdd').innerHTML=result;
		// 	$('#exampleModalCenter').modal('hide');
		// 	// window.location="/checkout";
		// })
		// .fail(function(err)
		// {
		// 	alert(err);
		// });
		alert("uploaded");
	});
});

