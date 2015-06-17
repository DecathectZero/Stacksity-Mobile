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
var postbox = false;
var postype = 1;
var is_user = 0;
var dontdelete = false;
var loading = false;
var postid = 0;

function postOpen(type){
    if(!postbox){
        changepage = true;
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

function bannerset(activepage, stackid){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/stacknameJSON.php',
        crossDomain : true,
        data     : {stack:stackid, session_id:id},
        success  : function(data) {
            //alert(activepage.attr("id")+" "+stackid);
            if(data==1){
                alert("this stack doesn't exist");
                refreshPage(1);
            }else{
                var element = JSON.parse(data);
                stackname = element.stackname;
                is_user = 0;
                stackid = element.stack;
                activepage.data("stack_id", stackid);
                activepage.data("is_user", is_user);
                activepage.data("startnews", 0);
                activepage.data("stackname", stackname);
                activepage.find(".bannertext").html('<h1 class="bannertitle"></h1><p class="bannerdesc"></p>');
                activepage.find(".bannertitle").html(stackname);
                if(stackid==0){
                    activepage.find(".banner").addClass("topbanner");
                    activepage.find(".bannerdesc").html(element.stack_desc);
                }else if(stackid==-1){
                    activepage.find(".banner").addClass("allbanner");
                    activepage.find(".bannerdesc").html(element.stack_desc);
                }else if(stackid<-1){
                    activepage.find(".bannerdesc").html(element.stack_desc);
                }else {
                    var space = '';
                    if (element.stack_desc != "" && element.stack_desc != null) {
                        space = '<br>';
                    }
                    activepage.find(".bannerdesc").html('<b>' + element.stack_desc + space + "<span class='followers'>" + element.followers + '</span> followers</b>');
                    if (userstack != stackid) {
                        if (element.following) {
                            activepage.find('.bannertext').append('<br> <button class="follow followed" value="1" data-role="none">Followed</button>')
                        } else {
                            activepage.find('.bannertext').append('<br> <button class="follow" value="0" data-role="none">Follow</button>')
                        }
                    } else {
                        activepage.find('.bannertext').append('<br> <button class="logout" onclick="logout()">Logout</button>')
                    }
                    if (element.is_user == "1") {
                        activepage.find(".banner").addClass("userbanner");
                        is_user = 1;
                    }
                }
                activepage.find(".banner").slideDown({complete:function(){
                    startnews = 0;
                    startNews(startnews,activepage, stackid);
                }});
            }
        },
        error: function(request) {
            if(request.status == 0) {
                $('.scroll').html('<p>You\'re offline :(</p>');
            }else{
                alert("Error Connection");
            }
        }
    });
}
function logout(){
    localStorage.clear();
    document.location.href = "login.html";
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
    return (option != 3 && option != 4 && option != 7);
}
function init(){
    var goto = 0;
    $('.active').removeClass('active');
    if(option == 1){
        $('#topstack').addClass('active');
    }else if(option == 2){
        $('#allstack').addClass('active');
        goto = -2;
    }else if(option == 4){
        $('#searchstack').addClass('active');
        goto = -10;
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
function checkEnd(postnum){
    if(postnum < 10){
        end = true;
        $('.scroll').html('<p>No more posts</p>');
    }
}
function checklogin(){
    var id = window.localStorage.getItem('session_id');
    var hashcode = window.localStorage.getItem('hashcode');
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/mobileCheckLogin.php',
        data     : {session_id : id, hashcode : hashcode},
        dataType : "html",
        crossDomain : true,
        success  : function(data) {
            if(data=="0"){
                document.location.href = 'index.html';
            }else{
                if(data!="1"){
                    window.localStorage.setItem('session_id', data);
                }
            }
        },
        error: function(xhr, status, error) {
            //alert("error: "+xhr.responseText);
        }
    });
}
function startNews(startnum, activepage, stackid) {
    if(!loading){
        if(end){
            return;
        }
        $('.scroll').html('<p>Loading Posts...</p>');
        checklogin();
        loading = true;
        var postnum = 0;
        $.ajax({
            type     : "GET",
            cache    : false,
            url      : 'https://stacksity.com/php/feed.php',
            crossDomain : true,
            data     : {id : stackid , start : startnum , session_id: id },
            dataType : "html",
            success  : function(data) {
                if(data==null||data==''){
                    loading = false;
                    checkEnd(postnum);
                }else{
                    data = JSON.parse(data);
                    //if(startnum>19){
                    //    var div = activepage.find(".extracontainer");
                    //    activepage.find('.item:lt('+data.length+')').remove();
                    //    div.scrollTop = div.scrollHeight;
                    //    alert(data.length);
                    //}
                    $.each(data, function(index, element) {
                        if(element.posttype == 0){
                            activepage.find('.feed').append(linkspost(element));
                        }else if(element.posttype == 1){
                            activepage.find('.feed').append(textspost(element));
                        }else if(element.posttype == 2){
                            activepage.find('.feed').append(imagepost(element));
                        }else if(element.posttype == 3){
                            activepage.find('.feed').append(videopost(element));
                        }
                        postnum++;
                    });
                    loading = false;
                    bottom = false;
                    startnews = startnews + 10;
                    activepage.data("startnews", startnews);
                    checkEnd(postnum);
                }
            },
            error: function(request) {
                if(request.status == 0) {
                    $('.scroll').html('<p>You\'re offline :(</p>');
                }else{
                    alert("connection arror");
                }
            }
        });
    }
}
function refresh(){
    bottom = false;
    end = false;
    loading = false;
    var activep = $.mobile.activePage;
    activep.find('.scroll').html('<p>Loading Posts</p>');
    if(activep.data("stack_id")==null&&!postbox){
        bannerset(activep, stackid);
    }else{
        if(activep.find(".extracontainer").scrollTop()==0){
            activep.find(".feed").empty();
            activep.data("startnews", 0);
            startnews = 0;
            startNews(startnews, activep, stackid);
        }else{
            activep.find(".extracontainer").stop().animate({ scrollTop : 0 }, 1000, function(){
                activep.find(".feed").empty();
                activep.data("startnews", 0);
                startnews = 0;
                startNews(startnews, activep, stackid);
            });
        }
    }
}
function searchPageRefresh(){
    $(".stackls").empty();
    getStacks($('#fs'),2);
    getStacks($('#fu'),1);
    function getStacks(el, type_id){
        $.getJSON('https://stacksity.com/php/getstacks.php', {id : type_id, session_id:id}, function(data) {
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
var changepage = false;
function refreshPage(opt) {
    if(option == opt){
        if(postbox) {
            $.mobile.back();
        }else if(isStackOption()){
            refresh();
        }else if(option == 4){
            searchPageRefresh();
        }
    }else{
        explore = false;
        var rev = false;
        var trans = 'none';
        if(postbox){
            trans = 'slideup';
            rev = true;
        }if(option == 7){
            trans = 'slide';
            rev = true;
        }else if(option == 6){
            rev = true;
            trans = 'turn';
        }
        option = opt;
        var goto = init();
        changepage = true;
        if(goto>-10){
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
        }else if(goto == -10){
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
    postbox = false;
}
function linkToStack(goto){
    if(goto == userstack || goto == username){
        refreshPage(5);
    }else if(goto == "-2"){
        refreshPage(2);
    }else{
        $('.active').removeClass('active');
        //localStorage.setItem('stack', goto);
        var op = option;
        option = 6;
        if(explore){
            if(goto != stackid && goto != stackname){
                stackid = goto;
                dontdelete = true;
                explore = true;
                changepage = true;
                $.mobile.changePage(
                    "#explorepage",
                    {
                        allowSamePageTransition : true,
                        transition              : 'turn',
                        showLoadMsg             : false,
                        reloadPage              : true
                    }
                );
            }else{
                refresh();
            }
        }else{
            if(op==4||(goto != stackid && goto != stackname)){
                //alert(goto);
                var banner = $('*[data-url="explorepage"] .banner');
                $('*[data-url="explorepage"]').data("stack_id", null);
                banner.hide();
                banner.removeClass("userbanner");
                $('*[data-url="explorepage"] .feed').empty();
                stackid = goto;
                explore = true;
                changepage = true;
                $.mobile.changePage(
                    "#explorepage",
                    {
                        transition              : 'turn',
                        showLoadMsg             : false
                    }
                );
            }
        }
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
            url      : 'https://stacksity.com/php/post.php',
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
        url      : 'https://stacksity.com/php/follow.php',
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

$(document).on('tap','.postlink',function(e){
    e.preventDefault();
    $(this).trigger('click');
});

/*post stuff*/
var preopt;
$(document).on('click','a',function(e){
    if($(this).hasClass("toPost")){
        e.preventDefault();
        postid = $(this).data("postlink");
        preopt = option;
        option = 7;
        init();
        changepage = true;
        $.mobile.changePage(
            "#post",
            {
                transition: "slide",
                showLoadMsg             : false
            }
        );
    }else if($(this).hasClass("stacklink")){
        e.preventDefault();
        var goto = $(this).data('link');
        linkToStack(goto);
    }else{
        var link = $(this).attr("href");
        if(link==null){

        }else{
            window.open(link, '_blank', 'location=yes,enableViewportScale=yes');
        }
    }
});

function getPost(postid)
{
    $.getJSON('https://stacksity.com/php/postname.php', {id : postid, session_id:id}, function(element){
        if(null==element){
            alert("post not found");
            $.mobile.back();
        }else{
            if(element.posttype == 0){
                $('#postcon').append(linkspost(element));
            }else if(element.posttype == 1){
                $('#postcon').append(textspost(element));
            }else if(element.posttype == 2){
                $('#postcon').append(imagepost(element));
            }else if(element.posttype == 3){
                $('#postcon').append(videopost(element));
            }
            $("#postcon").slideDown();
        }
        if(element.comments>0){
            $("#commentfeed").empty();
            getComment($("#commentfeed"));
        }else{
            $('#commentfeed').html("<div class='nocomments'>No comments currently</div>");
        }
    });
}
function commentVote(type, count){
    if(type==2){
        return '<div class="cvote"><div class="cbutton stackup stack-up" name="up"></div><p class="score">'+count+'</p><div class="cbutton stackdown" name="down"></div></div>'
    }
    if(type==0){
        return '<div class="cvote"><div class="cbutton stackup" name="up"></div><p class="score">'+count+'</p><div class="cbutton stackdown stack-down" name="down"></div></div>'
    }
    return '<div class="cvote"><div class="cbutton stackup" name="up"></div><p class="score">'+count+'</p><div class="cbutton stackdown" name="down"></div></div>'
}
function commentHTML(element, depth){
    var count = element.upstacks-element.downstacks;
    var depthtext = '';
    var del = '';
    if(element.delete){
        del = '<a class="reply deletecom" data-delete="'+element.comment_id+'">delete</a>';
    }
    var reply = del;
    if(depth == 0){
        depthtext = 'depth';
    }
    var vote = commentVote(element.vote, count);
    if(depth<7){
        reply = '<a class="reply" onclick="swapReply(this)">reply</a>'+del+'<form class="replycomment" style="display: none" data-depth="'+depth+'"><div class="postcon replycon">'+
        '<input type="hidden" name="postid" value="'+postid+'">'+
        '<input type="hidden" name="commentid" value="'+element.comment_id+'">'+
        '<div id="textpost">'+
        '<textarea name="text" class="expanding" placeholder="Write something here..." rows="2" required></textarea>'+
        '</div></div>'+
        '<div class="postsub comsub"><label><span class="cancelreply" onclick="backReply(this)">Cancel</span></label>'+
        '<button type="submit" class="postb replypost">Post</button>'+
        '</div></form>';
    }
    return '<div class="child '+depthtext+'">'+
    '<div class="comment" data-commentid="'+element.comment_id+'" data-depth="'+element.depth+'">'+
    vote+
    '<div class="comment-content">'+
    '<p class="tagline"><a class="comment_link" href="/stack.php?id='+element.user_stack+'" class="">'+element.username+'</a> | <time>'+element.created+'</time>' +
    ' | <b>#'+element.comment_id+'</b></p>'+
    '<p class="commenttext">'+$("<textarea/>").html(element.content).text()+'</p>'+ reply +
    '</div> </div> </div>';
}
function getComment(item)
{
    $.getJSON('https://stacksity.com/php/commentfeed.php', {post_id : postid, session_id: id}, function(data) {
        showComment(data,item);
    });
}
function showComment(data,item){
    $.each(data, function(index, element) {
        item.append(commentHTML(element, element.depth));
        if(element.depth<7){
            if(element.comments!=null) {
                showComment(element.comments, item.children(".child:last"));
            }
        }
    });
}
function swapReply(el){
    $(".replycomment").hide();
    $(el).siblings('.replycomment').show();
}
function backReply(el){
    $(el).closest('.replycomment').siblings('.reply').show();
    $(el).closest('.replycomment').hide();
}
$(document).on('submit', '.replycomment', function(e){
    e.preventDefault();
    if(!posting){
        checklogin();
        posting = true;
        $(this).children('.replypost').html('<div class="loader">Loading...</div>');
        e.preventDefault();
        var el = $(this);
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/postcomment.php',
            data     : el.serialize()+"&session_id="+id,
            success  : function(data) {
                if(data.length<=1) {
                    if(data!=3){
                        alert("error :" + data);
                    }
                }else{
                    var element = $.parseJSON(data);
                    $(commentHTML(element, el.data('depth')+1)).hide().insertAfter(el.closest('.comment')).fadeIn("slow");
                    el.children('.replypost').html('Post');
                    el.find("input[type=text], textarea").val("");
                    el.siblings('.reply').show();
                    el.hide();
                }
                posting = false;
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
                $(this).children('.replypost').html('Post');
                $(this).siblings('.reply').show();
                $(this).hide();
                posting = false;
            }
        });
    }else{
        e.preventDefault();
    }
});
$(document).on('submit', '#commentform',function(e){
    e.preventDefault();
    if(!posting){
        checklogin();
        posting = true;
        $('.postb').html('<div class="loader">Loading...</div>');
        e.preventDefault();
        $.ajax({
            type     : "POST",
            cache    : false,
            url      : 'https://stacksity.com/php/postcomment.php',
            data     : $(this).serialize()+"&session_id="+id+"&postid="+postid,
            success  : function(data) {
                if(data.length<=1) {
                    if(data!=3){
                        alert("error :" + data);
                    }
                }else{
                    var element = $.parseJSON(data);
                    $(commentHTML(element, 0)).hide().prependTo('#commentfeed').fadeIn("slow");
                    $('.postb').html('comment');
                    $("#commentform").find("textarea").val("");
                    $(".nocomments").remove();
                }
                posting = false;
            },
            error: function(xhr, status, error) {
                alert("error"+ xhr.responseText);
                $('.postb').html('comment');
                posting = false;
            }
        });
    }else{
        e.preventDefault();
    }
});
var deletecom_id = 0;

$(document).on('click', '.deletecom', function(e) {
    deletecom_id = $(this).data('delete');
    $('#commentdelete').modal({keyboard: true});
    return false;
});
$('#deletecomment').click(function(e){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : '/php/deletecomment.php',
        data     : {delid : deletecom_id},
        success  : function(data) {
            if(data==0){
                var del = $('*[data-commentid="'+deletecom_id+'"]');
                del.find('.deletecom').remove();
                del.find('.commenttext').html('[deleted]');
            }else{
                alert(data);
            }
            $('#commentdelete').modal('hide');
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
            $('#commentdelete').modal('hide');
        }
    });
});