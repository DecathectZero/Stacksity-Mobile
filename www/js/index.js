function errorinfo(inner){
    $('#error-info').html(inner);
    $('#error-info').slideDown();
}
$("#login").on('submit', function(e){
    e.preventDefault();
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'https://stacksity.com/login.php',
        data     : $(this).serialize(),
        dataType : "html",
        crossDomain : true,
        success  : function(data) {
            if(data=="1"){
                errorinfo("That username doesn't seem to exist D:");
            }else if(data=="2"){
                errorinfo("Password doesn't match username :/");
            }else if(data=="69"){
                errorinfo("Please fill in the fields");
            }else if(data.length>1){
                var element = JSON.parse(data);
                window.localStorage.setItem('session_id',element.session_id);
                window.localStorage.setItem('stack',0);
                window.localStorage.setItem('hashcode',element.hashcode);
                window.localStorage.setItem('ustack',element.stack_id);
                window.localStorage.setItem('username',element.username);
                document.location.href = 'stack.html';
            }else{
                errorinfo("Oops something went wrong with the server, error code: " + data);
            }
        },
        error: function(request) {
            if (request.status == 0) {
                alert("You're offline!");
            }else{
                alert("Error Connection");
            }
        }
    });
});