

window.onscroll = function() {myFunction()};
console.log("done!");

var navbar = document.getElementById("topnavigation");


var sticky = navbar.offsetTop();

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

