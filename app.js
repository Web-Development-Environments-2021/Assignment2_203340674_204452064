var context;
//game
var board;
var width = 15;
var height = 10;
var score;
var lifeGame;
var pac_color;
var start_time;
var timeGame;
var time_elapsed;
var time_remain = timeGame; 

//intrvals
var interval;
var interval2;
var intervalMonster;

var upKey=38;
var downKey=40;
var rightKey=39;
var leftkey=37;

//food
var food_remain;
// var leftToEat=0;
var food5;
var food15;
var food25;
var color5Point;
var color15Point;
var color25Point;
var numOfManster;
var pizza;

//game player
var shape = new Object();
var monsterList;
var direction;
var start = 0.15;
var end = 1.85;
var eyeX = 5;
var eyeY = -15;
var monsterOnsweets;
var slowMotiom;
var flagSlowMotion;
var plusLife1;
var plusLife2;
var minusLife1;

var soundGame;




$(document).ready(function() {
	context = canvas.getContext("2d");   
	initial();
	
});
function initial() {
	switchToWelcome();
}

//stop the game and switch to settings
function newGame(){
	clearAllInterval();
	updateForNewGame();	
	soundGame.stop();
	switchTosettings();	
}

function closeGame(){
	clearAllInterval();
	if(soundGame!= undefined){
		soundGame.stop();
	}
	orignalSettings();
	clearText();	
}

//locate monster in the corners every new game and after rejection
function EmptyCellForMonster(){
	var cellsOfMonsters = [] //location of monster
	var corners=[[0,0],[width-1,0],[0,height-1],[width-1,height-1]]; // all corners
	var monstersRemain = numOfManster;
	var ind=0;
	while(monstersRemain!=0){
		cornerNum = Math.floor(Math.random() * monstersRemain); // choose random corner-> 0-3,0-2....
		var removedCorner = corners[cornerNum];
		cellsOfMonsters.push(removedCorner) // add corner to a new list
		corners.splice(cornerNum,1); // remove the corner from list
		monstersRemain --;
		var newMonster = new Object();
		newMonster.i = removedCorner[0];
		newMonster.j = removedCorner[1];
		monsterList[ind] = newMonster;
		ind++;
	}
	return cellsOfMonsters;
}
//get i,j and check if there monster
function checkIfMonsterCell(monsterLoc,i,j){
	for (var ind = 0; ind <monsterLoc.length;ind++){
		if (monsterLoc[ind][0] == i && monsterLoc[ind][1] == j){
			return true;
		}
	}
	return false;
}
//initialize board from last round
function removeMonsterFromLastRound(){
	var row;
	var col;
	for (var ind = 0; ind < monsterList.length; ind++)
	{
		row = monsterList[ind].i;
		col = monsterList[ind].j;
		if (monsterOnsweets[ind]!= 0)
		{
			board[row][col] = monsterOnsweets[ind];
		}
		else
		{
			board[row][col]=0;
		}
	}
}

function Start() {
	//initial score&time	
	board = new Array();
	pizza= [8,5];
	soundGame = new sound("background_sound.mp3");
	soundGame.play();
	lifeGame=5;
	slowMotiom = 1;
	flagSlowMotion= true;
	// leftToEat = food_remain;
	// leftToEat++;
	score = 0;
	plusLife1 = 1;
	plusLife2 = 1;
	minusLife1 = 1;
	monsterOnsweets=[0,0,0,0];
	pac_color = "yellow";
	monsterList =[];
	var cnt = width*height;//num of cells
	var pacman_remain = 1;//num of pacmans?
	start_time = new Date();
	monstersLoc = EmptyCellForMonster();
	for (var i = 0; i < width; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < height; j++) { //obstacles
			if(checkIfMonsterCell(monstersLoc,i,j)){
				board[i][j] = 6;
			}
			else if  (
				(i == 4 && j == 2) ||
				(i == 4 && j == 3) ||
				(i == 4 && j == 4) || 
				(i == 5 && j == 4) ||
				(i == 7 && j ==7)  ||
				(i == 8 && j == 7) ||
				(i == 9 && j == 7) ||
				(i == 10 && j == 7)||
				(i == 10 && j == 6)||
				(i == 12 && j == 3)||
				(i == 12 && j == 2)||
				(i == 12 && j == 1)||
				(i == 2 && j == 8) ||
				(i == 2 && j == 7) ||
				(i == 2 && j == 6)  
			) {
				board[i][j] = 4;
			 }
			else if(i==8 && j==5){
				board[i][j] = 7
			} 
			else {
		
				var randomNum = Math.random();
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
				else if ((randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) && pacman_remain>0 && (i>2 && i<8)) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				}
				 else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
		
	}
	
	setFoodRemaine();
	setLifeAndSlow();
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
	intervalMonster =setInterval(UpdatePositionMonsters,350);
	interval2= setInterval(UpdatePostionpizza,300);
}

