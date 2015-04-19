/**
 * Created by killswitch on 4/18/2015.
 */
//var self = $('#selfid').html();
//var stackname = $('#stackname').val();
//var stackid = $('#stack').val();
//var post = false;
imagepostShow();
/*name();
function name(){if(stackid == 0){
    $("#posting").html(self);
}else{
    $("#posting").html(stackname);
}
}*/

function linkpost(){
    $('#imagepost').hide();
    $('#textpost').hide();
    $('#linkpost').show();
    $("#link").prop('required',true);
    $("#image").prop('required',false);
    $("#text").prop('required',false);
    $('#posttype').val("0");
    $('#postimage').removeClass('active');
    $('#posttext').removeClass('active');
    $('#postlink').addClass('active');
}
function textpost(){
    $('#linkpost').hide();
    $('#imagepost').hide();
    $('#textpost').show();
    $("#text").prop('required',true);
    $("#image").prop('required',false);
    $("#link").prop('required',false);
    $('#posttype').val("1");
    $('#postimage').removeClass('active');
    $('#posttext').addClass('active');
    $('#postlink').removeClass('active');
    $("#text").expanding();
}
function imagepostShow(){
    $('#linkpost').hide();
    $('#textpost').hide();
    $('#imagepost').show();
    $("#text").prop('required', false);
    $("#image").prop('required', true);
    $("#link").prop('required', true);
    $('#posttype').val("0");
    $('#posttext').removeClass('active');
    $('#postimage').addClass('active');
    $('#postlink').removeClass('active');
}
$( "#title-input" ).keyup(function() {
    var length = $( this ).val().length;
    $( "#title-count").html(100-length);
});

var stackid = $('#stack').val();
var post = false;

var end = false;
function checkEnd(postnum){
    if(postnum == 0){
        end = true;
        $('.scroll').html('<p>No more posts</p>');
    }
}
var bottom = false;
var startnews = 0;
var user_id = localStorage.getItem("user_id");

$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        if(!end&&!bottom){
            alert("calling");
            bottom = true;
            $('.scroll').html('<p>Loading Posts</p> <div class="loader" style="top: -35px">Loading...</div>');
            startNews(startnews);
        }
    }
});

startNews(startnews);
function startNews(startnum) {
    //$.ajax({
    //    type     : "GET",
    //    cache    : false,
    //    url      : 'http://stacksity.herokuapp.com/mobile-php/feed.php',
    //    data     : {id : stackid , start : startnum, user_id : user_id },
    //    crossDomain : true,
    //    success  : function(data) {
    //        alert(data);
    //    },
    //    error: function(xhr, status, error) {
    //        alert("error: "+xhr.responseText);
    //    }
    //});
    if(end){
        return;
    }
    var postnum = 0;
    $.getJSON('http://stacksity.com/mobile-php/feed.php', {id : stackid , start : startnum, user_id : user_id }, function(data) {
        if(null==data){
            checkEnd(postnum);
        }else{
            $.each(data, function(index, element) {
                if(element.posttype == 0){
                    $('#feed').append(linkspost(element));
                }else if(element.posttype == 1){
                    $('#feed').append(textspost(element));
                }else if(element.posttype == 2){
                    $('#feed').append(imagepost(element));
                }else if(element.posttype == 3){
                    $('#feed').append(videopost(element));
                }
                postnum++;
            });
            bottom = false;
            checkEnd(postnum);
        }
    });
    startnews = startnews + 10;
}
