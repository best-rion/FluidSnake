function distance(x,y){
    return Math.pow( x*x + y*y , 0.5 )
}


var container = document.getElementById("container");

var containerWidth = 600, containerHeight = 720;
var width = containerWidth/20;
var height = containerHeight/20;

var grid = [];

// Grid creation //
for (var y=0; y<containerHeight; y+=20)
{
    var row = [];

    for (var x=0; x<containerWidth; x+=20)
    {
        var fluidPoint = document.createElement("div");
        fluidPoint.setAttribute("class", "point");
        fluidPoint.style.left = (x + 10) + "px";
        fluidPoint.style.top  = (y + 10) + "px";
        fluidPoint.style.height = "2px";
        fluidPoint.style.width = "2px";
        container.appendChild(fluidPoint);

        row.push( fluidPoint );

    }
    grid.push( row );
}






//////////////////// SNAKE //////////////////////////




var lastSwipe, swipe, lastKey, key, headX = 0, headY= 0, foodX = 100, foodY = 100, bodySize = 1;



var button = document.getElementById("button");
var score = document.getElementById("score");
score.innerHTML = "0";
var head = document.getElementById("headCell");
head.style.left = "0px";
head.style.top = "0px";
var food = document.getElementById("food");
var foodIndex = {x: 5, y:5};

var tail1 = document.getElementById("tail1");
var tail2 = document.getElementById("tail2");
var tail3 = document.getElementById("tail3");
var tail1Index = {x:0, y:0}
var tail2Index = {x:0, y:0}
var tail3Index = {x:0, y:0}


function changeButtonState()
{
    if (button.innerHTML == "Pause")
    {
        button.innerHTML = "Resume";
        button.style.backgroundColor = "#000";
        button.style.color = "#fff";
    }
    else
    {
        button.innerHTML = "Pause";
        button.style.backgroundColor = "#fff";
        button.style.color = "#000";
    }
}

var id = setInterval(frame, 130);
var gameOver = false;
var waveRadiusForGameOver = 0;

var cellDivs = [head];
var headIndex = {x: 0, y: 0};
var bodyIndexes = [headIndex];



const MAX_WAVES_FOR_BITE = 3;
var waveRadiusForBite = new Array(MAX_WAVES_FOR_BITE);
for( var i=0; i<MAX_WAVES_FOR_BITE; i++)
{
    waveRadiusForBite[i] = -1;
}
var foodPositions = new Array(MAX_WAVES_FOR_BITE);
var waveNumberForBite = 0;



const MAX_WAVES_FOR_FOOD = 8;
var waveRadiusForFood = new Array(MAX_WAVES_FOR_FOOD);
for( var i=0; i<MAX_WAVES_FOR_FOOD; i++)
{
    waveRadiusForFood[i] = -1;
}


var waveRadiusForTurn = -1;
var turnPositionX;
var turnPositionY;

