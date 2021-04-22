var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var upKey=38;
var downKey=40;
var rightKey=39;
var leftkey=37;
var food_remain;
var food5;
var food15;
var food25;
var color5Point;
var color15Point;
var color25Point;
var timeGame;
var NumOfManster;
var direction;
var start = 0.15;
var end = 1.85;
var eyeX = 5;
var eyeY = -15;




$(document).ready(function() {
	context = canvas.getContext("2d");
	//logo window
	initial();
	//game window
	//Start();
});
function initial() {
	// document.getElementById("logo").style.display = "block";
	// document.getElementById("register").style.display = "block";
	// document.getElementById("login").style.display = "block";
	switchToWelcome();
}

function Start() {
	//initial score&time
	// document.getElementById("game_window").style.display = "block";
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;//num of cells
	// var food_remain = 50;//num of sweets on board
	var pacman_remain = 1;//num of pacmans?
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) { //obstacles
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				// if (randomNum <= (1.0 * food_remain) / cnt) { // put sweets
				// 	food_remain--;
				// 	board[i][j] = 1;
				// }
				if (randomNum <= (1.0 * food5) / cnt) { // put sweets
					board[i][j] = 1;
					food5--;
					food_remain--;
				}
				else if(randomNum <= (1.0 * food15) / cnt){
					board[i][j] = 3;
					food15--;
					food_remain--;
				} 
				else if(randomNum <= (1.0 * food25) / cnt){
					food25--;
					food_remain--;
					board[i][j] = 5;
				}
				else if ((randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) && pacman_remain>0) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	// food_remain= food_remain-food5-food15;
	setFoodRemaine();
	// while (food_remain > 0) {//all remain sweets
	// 	var emptyCell = findRandomEmptyCell(board);
	// 	board[emptyCell[0]][emptyCell[1]] = 1;
	// 	food_remain--;
	// }
	// setFoodRemaine();
	//click
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function setFoodRemaine(){
	while (food_remain > 0) {//all remain sweets
		var emptyCell = findRandomEmptyCell(board);
		if(food5>0){
			board[emptyCell[0]][emptyCell[1]] = 1;
			food5--;
		}
		else if(food15>0){
			board[emptyCell[0]][emptyCell[1]] = 3;
			food15--;
		}
		else if(food25>0){
			board[emptyCell[0]][emptyCell[1]] = 5;
			food25--;
		}
		food_remain--;
	}
}

// get empty cell
function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[leftkey]) {
		return 1;
	}
	
	if (keysDown[upKey]) {
		return 2;
	}
	if (keysDown[rightKey]) {
		return 3;
	}
	if (keysDown[downKey]) {
		return 4;
	}
	
	
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;

			if (board[i][j] == 2) { // packman	
				var center_x = center.x;
				var center_y = center.y;
				//DrawPack(direction,center_x,center_y);
				//before 
				
				if(direction == 2) //up
				{
				DrawBody(1.7,1.3,center_x,center_y)
				DrawEye(14,2,center_x,center_y);

				}
				else if(direction == 1){//left
					DrawBody(1.2,0.85,center_x,center_y)
					DrawEye(5,-15,center_x,center_y)

				}
				else if(direction==4){//down
					DrawBody(0.6,0.4,center_x,center_y);
					DrawEye(13,2,center_x,center_y);

				}
				else if(direction==3){//right
					DrawBody(0.15,1.85,center_x,center_y)
					DrawEye(5,-15,center_x,center_y)
				}
				else{
					DrawBody(start,end,center_x,center_y);
					DrawEye(eyeX,eyeY,center_x,center_y);
				
				}
				

			} else if (board[i][j] == 1 || board[i][j]==3|| board[i][j]==5) { // sweets
				// context.beginPath();
	            // context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				// context.fillStyle = color5Point;
				// context.fill();
				DrowDiffFood(board[i][j],center.x,center.y);
			
			} else if (board[i][j] == 4) { // walls
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function DrowDiffFood(num,x,y){
	context.beginPath();
	context.arc(x, y, 15, 0, 2 * Math.PI); // circle
	if(num==1){
		context.fillStyle = color5Point;
	}
	else if(num==3){
		context.fillStyle = color15Point;
	}
	else if(num===5){
		context.fillStyle = color25Point;
	}
	context.fill();
}

function DrawBody(startAngle,endAngle,center_x,center_y){
	start = startAngle;
	end = endAngle;
	context.beginPath();
	context.arc(center_x, center_y, 30, startAngle * Math.PI, endAngle * Math.PI); // half circle
	context.lineTo(center_x, center_y);
	context.fillStyle = pac_color; //color
	context.fill();
	

}
function DrawEye(locX,locY,center_x,center_y){
	eyeX = locX;
	eyeY = locY
	context.beginPath();
	context.arc(center_x + locX, center_y + locY,5,0, 2 * Math.PI); // circle - eye
	context.fillStyle = "black"; //color
	context.fill();

}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	direction = x;
	
	if (x == 2) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) { //left
			shape.j--;
		}
	}
	if (x == 1) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) { //up
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) { ////right
			shape.j++;
		}
	}
	
	if (x == 3) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {//down
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		
		Draw();
		
	}
}



