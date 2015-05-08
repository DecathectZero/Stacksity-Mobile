var post = false;
var posting = false;
var end = false;
var bottom = false;
var startnews = 0;
var id = window.localStorage.getItem('session_id');
var stackid = 0;
var stackname = null;
var userstack = localStorage.getItem('ustack');
var username = localStorage.getItem('username');
var option = 1;
var explore = false;
var exploring = false;
var changepage = true;
var postbox = false;
var postype = 1;
var is_user = 0;
var dontdelete = false;
var loading = false;

$.event.special.tap = {
    setup: function() {
        var self = this,
            $self = $(self);

        $self.on('touchstart', function(startEvent) {
            var target = startEvent.target;

            $self.one('touchend', function(endEvent) {
                if (target == endEvent.target) {
                    $.event.simulate('tap', self, endEvent);
                }
            });
        });
    }
};

function postOpen(type){
    if(!postbox){
        postbox = true;
        postype = type;
        $.mobile.changePage(
            "#postpage",
            {
                transition: 'slideup',
                showLoadMsg : false
            }
        );
    }
}

function bannerset(){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'http://stacksity.com/php/stacknameJSON.php',
        crossDomain : true,
        data     : {stack:stackid, session_id:id},
        success  : function(data) {
            if(data==1){
                alert("this stack doesn't exist");
                refreshPage(1);
            }else{
                var element = JSON.parse(data);
                stackname = element.stackname;
                is_user = 0;
                stackid = element.stack;
                $(".ui-page-active").data("stack_id", stackid);
                $(".ui-page-active").data("is_user", is_user);
                $(".ui-page-active").data("stackname", stackname);
                $(".ui-page-active .bannertext").html('<h1 class="bannertitle"></h1><p class="bannerdesc"></p>');
                $(".ui-page-active .bannertitle").html(stackname);
                if(stackid==0){
                    $(".ui-page-active .banner").addClass("topbanner");
                    $(".ui-page-active .bannerdesc").html(element.stack_desc);
                }else if(stackid==-1){
                    $(".ui-page-active .banner").addClass("allbanner");
                    $(".ui-page-active .bannerdesc").html(element.stack_desc);
                }else{
                    if(element.is_user=="1"){
                        $(".ui-page-active .banner").addClass("userbanner");
                        is_user = 1;
                    }
                    var space = '';
                    if(element.stack_desc!=""&&element.stack_desc!=null){
                        space = '<br>';
                    }
                    $(".ui-page-active .bannerdesc").html('<b>'+element.stack_desc+space+"<span class='followers'>"+element.followers+'</span> followers</b>');
                    if(userstack!=stackid){
                        if(element.following){
                            $('.ui-page-active .bannertext').append('<br> <button class="follow followed" value="1" data-role="none">Followed</button>')
                        }else{
                            $('.ui-page-active .bannertext').append('<br> <button class="follow" value="0" data-role="none">Follow</button>')
                        }
                    }
                }
                $(".ui-page-active .banner").slideDown({complete:function(){
                    startnews = 0;
                    startNews(startnews);
                }});
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

function initPostBox(){
    //alert(stackid);
    if(stackid == 0 || stackid == -1){
        $("#posting").html(username);
        $('#private').show();
    }else{
        if(is_user==0){
            $('#private').hide();
        }else{
            $('#private').show();
        }
        $("#posting").html(stackname);
    }
}
function isStackOption(){
    if(option != 3 && option != 4){
        return true;
    }
    return false;
}
function init(){
    var goto = 0;
    $('.active').removeClass('active');
    if(option == 1){
        $('#topstack').addClass('active');
    }else if(option == 2){
        $('#allstack').addClass('active');
        goto = -1;
    }else if(option == 4){
        $('#searchstack').addClass('active');
        goto = -2;
    }else if(option == 5){
        $('#userstack').addClass('active');
        goto = userstack;
    }
    return goto;
}
function getOption(){
    if(option == 1){
        return "#toppage";
    }else if(option == 2){
        return "#allpage";
    }else if(option == 4){
        return "#searchpage";
    }else if(option == 5){
        return "#userpage";
    }
    return null;
}
function refresh(){
    bottom = false;
    end = false;
    loading = true;
    $('.ui-page-active .scroll').html('<p>Loading Posts</p> <div class="loader" style="top: -35px">Loading...</div>');
    if($(".ui-page-active .extracontainer").scrollTop()==0){
        $(".ui-page-active .feed").empty();
        startnews = 0;
        startNews(startnews);
    }else{
        $('.ui-page-active .extracontainer').stop().animate({ scrollTop : 0 }, 1000, function(){
            $(".ui-page-active .feed").empty();
            startnews = 0;
            startNews(startnews);
        });
    }
}
function searchPageRefresh(){
    $(".stackls").empty();
    getStacks($('#fs'),2);
    getStacks($('#fu'),1);
    function getStacks(el, type_id){
        $.getJSON('http://stacksity.com/php/getstacks.php', {id : type_id, session_id:id}, function(data) {
            $.each(data, function(index, element) {
                if(type_id==2){
                    el.append('<a onClick="linkToStack(\''+element.stackname+'\')">'+element.stackname+'</a>');
                }else{
                    el.append('<a onClick="linkToStack('+element.stack_id+')">'+element.stackname+'</a>');
                }
            });
        });
    }
}
$(".quarter").on('tap', function (e) {
    alert("tap");
    $(this).trigger('click');
    e.preventDefault();
});
function refreshPage(opt) {
    if(option == opt){
        if(isStackOption()){
            refresh();
        }else if(option == 4){
            searchPageRefresh();
        }
    }else{
        explore = false;
        var rev = false;
        if(opt<option){
            rev = true;
        }
        var trans = 'slide';
        if(option == 6){
            rev = true;
            trans = 'flip';
        }
        option = opt;
        var goto = init();
        if(goto>-2){
            changepage = true;
            //localStorage.setItem('stack', goto);
            stackid = goto;
            $.mobile.changePage(
                getOption(),
                {
                    transition              : trans,
                    showLoadMsg             : false,
                    reverse: rev
                }
            );
        }else if(goto == -2){
            $.mobile.changePage(
                "#searchpage",
                {
                    transition              : trans,
                    showLoadMsg             : false,
                    reverse: rev
                }
            );
        }
    }
}
function linkToStack(goto){
    if(goto == userstack || goto == username){
        refreshPage(5);
    }else{
        $('.active').removeClass('active');
        //localStorage.setItem('stack', goto);
        option = 6;
        if(explore){
            if(goto != stackid && goto != stackname){
                stackid = goto;
                dontdelete = true;
                explore = true;
                $.mobile.changePage(
                    window.location.href,
                    {
                        allowSamePageTransition : true,
                        transition              : 'flip',
                        showLoadMsg             : false,
                        reloadPage              : true
                    }
                );
            }else{
                refresh();
            }
        }else{
            if(goto != stackid && goto != stackname){
                //alert(goto);
                var banner = $('*[data-url="explorepage"] .banner');
                $('*[data-url="explorepage"]').data("stack_id", null);
                banner.hide();
                banner.removeClass("userbanner");
                $('*[data-url="explorepage"] .feed').empty();
                stackid = goto;
                explore = true;
                $.mobile.changePage(
                    "#explorepage",
                    {
                        transition              : 'flip',
                        showLoadMsg             : false
                    }
                );
            }
        }
    }
}
$(document).on('click', '.stacklink',function(){
    //option = 0;
    var goto = $(this).data('link');
    linkToStack(goto);
});
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
        $('.ui-page-active .scroll').html('<p>No more posts</p>');
    }
}
function startNews(startnum) {
    if(end){
        return;
    }
    loading = true;
    var postnum = 0;
    $.getJSON('http://stacksity.com/php/feed.php', {id : stackid , start : startnum , session_id: id }, function(data) {
        if(null==data){
            loading = false;
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
            loading = false;
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
var postdata = null;
$(document).on('submit', "#toppost", function(e){
    e.preventDefault();
    if(!posting){
        checklogin();
        var data = $(this).serialize()+"&stack="+stackid+"&user_value="+is_user+"&session_id="+id;
        posting = true;
        $('.postb').html('<div class="loader">Loading...</div>');
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'http://stacksity.com/php/post.php',
            crossDomain : true,
            data     : data,
            success  : function(data) {
                postbox = false;
                postdata = data;
                $.mobile.back();
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
function parsePostData(){
    var data = postdata;
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
            $(linkspost(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }else if(element.posttype == 1){
            $('#text').val('').change();
            $(textspost(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }else if(element.posttype == 2){
            $(imagepost(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }else if(element.posttype == 3){
            $(videopost(element)).hide().prependTo('.ui-page-active .feed').fadeIn("slow");
        }
    }
    $('.postb').html('Post');
    $('#private').html('Private');
    $('#privatefield').val(0);
    posting = false;
    postdata = null;
}
$(document).on('click', '.follow', function(){
    if($(this).val()==1){
        $(this).val(0);
        $(this).removeClass('followed');
        $(this).html('Follow');
        $(".ui-page-active .followers").html(parseInt($(".ui-page-active .followers").html())-1);
    }else{
        $(this).addClass('followed');
        $(this).html('Followed');
        $(this).val(1);
        $(".ui-page-active .followers").html(parseInt($(".ui-page-active .followers").html())+1);
    }
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'http://stacksity.com/php/follow.php',
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