function frame()
{

    for (var i = 1; i < bodySize; i++)
    {
        var cellIndex = bodyIndexes[i];

        if ( cellIndex.x == headIndex.x && cellIndex.y == headIndex.y )
        {
            gameOver = true;
        }
    }

    if (gameOver)
    {
        var gameOverDiv = document.getElementById("gameOver");
        gameOverDiv.innerHTML = "GAME OVER";
        gameOverDiv.style.display = "block";
        clearInterval(id);
        for (var i=0; i<bodySize; i++)
        {
            cellDivs[i].style.display = "none";
            tail1.style.display = "none";
            tail2.style.display = "none";
            tail3.style.display = "none";
        }
    }
    else
    {
        if (button.innerHTML == "Pause") // It means the game is going on.
        {
            var lastPositionOfHead = {x:headIndex.x, y:headIndex.y}; // We are gonna turn the snake. We better store its current head position to pass it to the next cell;

            //////// LOGIC FOR TURNING (START) ///////////////
            {
                
            ////////////// For PC //////////////
            document.onkeydown = checkKey;

            lastKey = key;
            function checkKey(e)
            {

                if (e.keyCode == '38' && lastKey != "bottom")
                {
                    key = "top";
                    waveRadiusForTurn= 0;
                    turnPositionX = headIndex.x;
                    turnPositionY = headIndex.y;
                }
                else if (e.keyCode == '39' && lastKey != "left")
                {
                    key = "right";
                    waveRadiusForTurn = 0;
                    turnPositionX = headIndex.x;
                    turnPositionY = headIndex.y;
                }
                else if (e.keyCode == '40' && lastKey != "top")
                {
                    key = "bottom";
                    waveRadiusForTurn = 0;
                    turnPositionX = headIndex.x;
                    turnPositionY = headIndex.y;
                }
                else if (e.keyCode == '37' && lastKey != "right") 
                {
                    key = "left";
                    waveRadiusForTurn = 0;
                    turnPositionX = headIndex.x;
                    turnPositionY = headIndex.y;
                }
            }
            
            ////////////// For Mobile //////////////
            document.addEventListener('touchstart', handleTouchStart, false);
            document.addEventListener('touchmove', handleTouchMove, false);

            var xDown = null;
            var yDown = null;

            function getTouches(evt)
            {
                return evt.touches ||             // browser API
                    evt.originalEvent.touches; // jQuery
            }

            function handleTouchStart(evt) 
            {
                const firstTouch = getTouches(evt)[0];
                xDown = firstTouch.clientX;
                yDown = firstTouch.clientY;
            };

            function handleTouchMove(evt) 
            {
                if (!xDown || !yDown) 
                {
                    return;
                }

                var xUp = evt.touches[0].clientX;
                var yUp = evt.touches[0].clientY;

                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;
                lastSwipe = swipe;
                if (Math.abs(xDiff) > Math.abs(yDiff)) /*most significant*/
                {
                    if ((xDiff > 0) && (lastSwipe != "right"))
                    {
                        /* left swipe */
                        swipe = "left";
                        
                        waveRadiusForTurn = 0;
                        turnPositionX = headIndex.x;
                        turnPositionY = headIndex.y;
                    }
                    else if ((xDiff < 0) && (lastSwipe != "left")) 
                    {
                        /* right swipe */
                        swipe = "right";
                            
                        waveRadiusForTurn = 0;
                        turnPositionX = headIndex.x;
                        turnPositionY = headIndex.y;
                    }
                }
                else
                {
                    if ((yDiff > 0) && (lastSwipe != "bottom"))
                    {
                        /* up swipe */
                        swipe = "top";
                        
                        waveRadiusForTurn = 0;
                        turnPositionX = headIndex.x;
                        turnPositionY = headIndex.y;
                    }
                    else if ((yDiff < 0) && (lastSwipe != "top")) 
                    {
                        /* down swipe */
                        swipe = "bottom";
                        
                        waveRadiusForTurn = 0;
                        turnPositionX = headIndex.x;
                        turnPositionY = headIndex.y;    
                    }
                }
                /* reset values */
                xDown = null;
                yDown = null;
            };


            if (swipe == "top" || key == "top")
            {
                headIndex.y -= 1;
                if (headIndex.y == -1)
                {
                    headIndex.y += height;
                }
                head.style.top = (headIndex.y * 20) + "px";
            } 
            else if (swipe == "right" || key == "right") 
            {
                headIndex.x += 1;
                if (headIndex.x == width)
                {
                    headIndex.x -= width;
                }
                head.style.left = (headIndex.x * 20) + "px";
            }
            else if (swipe == "bottom" || key == "bottom")
            {
                headIndex.y += 1;
                if (headIndex.y == height)
                {
                    headIndex.y -= height;
                }
                head.style.top = (headIndex.y * 20) + "px";
            }
            else if (swipe == "left" || key == "left")
            {
                headIndex.x -= 1;
                if (headIndex.x == -1)
                {
                    headIndex.x += width;
                }
                head.style.left = (headIndex.x * 20) + "px";
            }

            //////////// LOGIC FOR TURNING (END) ///////////////
            }
            // We moved a frame and Head has got new position.

            if ((headIndex.x == foodIndex.x) && (headIndex.y == foodIndex.y)) 
            {
                score.innerHTML = "" + bodySize;

                

                ////////////////   FLUID ANIMATION (START)   ///////////////////
                //var audio = new Audio("snake.ogg")
                //audio.play();


                var foodPosition = {x:null, y:null};
                foodPosition.x = foodIndex.x;
                foodPosition.y = foodIndex.y;

                waveRadiusForBite[waveNumberForBite] = 0;
                foodPositions[waveNumberForBite] = foodPosition;
                waveNumberForBite++;
                 
                if (waveNumberForBite==MAX_WAVES_FOR_BITE)
                {
                    waveNumberForBite = 0;
                }

                ////////////////   FLUID ANIMATION (END)   ///////////////////
                
                
                // Finding new random position for food
                var positionForNewFoodFound = false;

                while ( !positionForNewFoodFound )
                {
                    foodIndex.x = Math.floor(Math.random() * width);
                    foodIndex.y = Math.floor(Math.random() * height);

                    positionForNewFoodFound = true;

                    for (var i = 0; i < bodySize; i++)
                    {

                        if ((foodIndex.x == bodyIndexes[i].x) && (foodIndex.y == bodyIndexes[i].y))
                        {
                            positionForNewFoodFound = false;
                            break;
                        }
                    }
                }

                food.style.left = (foodIndex.x * 20) + "px";
                food.style.top = (foodIndex.y * 20) + "px";


                // Adding new cell to Snake's body
                var newCell = document.createElement("div");
                newCell.setAttribute("class", "cell"); // for css and stuff
                document.getElementById("container").appendChild( newCell );

                cellDivs.push( newCell );

                bodyIndexes.push({x:null, y:null});

                bodySize++;
            }


                
            var takeNewPositionFromHere = lastPositionOfHead;
            var putYourOldPositionHere;

            if (bodySize > 1) {

                for (var i = 1; i < bodySize; i++) {
                    
                    putYourOldPositionHere = {x:bodyIndexes[i].x, y:bodyIndexes[i].y};

                    bodyIndexes[i].x = takeNewPositionFromHere.x;
                    bodyIndexes[i].y = takeNewPositionFromHere.y;


                    cellDivs[i].style.left = (bodyIndexes[i].x * 20) + "px";
                    cellDivs[i].style.top = (bodyIndexes[i].y * 20) + "px";

                    takeNewPositionFromHere = putYourOldPositionHere; // The next cell will take its new position from what the the previous cell has left for it.
                }
            }
            
            putYourOldPositionHere = {x:tail1Index.x, y:tail1Index.y};
            tail1Index.x = takeNewPositionFromHere.x;
            tail1Index.y = takeNewPositionFromHere.y;
            takeNewPositionFromHere = putYourOldPositionHere;

            putYourOldPositionHere = {x:tail2Index.x, y:tail2Index.y};
            tail2Index.x = takeNewPositionFromHere.x;
            tail2Index.y = takeNewPositionFromHere.y;
            takeNewPositionFromHere = putYourOldPositionHere;

            putYourOldPositionHere = {x:tail3Index.x, y:tail3Index.y};
            tail3Index.x = takeNewPositionFromHere.x;
            tail3Index.y = takeNewPositionFromHere.y;

            tail1.style.left = (tail1Index.x * 20) + "px";
            tail1.style.top = (tail1Index.y * 20) + "px";
            tail2.style.left = (tail2Index.x * 20) + "px";
            tail2.style.top = (tail2Index.y * 20) + "px";
            tail3.style.left = (tail3Index.x * 20) + "px";
            tail3.style.top = (tail3Index.y * 20) + "px";
        }
    }
}

