$(document).ready(function(){
  $('#recipeCarousel').carousel({
  interval: 10000
  }); 

$('.showCarouselInner .carousel-item:first-child').addClass('active');

if($(window).width() >= 750){
  $('.showCarousel .carousel-item').each(function(){
        var next = $(this).next();
        var next2 = $(this).next().next();
        if (!next.length) {
        next = $(this).siblings(':first'); 
        }
        next.children(':first-child').clone().appendTo($(this));
        
        if (next.next().length>0) {
        next.next().children(':first-child').clone().appendTo($(this));
        }
        
        else {
          $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
    });
}
  
});

