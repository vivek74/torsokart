function enableButton2() {
    document.getElementById("link2").disabled = false;
}

$(document).ready(function(){        	
	$("#alert1").hide();
	$(".link4").click(function(){
		$("#alert1").show();
	});
});

$(document).ready(function(){        	
	$("#p1").hide();
	$("#link2").click(function(){
		$("#p1").show();
		$("#alert1").hide();
	});
});

$(document).ready(function(){        	
	$("#p2").hide();
	$("#link3").click(function(){
		$("#p2").show();
	});
});

$(document).ready(function(){
	$('#send').on('click', function(){
    	$('#send').attr("disabled", true);
	});
});

//promocode
/*function checkpromo() {
    var mypromo = document.getElementById("mypromo").value;
    document.getElementById("demo").innerHTML = mypromo;
}*/