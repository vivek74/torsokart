$(document).ready(function(){
$('#category-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/category/:category?' + search, function(data) {
    $('#category-grid').html('');
    data.reverse().forEach(function(category) {
      $('#category-grid').append(`
        <div class="col-md-3 col-sm-6 col-xs-6 card_mobile_view" id="fix">
          <div class="card1 index-img">
            <a href="/category/${ category.category }/${ category._id }"><img class="card-img-top " src="${ category.image }" alt="Card image cap"></a>
            <div class="card-body" id="card-edit">
              <p class="index-font">${ category.name }</p>
              <hr id="mobile_view_hr">
              <p class="card-text float-left" style="font-weight: bold; color: #2969b0;"><i class="fas fa-rupee-sign"></i> ${ category.cost }</p>
              <a class="card-text float-right index-view-more" href="/category/${ category.category }/${ category._id }">View more <i class="fa fa-angle-right" aria-hidden="true"></i></a>
            </div>  
          </div>
        </div>
      `);
    });
  });
});

  $('#category-search').submit(function(event) {
    event.preventDefault();
  });
});