//set the lifeImg and slowImg in random position
function setLifeAndSlow(){
	var emptyCell =  findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 10;
	emptyCell =  findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 11;
	emptyCell =  findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 12;
	emptyCell =  findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 13;

}

// set all the food in the board
function setFoodRemaine(){
	//food_remain= food_remain-food5-food25-food15;
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
	var i = Math.floor(Math.random() * width);
	var j = Math.floor(Math.random() * height);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * width);
		j = Math.floor(Math.random() * height);
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
	lblPlayerName.value = playerName;
	lblLife.value = lifeGame;
	//lblTime.value = time_remain;
	lblTime.value = time_remain	
	var leftToEat = true;
	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			var center = new Object();
			center.x = i * 50 + 30;
			center.y = j * 50 + 30;
			
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
			} 
			else if(board[i][j]==7){      //pizza
				let x1 = pizza[0] * 50 + 30;
				let y1 = pizza[1] * 50 + 30;
				context.beginPath();
				let pizzaImg = document.getElementById('pizza');
				context.drawImage(pizzaImg,x1-20, y1-20 ,30,30);
				context.fill();
				leftToEat= false;
				
			}
			else if (board[i][j] == 1 || board[i][j]==3|| board[i][j]==5) { // sweets
				DrawDiffFood(board[i][j],center.x,center.y);
				leftToEat= false;
			
			} else if (board[i][j] == 4) { // walls
				context.beginPath();
				let wallImg = document.getElementById('wall');
				context.drawImage(wallImg,center.x-20, center.y-20,50,50);
				context.fill();
			}
			else if(board[i][j] == 6 ){ //monster
				context.beginPath();
				monImg = document.getElementById('monImg');
				context.drawImage(monImg,center.x-20, center.y-20,40,40);
				 context.fill();
			}
			else if(board[i][j] == 10){  // slow motion
				context.beginPath();
				let slowImg = document.getElementById('slow');
				context.drawImage(slowImg,center.x-20, center.y-20,40,40);
				context.fill();
			
			}else if(board[i][j] == 11){  // plus 1 life
				context.beginPath();
				let Img1 = document.getElementById('+1Img');
				context.drawImage(Img1,center.x-20, center.y-20,40,40);
				context.fill();
			}	
			else if(board[i][j] == 12){  // plus 2 life
				context.beginPath();
				let Img2 = document.getElementById('+2Img');
				context.drawImage(Img2,center.x-20, center.y-20,40,40);
				context.fill();
			}
			else if(board[i][j] == 13){  // minus 1 life
				context.beginPath();
				let Img1min = document.getElementById('-1Img');
				context.drawImage(Img1min,center.x-20, center.y-20,40,40);
				context.fill();
			}
		}
	}
	if(leftToEat){
		clearAllInterval();
		alert("winner!! good job")
	}
}

