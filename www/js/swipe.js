$( document ).on( "pageinit", "[data-role='page']", function() {
var page = "#" + $( this ).attr( "id" ),
// Get the filename of the next page that we stored in the data-next attribute
next = $( this ).jqmData( "next" ),
// Get the filename of the previous page that we stored in the data-prev attribute
prev = $( this ).jqmData( "prev" );
// Check if we did set the data-next attribute
if ( next ) {
// Prefetch the next page
$.mobile.loadPage( next + ".html" );
// Navigate to next page on swipe right
$("#post").on("swiperight",function( event ){
   // take 15% of screen good for diffrent screen size
   var window_width_15p = $( window ).width() * 0.15;
   // check if the swipe right is from 15% of screen (coords[0] means X)
   if ( event.swipestart.coords[0] < window_width_15p) {
      // open your panel
      $.mobile.changePage( prev + ".html", { transition: "slide", reverse: true } );
   }
});
$("#explorepage").on("swiperight",function( event ){
   // take 15% of screen good for diffrent screen size
   var window_width_15p = $( window ).width() * 0.15;
   // check if the swipe right is from 15% of screen (coords[0] means X)
   if ( event.swipestart.coords[0] < window_width_15p) {
      // open your panel
      $.mobile.changePage( prev + ".html", { transition: "slide", reverse: true } );
   }
});
});
