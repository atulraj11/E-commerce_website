function signOut() {
    firebase.auth().signOut()
    .then(function() {
        window.alert("Logged Out Successfully!")
        window.location = 'index.html'
    })
    .catch(function(error) {
        window.alert(error)
    })
}