$(document).ready(function() {
var random_result;
var lost = 0;
var win = 0;
var previous = 0;

var resetStart = function() {

//clear the divs and set them up again
$(".chrystals").empty();

//Generating random starting number
random_result = Math.floor(Math.random() * 101) + 19;
$("#random_result").html('Target Number: ' + random_result);
console.log(random_result);

//looping the divs
for(var i = 0; i < 4; i++){ 
    var random = Math.floor(Math.random() * 11) +1;
    
    console.log(random);

    var chrystal = $("<div>");
        chrystal.attr({
            "class": 'chrystal',
            "data-random": random
        });
    $(".chrystals").append(chrystal);
    $('.chrystal').empty();
    $('.chrystal').prepend('<img id="red_crystal" src="/Users/andrewmayo/Desktop/Unit-4-HW/Assets/Images/redClear.png"/>');
   
}}

//without this function the game will not start
resetStart();


//clicking the divs and their actions (event delagation)
//...this click function cant work with something new after  a reset if you target .chrystal... this is called event delegation
$(document).on('click', '.chrystal', function() {
    
    var num = parseInt($(this).attr('data-random'));
    previous += num;
    if(previous > random_result){
        lost++;
        previous = 0;
        $("#lost").html('Lost: ' + lost);
        alert("You've Lost!");
        resetStart();
    } else if(previous === random_result){
        win++;
        previous = 0;
        $("#win").html('Wins: ' + win);
        alert("You've Won!");
        resetStart();
    }
    $("#current_score").html("Current Number: " + previous);
});


});

