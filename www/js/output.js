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
        del += '<a class="report commentlink" data-delete="'+element.post_id+'"><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></a>';
    }
    if(option!=7){
        del = '<a class="toPost commentlink" data-postlink="'+element.post_id+'">'+element.comments+' comments</a>'+del+
            '<a class="commentlink sharelink" data-link="' + element.post_id + '"><span class="glyphicon glyphicon-link"></span></a><span class="pid">P#'+element.post_id+'</span></a>';
    }else{
        del += '<a class="commentlink sharelink" data-link="' + element.post_id + '"><span class="glyphicon glyphicon-link"></span></a><span class="pid">P#'+element.post_id+'</span></a>';
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
    var re = '<div class="vbutton stackdown" name="down"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackup" name="up"></div>';
    if(votetype == 0){
        re = '<div class="vbutton stackdown stack-down" name="down"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackup" name="up"></div>';
    }else if(votetype == 2){
        re = '<div class="vbutton stackdown" name="down"></div>'+
        '<p class="count">'+count+'</p>'+
        '<div class="vbutton stackup stack-up" name="up"></div>';
    }
    return '<div class="votewrap" >'+re+'</div>';
}
function imagepost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item ipost '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    '<div class="linkwrapper"><div class="margins"> ' +
    getlink(element.post_id, element.link)+'<h4>' +  privt(element.title, element.private)  + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p></div>' +
    '<div class="imagewrap collapsecon">'+element.embed+'</div>' +
    '</div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
        /*'<p class="link">'+link.substring(0,100)+'</p>'+<a href="'+element.link+'">See More</a>*/
    //'</div>' +
    '</div>';
}
function videopost(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item vpost '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    '<div class="margins">' +
    getlink(element.post_id, element.link)+'<h4>' + privt(element.title, element.private) + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p></div>' +
        //'<a href="/'+element.link+'" target="_blank">' +
    '<div class="linkwrapper collapsecon"><div class="videowrapper">'+element.embed+'</div>'+
    '<div class="textfeed margins"><p class="content">'+element.text+'</p></div></div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
    //'</div>' +
    '</div>';
}
function videopostfeed(element){
    var count = element.upstacks-element.downstacks;
    var vote = voting(element.vote, count);

    return '<div class="item ipost '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    '<div class="linkwrapper"><div class="margins">' +
    getlink(element.post_id, element.link)+'<h4>' +  privt(element.title, element.private)  + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p>' +
    '</div>'+ getlink(0, element.link) +'<div class="imagewrap collapsecon"><div class="play"></div><img src="'+element.image+'" class="imagecon"></div>' +
    '</a>' + '</div><div class="vote login margins">'+
    vote +
    '</div>'+comments(element)+
        /*'<p class="link">'+link.substring(0,100)+'</p>'+<a href="'+element.link+'">See More</a>*/
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
    return '<div class="item lpost margins '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    //'<div class="textcon">' +
    getlink(element.post_id, element.link)+'<h4>' + privt(element.title, element.private) + '</h4></a>' +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p>' +
    '<div class="linkwrapper collapsecon">' + getlink(0, element.link) +
    '<div class="linkcontainer"><img class="linkimage" src="'+ parseimg(element.image) +'"></div>' +
    '<p class="content">'+element.text+'</p></a>' +
    '</div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+'</div>'+
    //'</div>' +
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
    return '<div class="item tpost margins '+priv(element.private, element.nsfw)+'" data-post="'+element.post_id+'">' +
    link +
    '<p class="postinfo">'+stacknames(element.username, element.poster_id, element.stackname, element.stack_id, element.flair, element.stackflair)+' | '+ element.created +'</p>' +
    '<div class="content textpostcon collapsecon">'+element.text+'</div><div class="vote login">'+
    vote +
    '</div>'+comments(element)+
    //'</div>' +
    '</div>';
}