//Changing the color to Blue!
document.getElementById("button2").addEventListener(
    "click", 
    function(){
        document.getElementById("box").style.backgroundColor = "Blue";
    }
);
//Changing the size!
document.getElementById("button1").addEventListener(
    "click", 
    function(){
        document.getElementById("box").style.height = "400px"; 
        document.getElementById("box").style.width = "400px";
    }
);
//Reseting the box!
document.getElementById("button4").addEventListener(
    "click",
    function(){
        document.getElementById("box").style.height = "150px";
        document.getElementById("box").style.width = "150px";
        document.getElementById("box").style.backgroundColor = "orange";
        document.getElementById("box").style.opacity = "1";
    
    }
);
//Fading the box!
document.getElementById("button3").addEventListener(
    "click",
    function(){
        document.getElementById("box").style.opacity = "0.5";
    }
);
