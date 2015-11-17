// <script type="text/javascript" language="JavaScript">

function hideSection(s) {
	document.getElementById(s).style.display = "none";
}
function showSection(s) {
	document.getElementById(s).style.display = "block";
}
function flipSection(s) {
	if(document.getElementById(s).style.display == "none") {
	 	document.getElementById(s).style.display = "block";
	 }
	else { 
		document.getElementById(s).style.display = "none";
	}
}

// </script>