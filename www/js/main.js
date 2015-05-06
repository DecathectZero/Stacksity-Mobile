var post = false;
var posting = false;
var end = false;
var bottom = false;
var startnews = 0;
var id = window.localStorage.getItem('session_id');
var stackid = 0;
var userstack = localStorage.getItem('ustack');
var option = 1;
var explore = false;
var changepage = true;
var postbox = false;

function init(){
    var goto = 0;
    $('.active').removeClass('active');
    if(option == 1){
        $('#topstack').addClass('active');
    }else if(option == 2){
        $('#allstack').addClass('active');
        goto = -1;
    }else if(option == 5){
        $('#userstack').addClass('active');
        goto = userstack;
    }
    return goto;
}
function postOpen(type){
    postbox = true;
    $.mobile.changePage(
        "#postpage",
        {
            transition: 'slideup',
            showLoadMsg : false
        }
    );
}

function bannerset(){
    $(".banner").hide();
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'http://stacksity.com/php/stacknameJSON.php',
        crossDomain : true,
        data     : {stack:stackid},
        success  : function(data) {
            if(data==1){
                alert("this stack doesn't exist");
                refreshPage(1);
            }else{
                var element = JSON.parse(data);
                $(".bannertitle").html(element.stackname);
                $(".bannerdesc").html(element.stack_desc);
                //$(".banner").slideDown({complete:function(){
                //    startnews = 0;
                //    startNews(startnews);
                //}});
                if(stackid==0){
                    $(".banner").addClass("topbanner");
                }else if(stackid==-1){
                    $(".banner").addClass("allbanner");
                }else if(element.is_user){
                    $(".banner").addClass("userbanner");
                }
                $(".banner").slideDown();
                end = false;
                bottom = false;
                startnews = 0;
                startNews(startnews);
            }
        },
        error: function(request) {
            if(request.status == 0) {
                alert("You're offline!");
            }else{
                alert("Error Connection");
            }
        }
    });
}

function refreshPage(opt) {
    if(option == opt){
        $('body').stop().animate({ scrollTop : 0 }, 1000, function(){
            $(".feed").empty();
            startnews = 0;
            startNews(startnews);
        });
    }else{
        var rev = false;
        if(opt<option){
            rev = true;
        }
        option = opt;
        var goto = init();
        localStorage.setItem('stack', goto);
        stackid = goto;
        changepage = true;
        $.mobile.changePage(
            window.location.href,
            {
                allowSamePageTransition : true,
                transition              : 'slide',
                showLoadMsg             : false,
                reloadPage              : true,
                reverse: rev,
                changeHash: false
            }
        );
    }
}
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

function checkEnd(postnum){
    if(postnum == 0){
        end = true;
        $('.scroll').html('<p>No more posts</p>');
    }
}
function startNews(startnum) {
    if(end){
        return;
    }
    var postnum = 0;
    $.getJSON('http://stacksity.com/php/feed.php', {id : stackid , start : startnum , session_id: id }, function(data) {
        if(null==data){
            checkEnd(postnum);
        }else{
            $.each(data, function(index, element) {
                if(element.posttype == 0){
                    $('.ui-page-active .feed').append(linkspost(element));
                }else if(element.posttype == 1){
                    $('.ui-page-active .feed').append(textspost(element));
                }else if(element.posttype == 2){
                    $('.ui-page-active .feed').append(imagepost(element));
                }else if(element.posttype == 3){
                    $('.ui-page-active .feed').append(videopost(element));
                }
                postnum++;
            });
            bottom = false;
            checkEnd(postnum);
        }
    });
    startnews = startnews + 10;
    return true;
}
$(document).on("click", "#private", function(e){
    e.preventDefault();
    $('#privatefield').val(1);
    $("#toppost").submit();
});
$(document).on('submit', "#toppost", function(e){
    e.preventDefault();
    if(!posting){
        checklogin();
        var data = $(this).serialize()+"&stack="+stackid+"&session_id="+id;
        posting = true;
        $('.postb').html('<div class="loader">Loading...</div>');
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'http://stacksity.com/php/post.php',
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
                        $('#text').val('').change();
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
            error: function(request) {
                if(request.status == 0) {
                    alert("You're offline!");
                }else{
                    alert("Error Connection");
                }
                $('.postb').html('Post');
                $('#private').html('Private');
                posting = false;
            }
        });
    }
    return false;
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
        data     : { stack: stackid, session_id: id},
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