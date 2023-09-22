let theta = 0;
let omega = -0.1;
let pointArr = [];
let state = 0;
let projectButton_1;
let Projected = false;
let coriolisPoint;
let omega_vec;
let menu_1;
let menu_2

function setup() {
  createCanvas(window.innerWidth, window.innerHeight - 1);
  frameRate(60);
  omegaSlider = createSlider(-500, 500, 0, 25);
  omegaSlider.position(width / 2 - 150, 50);
  omegaSlider.size(300, AUTO);
  thetaSlider = createSlider(0, 360, 270, 15);
  thetaSlider.position(100, 50);
  thetaSlider.size(300, AUTO);
  radiiSlider = createSlider(0, height / 2 - 150, 50, 10);//height/4-200
  radiiSlider.position(width - 400, 50);
  radiiSlider.size(300, AUTO);
  coriolisPoint = new CoriolisSeeder();

  projectButton_1 = new Button(250, height / 2, 150, 100);
  stateButton_1 = new Button(width-250, height / 2, 200, 100);
  menuButton_1 = new Button(250, height-275, 250, 50);
  menuButton_2 = new Button(width-250, height-275, 250, 50);
}

function rot(a, b) {
  a -= width / 2;
  b -= height / 2;
  s = sin(theta);
  c = cos(theta);
  return createVector(a * c - b * s + width / 2, a * s + b * c + height / 2);
}

function drawCrosshair0() {
  stroke(0);strokeWeight(2);
  line(rot(width / 2 - 15, height / 2).x, rot(width / 2 - 15, height / 2).y, rot(width / 2 + 15, height / 2).x, rot(width / 2 + 15, height / 2).y);
  line(rot(width / 2, height / 2 - 15).x, rot(width / 2, height / 2 - 15).y, rot(width / 2, height / 2 + 15).x, rot(width / 2, height / 2 + 15).y);
}

function mouseClicked() {
  if (state === 0 && dist(width / 2, height / 2, mouseX, mouseY) < (height - 210) / 2) {
    pointArr.push(new pointSeed(mouseX, mouseY, theta, 'black'));
  }
  if (projectButton_1.clicked()) {
    setProjected();
  }
  if (stateButton_1.clicked()){
    setState();
  }
  if (menuButton_1.clicked()){
    menu_1 = !menu_1;
  }
  if (menuButton_2.clicked()){
    menu_2 = !menu_2;
  }
}

function setOmega() {
  omega = omegaSlider.value() / 5000;
  textAlign(CENTER); textSize(20); text('Angular velocity, ω: ' + omegaSlider.value() / 250 + 'π', width / 2, 50);
}

function setTheta() {
  coriolisPoint.theta = radians(thetaSlider.value()-180);
  textAlign(CENTER); textSize(20); text('Direction of Applied (Green) Velocity, θ: ' + thetaSlider.value() + '°', 250, 50);
}

function setRadius() {
  if(!Projected){coriolisPoint.s = radiiSlider.value();}
  textAlign(CENTER); textSize(20); text('Distance from centre, r: ' + radiiSlider.value(), width-250, 50);
}

function setProjected(){
  if(state === 0){
    pointArr = [];
  }
  if(state === 1){
    Projected = !Projected;
    coriolisPoint.transition();
    pointArr = [];
    console.log("PROJECT");
  }
}

function setState(){
  state++;
  pointArr=[];
  console.log("STATE");
}