var newInterval = setInterval( waveAnimation, 120);
var count = 0;
var waveNumberForFood = 0;

var foodOnce = new Array(MAX_WAVES_FOR_FOOD);
var biteOnce = new Array(MAX_WAVES_FOR_BITE);

function waveAnimation()
{
    var turnOnce = true;

    for (var i=0; i<MAX_WAVES_FOR_FOOD; i++)
    {
        foodOnce[i] = true;
    }

    for (var i=0; i<MAX_WAVES_FOR_BITE; i++)
    {
        biteOnce[i] = true;
    }


    for (var y=0; y<height; y++)
    {
        for (var x=0; x<width; x++)
        {    
            var dist;
            var opacity = 2;
            for ( var k=0; k<MAX_WAVES_FOR_BITE; k++)
            {

                if (waveRadiusForBite[k] != -1 && dist <= 30)
                {
                    dist = distance( (x - foodPositions[k].x), (y - foodPositions[k].y) );

                    if (dist <= 30)
                    {
    
                        opacity +=  3.2*Math.exp( -1*( waveRadiusForBite[k]- dist )*( waveRadiusForBite[k]- dist ) ) ;
    
                        if (biteOnce[k])
                        {
                            waveRadiusForBite[k]++;
                            if(waveRadiusForBite[k]>30)
                            {
                                waveRadiusForBite[k] = -1;
                            }
                            biteOnce[k] = false;
                        }

                    }

                }

            }

            for(var i=0; i<MAX_WAVES_FOR_FOOD; i++)
            {
                dist = distance( (x - foodIndex.x) , (y - foodIndex.y) );
                
                if (waveRadiusForFood[i] != -1 && dist <= 18)
                {
                    opacity +=  1*Math.exp( -1*( waveRadiusForFood[i] - dist )*( waveRadiusForFood[i] - dist ) );

                     if (foodOnce[i]){
                        waveRadiusForFood[i]++;
                        if(waveRadiusForFood[i]>18)
                        {
                            waveRadiusForFood[i] = -1;
                        }
                         foodOnce[i] = false;
            
                     }
                    
                }

            }

            dist = distance( (x - turnPositionX) , (y - turnPositionY) );
            if (waveRadiusForTurn != -1 && dist <=12)
            {
                
                opacity +=  1.6*Math.exp(-1*( waveRadiusForTurn - dist)*( waveRadiusForTurn - dist) );
                
                if (turnOnce){
                    waveRadiusForTurn++;
                    if(waveRadiusForTurn>12)
                    {
                        waveRadiusForTurn = -1;
                    }
                    turnOnce = false;
                }
                
            }

            if(gameOver)
            {
                dist = distance( (x - headIndex.x) , (y - headIndex.y) );
                opacity +=12*Math.exp(-1*( waveRadiusForGameOver - dist)*( waveRadiusForGameOver - dist) );
            }
    

            grid[y][x].style.width = Math.round(opacity) + "px";
            grid[y][x].style.height = Math.round(opacity) + "px";
        }
    }
    if(gameOver){

        if(waveRadiusForGameOver<50){
            waveRadiusForGameOver++;
        }else{
            gameOver = false;
        }
    }


    if(count==10){
        waveRadiusForFood[waveNumberForFood] = 0;
        waveNumberForFood++;
        if(waveNumberForFood == MAX_WAVES_FOR_FOOD)
        {
            waveNumberForFood=0;
        }
        count = 0;
    }
    count++;
}