// draw the food in different color
function DrawDiffFood(num,x,y){
	context.beginPath();
	context.arc(x, y, 12, 0, 2 * Math.PI); // circle
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
//draw pac depending on direction
function DrawBody(startAngle,endAngle,center_x,center_y){
	start = startAngle;
	end = endAngle;
	context.beginPath();
	context.arc(center_x, center_y, 20, startAngle * Math.PI, endAngle * Math.PI); // half circle
	context.lineTo(center_x, center_y);
	context.fillStyle = pac_color; //color
	context.fill();
	

}
//draw pac's eye depending on direction
function DrawEye(locX,locY,center_x,center_y){
	eyeX = locX;
	eyeY = locY
	context.beginPath();
	context.arc(center_x + locX, center_y + locY,3,1, 2 * Math.PI); // circle - eye
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
		if (shape.j < (height-1) && board[shape.i][shape.j + 1] != 4) { ////right
			shape.j++;
		}
	}
	
	if (x == 3) {
		if (shape.i < (width-1) && board[shape.i + 1][shape.j] != 4) {//down
			shape.i++;
		}
	}

	if (board[shape.i][shape.j] == 1) { // 5 points
		score = score+5;
		// leftToEat--;
	}
	else if (board[shape.i][shape.j] == 3) { // 15 pounts
		score = score+15;
		// leftToEat--;
	}
	else if (board[shape.i][shape.j] ==5) { //25 point
		score = score+25;
		// leftToEat--;
	}
	else if(board[shape.i][shape.j] ==7){  // pizza, 50 points
		pacmanEatPizza();
	}
	else if(board[shape.i][shape.j] == 10){ //slow motion
		clearInterval(intervalMonster);
		intervalMonster = setInterval(UpdatePositionMonsters, 550);
		flagSlowMotion = false;
	}
	else if(board[shape.i][shape.j]==11){ // plus one life
		lifeGame++;
	}
	else if(board[shape.i][shape.j]==12){ // plus 2 life
		lifeGame = lifeGame + 2;
	}
	else if(board[shape.i][shape.j]==13){ // minus one life
		if(lifeGame>0){
		lifeGame--;
		}
	}
	else if(board[shape.i][shape.j]==6){
		rejection();
	}

	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	time_remain = (timeGame - time_elapsed).toFixed(0);
	
	if (score >= 30 && time_remain <= 10) {
		pac_color = "green";
	}

	// if(leftToEat<=0){
	// 	clearAllInterval();
	// 	alert("winner!! good job")
	// }
	else if( time_remain <= 0){
		clearAllInterval();
		if(score<100){
			window.alert("You are better than "+ score + " points");
		}
		else{
			alert("WINNER!!")
		}
	}
	// if (score == 1000) {
	// 	clearAllInterval();
	// 	window.alert("Game completed");
	// } 
  else 
  {
		Draw();	
	}

}

