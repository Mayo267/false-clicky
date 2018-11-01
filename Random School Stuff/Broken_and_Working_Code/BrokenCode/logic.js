$("#factButton").on("click", function() {
	var number = Math.floor((Math.random() * booFacts.length));
	$("#factText").text(booFacts[number])
})
//Boo Facts Button Response
var booFacts = ["Boo is a pomeranian, Boo's best friend is another pomeranian named Buddy, Boo the Pomeranian was born on March 16, making him a Pisces, Boo's favourite food is grass, Boo has released two books" ]

//Change the text to orange
$("#textOrange").on("click", function() {
$("#funText").css("color", "orange")
})
//Change the text to green
$("#textGreen").on("click", function() {
	$("#funText").css("color", "green")
})
//Change the text to pink
$("#textPink").on("click", function() {
	$("#funText").css("color", "pink")
})
//Box grow
$("#boxGrow").on("click", function() {
	$("#box").animate({height:"+=35px", 
		width:"+=35px"}, "fast");
})
//Box shrink
$("#boxShrink").on("click", function() {
	$("#box").animate({height:"-=35px", width:"-=35px"}, "fast");
})