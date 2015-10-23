//$( document ).on( "pageinit", "[data-role='page']", function() {
//var page = "#" + $( this ).attr( "id" ),
// Get the filename of the next page that we stored in the data-next attribute
//next = $( this ).jqmData( "next" ),
// Get the filename of the previous page that we stored in the data-prev attribute
//prev = $( this ).jqmData( "prev" );
// Check if we did set the data-next attribute
//if ( prev ) {
// Prefetch the next page
//$.mobile.loadPage( next + ".html" );
// Navigate to next page on swipe right
$("#post").live("swiperight", function(){
   //$.mobile.changePage( prev + ".html", { transition: "slide", reverse: true } );
   $.mobile.back();
});
$("#explorepage").live("swiperight", function(){
  // $.mobile.changePage( prev + ".html", { transition: "slide", reverse: true } );
  $.mobile.back();
});
//});
