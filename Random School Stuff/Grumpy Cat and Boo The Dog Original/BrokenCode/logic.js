// When the factButton is clicked...
$("#factButton").on("click", function() {
	// We generate a random number between 0 and 4 (the number of facts in the dogFactArray)
	var number = Math.floor((Math.random() * FactsArray.length));
	// We display the fact from the dogFactArray that is in the random position we just generated.
	$("#factText").text(FactsArray[number])
})

// This array holds all of our  the Dog facts!
var FactsArray = ["Boo is a pomeranian, 's best friend is another pomeranian named Buddy,  the Pomeranian was born on March 16, making him a Pisces, 's favourite food is grass,  has released two ks"]

// When the textPink button is pressed...
$("#textPink").on("click", function() {
	// Change funText to pink.
	$("#funText").css("color", "pink")
})

// When the textOrange button is pressed...
$("#textOrange").on("click", function() {
	// Change funText to Orange.
	$("#funText").css("color", "orange")
})

// When the textGreen button is pressed...
$("#textGreen").on("click", function() {
	// Change funText to green.
	$("#funText").css("color", "green")
})


// When the boxGrow button is clicked...
$("#boxGrow").on("click", function() {
	// Increase the size of the box.
	$("#box").animate({height:"+=35px", width:"+=35px"}, "fast");
})

// When the boxShrink button is clicked...
$("#boxShrink").on("click", function() {
	// Decrease the size of the box.
	$("#box").animate({height:"-=35px", width:"-=35px"}, "fast");
})