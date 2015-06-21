function getlink(el, link){
    if(el==0||(option == 7)){
        return '<a href = "'+link+'" style="text-decoration:none">';
    }
    return '<a data-postlink="'+el+'" class="toPost">';
}
function comments(element){
    var del = '';
    if(element.delete){
        del = '<a class="delete commentlink" data-delete="'+element.post_id+'"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
    }if(element.report==1){
        del += '<a class="report commentlink"><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></a>';
    }
    if(option!=7){
        del = '<a class="toPost commentlink" data-postlink="'+element.post_id+'">'+element.comments+' comments</a>'+del+'<span class="pid">P#'+element.post_id+'</span>';
    }else{
        del += '<span class="pid">P#'+element.post_id+'</span>';
    }
    return '<div class="comwrapper"><div class="comwrap">'+del+'</div></div>';
}
function priv(priv, nsfw){
    var classes = "";
    if(priv == "1"){
        classes = classes + "privatepost ";
    }
    if(nsfw==1){
        classes = classes + "nsfw";
    }else if(nsfw==2){
        classes = classes + "nsfw gore";
    }else if(nsfw>2){
        classes = classes + "nsfw boobs";
    }
    return classes;
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function privt(title, private){
    var re = title;
    if(private=="1"){
        re = '<span class="glyphicon glyphicon-lock" aria-hidden="true"></span> '+re;
    }
    return re;
}

function stacknames(from, from_id, too, too_id, flair, stackflair){
    var stack_name = '<a class="stacklink" data-link="'+from_id+'">'+ from + flair+ '</a> ';
    if(stackid < 1){
        if(from_id==too_id){
            stack_name += ' to <a class="stacklink" data-link="'+from_id+'">$self</a>';
        }else{
            stack_name += ' to <a class="stacklink" data-link="'+too_id+'">'+too+stackflair+'</a>';
        }
    }
    return stack_name;
}
function voting(votetype, count){
    var re = '<div class="vbutton stackup" name="up"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackdown" name="down"></div>';
    if(votetype == 0){
        re = '<div class="vbutton stackup" name="up"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackdown stack-down" name="down"></div>';
    }else if(votetype == 2){
        re = '<div class="vbutton stackup stack-up" name="up"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackdown" name="down"></div>';
    }
    return '<div class="votewrap" >'+re+'</div>';
}
function imagepost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item ipost '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    '<div class="textcon"><div class="linkwrapper"><div class="margins"> ' +
    getlink(element.post_id, element.link)+'<h4>' +  privt(element.title, element.private)  + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p></div>' +
    getlink(0, element.link) +
    '<div class="imagewrap">'+element.embed+'</div>' +
    '</a>' + '</div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
        /*'<p class="link">'+link.substring(0,100)+'</p>'+<a href="'+element.link+'">See More</a>*/
    '</div>' +
    '</div>';
}
function videopost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item vpost '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    '<div class="textcon"><div class="margins">' +
    getlink(element.post_id, element.link)+'<h4>' + privt(element.title, element.private) + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p></div>' +
        //'<a href="/'+element.link+'" target="_blank">' +
    '<div class="linkwrapper"><div class="videowrapper">'+element.embed+'</div>'+
    '<div class="textfeed margins"><p class="content">'+element.text+'</p></div></div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
    '</div>' +
    '</div>';
}
function parseimg(img){
    if(img=="../img/post/thumb.jpg"){
        return "img/post/thumb.jpg";
    }else{
        return img;
    }
}
function linkspost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);
    return '<div class="item lpost '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    '<div class="textcon margins">' +
    getlink(element.post_id, element.link)+'<h4>' + privt(element.title, element.private) + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p>' +
    '<div class="linkwrapper">' + getlink(0, element.link) +
    '<div class="linkcontainer"><img class="linkimage" src="'+ parseimg(element.image) +'"></div>' +
    '<p class="content">'+element.text+'</p></a>' +
    '</div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+'</div>'+
    '</div>' +
    '</div>'
}
function textspost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);
    var link;
    if(option==7){
        link = '<h4>' + element.title + '</h4>';
    }else{
        link = getlink(element.post_id, element.link)+'<h4>' + privt(element.title, element.private) + '</h4></a>';
    }
    return '<div class="item tpost '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    '<div class="textcon margins">' +
    link +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p>' +
    '<div class="content">'+$("<textarea/>").html(element.text).text()+'</div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
    '</div>' +
    '</div>';
}

var delete_id = 0;
$(document).on('click', '.delete', function(e) {
    delete_id = $(this).data('delete');
    $('#delpost').modal();
    return false;
});
function del(){
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/php/deletepost.php',
        data     : {delid : delete_id, session_id: id},
        success  : function(data) {
            if(data==0){
                $('*[data-post="'+delete_id+'"]').fadeOut();
            }else{
                alert(data);
            }
        },
        error: function(xhr, status, error) {
            alert("error"+ xhr.responseText);
        }
    });
    $('#delpost').modal('hide');
}
