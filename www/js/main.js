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

var stackid = localStorage.getItem('stack');
var post = false;

var end = false;
var bottom = false;
var startnews = 0;
var user_id = localStorage.getItem("user_id");
var user_stack = localStorage.getItem("stack_id");
var username = localStorage.getItem("username");

function checkEnd(postnum){
    if(postnum == 0){
        end = true;
        $('.scroll').html('<p>No more posts</p>');
    }
}
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
$(document).ready(function() {
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            if(!end&&!bottom){
                bottom = true;
                $('.scroll').html('<p>Loading Posts</p> <div class="loader" style="top: -35px">Loading...</div>');
                startNews(startnews);
            }
        }
    });
});

//function pullUpAction () {
//    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
//        $('#feed').empty();
//        startnews = 0;
//        startNews(startnews);
//
//        myScroll.refresh();
//    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
//}


window.onload = function() {
    WebPullToRefresh.init( {
        loadingFunction: exampleLoadingFunction
    } );
};
var exampleLoadingFunction = function() {
    return new Promise( function( resolve, reject ) {

        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            $('#feed').empty();
            startnews = 0;
            startNews(startnews);

            myScroll.refresh();
        }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
        resolve();
    } );
};
var posting  = false;
$("#private").click( function(e){
    e.preventDefault();
    $('#privatefield').val(1);
    $("#toppost").submit();
});
$("#toppost").on('submit', function(e){
    e.preventDefault();
    if(!posting){
        var data = $(this).serialize()+"&user_id="+user_id+"&username="+username+"&stack_id="+user_stack+"&stack="+stackid;
        posting = true;
        $('.postb').html('<div class="loader">Loading...</div>');
        e.preventDefault();
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : 'http://www.stacksity.com/mobile-php/post.php',
            crossDomain : true,
            data     : data,
            success  : function(data) {
                if(data.length<=2) {
                    if(data!=3){
                        alert("error :" + data);
                    }
                }else{
                    $('.background-image').hide();
                    $('#toppost').trigger("reset");
                    $( "#title-count").html("100");
                    var element = $.parseJSON(data);
                    if(element.posttype == 0){
                        $(linkspost(element)).hide().prependTo('#feed').fadeIn("slow");
                    }else if(element.posttype == 1){
                        $(textspost(element)).hide().prependTo('#feed').fadeIn("slow");
                    }else if(element.posttype == 2){
                        $(imagepost(element)).hide().prependTo('#feed').fadeIn("slow");
                    }else if(element.posttype == 3){
                        $(videopost(element)).hide().prependTo('#feed').fadeIn("slow");
                    }
                }
                $('.postb').html('Post');
                $('#private').html('Private');
                $('#privatefield').val(0);
                posting = false;
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
                $('.postb').html('Post');
                $('#private').html('Private');
                posting = false;
            }
        });
    }else{
        e.preventDefault();
    }
});
$( ".follow" ).click(function() {
    if($(this).val()==1){
        $(this).val(0);
        $(this).removeClass('followed');
        $(this).html('Follow');
        $("#followers").html(parseInt($("#followers").html())-1);
    }else{
        $(this).addClass('followed');
        $(this).html('Followed');
        $(this).val(1);
        $("#followers").html(parseInt($("#followers").html())+1);
    }
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'php/follow.php',
        data     : { stack: stackid},
        success: function(data){
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
        }
    });
});
/* Drag'n drop stuff */
function upload(file) {
    /* Is the file an image? */
    if (!file || !file.type.match(/image.*/)) return;
    /* It is! */
    document.body.className = "uploading";
    $('#imageid').val("uploading...");
    /* Lets build a FormData object*/
    var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
    fd.append("image", file); // Append the file
    var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
    xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
    xhr.onload = function() {
        // Big win!
        var link = JSON.parse(xhr.responseText).data.link;
        $('#link').val(link);
        $('#imageid').val(file.name);
        $('#imagePostPreview').attr('src', link);
        $('.background-image').show();
        document.body.className = "uploaded";
    }

    xhr.setRequestHeader('Authorization', 'Client-ID 2caf3e86e092d76'); // Get your own key http://api.imgur.com/

    // Ok, I don't handle the errors. An exercise for the reader.
    /* And now, we send the formdata */
    xhr.send(fd);
}
function stackTrace() {
    var err = new Error();
    return err.stack;
}
$('.scrollable').pullToRefresh({
    callback: function() {
        var def = $.Deferred();

        setTimeout(function() {
            def.resolve();
        }, 3000);

        return def.promise();
    }
});