function clearAllInterval(){
	window.clearInterval(intervalMonster);
	window.clearInterval(interval);
	window.clearInterval(interval2);
}
//check if monster and pac in same cell
function pacCloseToMonster(){
	for (var ind=0; ind<monsterList.length; ind++){
		if(Math.abs(shape.i - monsterList[ind].i) < 1 && Math.abs(shape.j - monsterList[ind].j) < 1){
			return true;
		}
	}
	return false;

}
//call every new game to locate the monsters
function locateMonster(monsterLoc)
{
	monsterOnsweets=[0,0,0,0];
	for (var mon = 0; mon < monsterLoc.length; mon++)
	{
		var i = monsterLoc[mon][0];
		var j = monsterLoc[mon][1];
		board[i][j] = 6;
	}
}
// this function check if monster can move to one from 4 direction
// cant move when exist wall or if exist other monster
function UpdatePositionMonsters()
{
	var pacX = shape.i;
	var pacY = shape.j;
	var monX;
	var monY;
	var minDis = Math.sqrt(width*width + height*height);
	var minDir;
	var currDis;
	
	for (var ind = 0; ind < monsterList.length; ind++)
	{
		var row = monsterList[ind].i;
		var col = monsterList[ind].j;
		minDis = Math.sqrt(width*width + height*height);
		minDir = 5;
		
		if(col > 0 && board[row][col - 1] != 4) //no wall in left
		{
			if(board[row][col - 1] != 6) // no monster in left
			{
				monX = row;
				monY = col-1
				currDis = Math.sqrt(Math.pow(monX - pacX,2) + Math.pow(monY - pacY,2));
				if(currDis<=minDis)
				{
					minDis = currDis;
					minDir = 1
				}
			}
		}
		if(row > 0 && board[row - 1][col] != 4) // no walls up 
		{
			if(board[row-1][col] != 6) // no monster up
			{
				monX = row - 1;
				monY = col;
				currDis = Math.sqrt(Math.pow(monX - pacX,2) + Math.pow(monY - pacY,2));
				if(currDis<=minDis)
				{
					minDis = currDis;
					minDir = 2
				}			
			}
		}
		if(col < height-1 && board[row][col + 1] != 4)//no walls right 
		{
			if(board[row][col+1] != 6) // no monster right
			{
				monX = row;
				monY = col+1;
				currDis = Math.sqrt(Math.pow(monX - pacX,2) + Math.pow(monY - pacY,2));
				if(currDis<=minDis)
				{
					minDis = currDis;
					minDir = 3
				}			
			}
		}		
		
		if (row < width-1 && board[row + 1][col] != 4) //no walls down
		{	
			if(board[row+1][col] != 6) // no monster down
			{
				monX = row+1;
				monY = col;
				currDis = Math.sqrt(Math.pow(monX - pacX,2) + Math.pow(monY - pacY,2));
				if(currDis<=minDis)
				{
					minDis = currDis;
					minDir = 4
				}			
			}
		}
		whichObject(row,col,ind); //save the object was
		
		if(minDir==1)
		{
			monsterOnsweets[ind] = board[row][col-1];		
			monsterList[ind].j--;
			
		}
		else if(minDir==2)
		{
			monsterOnsweets[ind] = board[row-1][col];
			monsterList[ind].i--;
			
		}
		else if(minDir==3)
		{
			monsterOnsweets[ind] = board[row][col+1];
			monsterList[ind].j++;
			
		}
		if (minDir == 4)
		{
			monsterOnsweets[ind] = board[row+1][col];
			monsterList[ind].i++;			
		}
		
		row = monsterList[ind].i;
		col = monsterList[ind].j;
		if(board[row][col]==2){
			rejection()
		}
		else{
			board[row][col] = 6;
		}
		
		
	}
	Draw();
}
//call every time monster hit packman
function rejection(){
	if (lifeGame != 0) 
		{
			if(flagSlowMotion == false){
				clearInterval(intervalMonster);
				intervalMonster = setInterval(UpdatePositionMonsters,350);
				flagSlowMotion = true;
			}

			lifeGame = lifeGame -1;
			if(score-10 < 0)
			{
				score = 0;
			}
			else
			{
				score = score - 10;
			}
			//update monster from start
			removeMonsterFromLastRound()
			monstersLoc = EmptyCellForMonster();
			locateMonster(monstersLoc);
			board[shape.i][shape.j] = 0;
			let temp = findRandomEmptyCell(board);
			while(temp[0]<2 || temp[0]>8){
				temp = findRandomEmptyCell(board);
			}
			
			shape.i = temp[0];
			shape.j = temp[1];

			var cuurTime = new Date().getTime();
			while(cuurTime + 2000 >= new Date().getTime()){				
				//document.getElementById('myElem').style.visibility='visible';				
			}
			//document.getElementById('myElem').style.visibility='hidden';
		}
		else //live is over
		{
			
			window.clearInterval(intervalMonster);
			window.clearInterval(interval);
			window.clearInterval(interval2);
			alert("LOSER!!!!");
		}

	}


//update the move of the pizza object
function UpdatePostionpizza(){
	i=pizza[0];
	j=pizza[1];
	let flag=true;
	while(flag==true){
		NewPos = Math.floor(Math.random()*(5-1))+1;
		if(NewPos == 1){//down
			if(i< width-1 && board[i+1][j]!=4){
				pizza[0]= i+1;
				flag= false;
			}
		}
		else if(NewPos==2){ //up
			if(i>0 && board[i-1][j]!=4){
				pizza[0]= i-1;
				flag= false;
			} 
		}
		else if(NewPos==3){//left
			if(j>0 && board[i][j-1]!=4){
				pizza[1]= j-1;
				flag= false;
			}
		}
		else if(NewPos==4){//right
			if(j<height-1 && board[i][j+1] != 4){
				pizza[1] = j+1;
				flag = false;
			}
		}
	}
	if(pizza[2]!= undefined && pizza[2]!= 6){
		board[i][j]=pizza[2];
	}
	else{
		board[i][j]=0;
	}
	
	if(board[pizza[0]][pizza[1]]==2){
		pacmanEatPizza();
	}
	else{
		pizza[2]= board[pizza[0]][pizza[1]];
		board[pizza[0]][pizza[1]]=7;
	}
	Draw();
}
//check if curr cell included food - for return when monster pass else put in cell value 0
function whichObject(i,j,monInd){
	var foods = [1,3,5,10,11,12,13];
	if(foods.includes(monsterOnsweets[monInd])){
		board[i][j] = monsterOnsweets[monInd];
	}
	else{
		board[i][j] =0;
	}
}

//when pacman and pizza on same cell
function pacmanEatPizza(){
	window.clearInterval(interval2);
	score = score+50;
	// leftToEat--;
}
