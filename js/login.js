function login(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(email === "" || password === ""){
alert("Enter email and password");
return;
}

window.location.href = "dashboard.html";

}