function draw() {
  textSize(20);
  if (state === 0) {
    background(0); fill(255); stroke(0); thetaSlider.hide(); radiiSlider.hide(); omegaSlider.show(); stateButton_1.display(); projectButton_1.display(); 
    Projected = false;
    fill(0); textAlign(CENTER, CENTER);
    text('CLEAR', 250, height / 2, 100, 50);
    text('SWITCH SIMULATION', width-250, height / 2, 100, 500);
    fill(255); 
    setOmega();
    circle(width/2, height/2, height - 200);
    stroke(0);
    for (let i = 0; i < pointArr.length; i += 1) {
      pointArr[i].displayRot();
      pointArr[i].displayAccVec();
      pointArr[i].displayVelVec();
    }
    stroke(255);
    //LEGEND + HELP
    if(pointArr.length==0){textSize(24);fill(0); noStroke(); text("Click anywhere on the circle to begin!", width/2, height/2+50, 600, 100);}
    fill(255);stroke(255);textSize(20);
    if(!menu_1){
      rect(250, height-275, 250, 50);
      stroke(0); fill(0); strokeWeight(2);
      text("CLICK FOR LEGEND", 250, height-275, 250, 50); noStroke();rectMode(CENTER);
    }
    else{
      rect(250, height-150, 250, 300);
      stroke(0); fill(0); strokeWeight(2);
      text("LEGEND", 250, height-275, 250, 50); noStroke();rectMode(CENTER);
      text("Tangential Velocity: ", 200, height-200, 125, 50); stroke('blue'); line(270, height-200, 350, height-200); noStroke();
      text("Centripetal Acceleration: ", 200, height-100, 125, 75); stroke('red'); line(270, height-112.5, 350, height-112.5); noStroke();
    }
    drawCrosshair0();
  }
  if (state === 1) {
    background(0); fill(255); stroke(0); projectButton_1.display(); stateButton_1.display(); 
    fill(0); textAlign(CENTER, CENTER);
    if(!Projected){
      thetaSlider.show(); radiiSlider.show(); omegaSlider.show();
      text('CUT THE STRING', 250, height / 2, 100, 50);
    }
    else{
      omegaSlider.hide();
      text('RESET', 250, height / 2, 100, 50);
    }
    text('SWITCH SIMULATION', width-250, height / 2, 100, 500);
    fill(255);
    setOmega();
    setTheta();
    setRadius();
    circle(width / 2, height / 2, height - 200);
    if (Projected == false) {
      coriolisPoint.displayStrapped();
    }
    else{
      coriolisPoint.displayProjected();
    }
    //LEGEND
    fill(255);stroke(255);
    if(!menu_1){
      rect(250, height-275, 250, 50);
      stroke(0); fill(0); strokeWeight(2);
      text("CLICK FOR LEGEND", 250, height-275, 250, 50); noStroke();rectMode(CENTER);
    }
    else{
      rect(250, height-150, 250, 300);
      stroke(0); fill(0); strokeWeight(2);
      text("LEGEND", 250, height-275, 250, 50); noStroke();rectMode(CENTER);textSize(20);
      text("Thrown Velocity: ", 200, height-200, 125, 50); stroke(150, 255, 150); line(270, height-200, 350, height-200); noStroke();
      text("Final Velocity: ", 200, height-112.5, 125, 50); stroke(0, 0, 0); line(270, height-112.5, 350, height-112.5); noStroke();
      text("Cut the brown string to release the ball!", 250, height-35, 250, 100); noStroke(); line(270, height-112.5, 350, height-112.5);
    }
    //LEGEND
    if(menu_2){
      fill(255);stroke(255);
      rect(width-250, height-150, 250, 300);
      stroke(0); fill(0); strokeWeight(2);
      text("LEGEND", width-250, height-275, 250, 50); noStroke();rectMode(CENTER);textSize(20);
      text("Actual Ball:", width-250, height-225, 125, 50); stroke('black'); circle(width-250, height-200, 15);noStroke();
      text("Traces & Predicted Trajectories of Ball: ", width-250, height-125, 250, 100); stroke('grey'); fill('grey'); circle(width-250, height-87.5, 15);noStroke();fill('black');
      text("Cut the brown string to release the ball!", 250, height-35, 250, 100); noStroke(); line(270, height-112.5, 350, height-112.5);
      omega_vec = createVector(0, 0, -omega);
    }
    else{
      fill(255);stroke(255);
      rect(width-250, height-275, 250, 50);
      stroke(0); fill(0); strokeWeight(2);
      text("CLICK FOR LEGEND", width-250, height-275, 250, 50); noStroke();rectMode(CENTER);textSize(20);
    }
    drawCrosshair0();
  }
  theta-=omega;
  state%=2;
}
