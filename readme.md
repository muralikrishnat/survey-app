https://cdn.firebase.com/js/client/2.3.2/firebase.js

var ref = new Firebase('https://nimbu-polling.firebaseio.com');

ref.authWithPassword({
	"email": "muralikrishna8811@gmail.com",
	"password": "Polling@123"
}, function(error, authData) {
	if (error) {
		console.log("Login Failed!", error);
	} else {
		console.log("Authenticated successfully with payload:", authData);
	}
});





