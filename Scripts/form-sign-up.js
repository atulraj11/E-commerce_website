function signUp() {
    var email = document.getElementById("signup_email").value
    var password = document.getElementById("signup_password").value
    var name = document.getElementById("name").value
    if (name.trim()==null || name.trim()==""|| name===" ") {
        window.alert('Please specify your name')
        return
    }
    var mobile1 = document.getElementById("mobile1").value
    if (mobile1.trim()==null || mobile1.trim()==""|| mobile1===" ") {
        window.alert('Please specify your mobile number')
        return
    }
    if(mobile1.trim().length<10 || mobile1.trim().length>10) {
        window.alert('Mobile number should be of 10 digits')
        return
    }
    var mobile2 = document.getElementById("mobile2").value
    var address = document.getElementById("address").value
    if (address.trim()==null || address.trim()==""|| address===" ") {
        window.alert('Please specify your address')
        return
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var uid = user.uid;
                
                var database = firebase.database()
                database.ref('users/'+uid).set({
                    "Name": name,
                    "Mobile_Number": mobile1,
                    "Alternate_Mobile_Number": mobile2,
                    "Address": address
                })
                .then(() => {
                    window.alert("Sign-Up Successful! You are logged in! Taking you to homepage!")
                    window.location = "index.html"
                })
            }
        })
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage)
    })
}