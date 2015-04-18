function errorinfo(inner){
    $('#error-info').html(inner);
    $('#error-info').slideDown();
}
$("#login").on('submit', function(e){
    e.preventDefault();
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'http://stacksity.com/login.php',
        data     : $(this).serialize(),
        dataType : "html",
        crossDomain : true,
        success  : function(data) {
            if(data=="1"){
                errorinfo("That username doesn't seem to exist D:");
            }else if(data=="2"){
                errorinfo("Password doesn't match username :/");
            }else if(data=='3'){
                document.location.href = 'stack.html';
            }else if(data=="69"){
                errorinfo("Please fill in the fields");
            }else{
                errorinfo("Oops something went wrong with the server, error code: " + data);
            }
        },
        error: function(xhr, status, error) {
            alert("error: "+xhr.responseText);
        }
    });
});