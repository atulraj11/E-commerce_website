firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $(document).ready(function() {
            $('#signupbtn').hide()
            $('#signinbtn').hide()
            $('#signoutbtn').show()
            $('#mycartbtn').show()
        })
    }
    else {
        $(document).ready(function() {
            $('#signupbtn').show()
            $('#signinbtn').show()
            $('#signoutbtn').hide()
            $('#mycartbtn').hide()
        })
    }
})