/**
 * Created by killswitch on 4/29/2015.
 */
var id = window.localStorage.getItem('session_id');
$.ajax({
    type     : "POST",
    cache    : false,
    url      : 'http://stacksity.com/php/mobileCheckLogin.php',
    data     : {session_id : id},
    dataType : "html",
    crossDomain : true,
    success  : function(data) {
        if(data=="0"){
            document.location.href = 'index.html';
        }
    },
    error: function(xhr, status, error) {
        alert("error: "+xhr.responseText);
    }
});