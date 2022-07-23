function signIn() {
    var email = document.getElementById("signin_email").value
    var password = document.getElementById("signin_password").value

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        var user = firebase.auth().currentUser
        if (user.uid==="1KYUebMd5GTZRKdMVyrxGARG6iQ2") {
            window.alert("Sign-In Successful. Taking you to new orders page!")
            window.location = "new_orders.html"
        } else {
            window.alert("Sign-In Successful. Taking you to homepage!")
            window.location = "index.html"   
        }
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage)
    })
}