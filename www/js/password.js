function success(){
    $("#pass-reset").slideUp();
    $("#inforeg").show();
}
function errorinfo(inner){
    $('#error-info').html(inner);
    $('#error-info').slideDown();
}
$("#pass-reset").on('submit', function(e){
    e.preventDefault();
    $('#revbutton').html("Give it a moment");
    $.ajax({
        type     : "POST",
        cache    : false,
        url      : 'http://stacksity.com/php/passreset.php',
        data     : $(this).serialize(),
        success  : function(data) {
            if(data == "3"){
                success();
            }else if(data == "2"){
                errorinfo("That Email doesn't seem to exist here");
            }else{
                alert("error: "+data);
            }
            $('#revbutton').html("Retrieve password");
        },
        error: function(xhr, status, error) {
            alert("error: "+xhr.responseText);
            $('#revbutton').html("Retrieve password");
        }
    });
});

