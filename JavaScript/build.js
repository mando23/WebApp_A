var verify = document.getElementById("next");
var verifyes = document.getElementById("siguiente");
var verifyde = document.getElementById("weiter");

verifyes.addEventListener("click", function(){
	if (confirm('¿Est\u00e1 seguro de que este es el auto de sus sue\u00f1os?')) {
    window.location = "ending_es.html"; 
}
});
