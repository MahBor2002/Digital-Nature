const bunnies = [];
const carrots = [];
const wolves = [];

let target;
let eater;
let totalEatenFood = 0;

let wolfEater;
let totalEatenBunny = 0;

let showDebug = false;
let debugBtn;

function setup() {
  createCanvas(600, 600);
  button = createButton("Debug View");
  button.mousePressed(toggleDebugView);

  for (let i = 0; i < 20; i++) {
    bunnies.push(new Bunny());
  }

  for (let i = 0; i < 100; i++) {
    carrots.push(new Carrot(random(width), random(height)));
  }

  for (let i = 0; i < 5; i++) {
    wolves.push(new Wolf());
  }
}

function draw() {
  background(0);
  //target = createVector(mouseX, mouseY);
  //ellipse(target.x, target.y, 32, 32);

  for (let boid of bunnies) {
    boid.edges();

    if (carrots.length < 1) {
      for (let boid of bunnies) {
        boid.wander(null);
      }
    } else {
      for (let boid of bunnies) {
        boid.wander(carrots);
      }
    }

    let flee = boid.flee(wolves);
    boid.applyForce(flee);

    boid.separation(bunnies);

    boid.update();
    //boid.show();
  }

  for (let boid of wolves) {
    boid.edges();

    if (bunnies.length < 1) {
      for (let boid of wolves) {
        boid.wander(null);
      }
    } else {
      for (let boid of wolves) {
        boid.wander(bunnies);
      }
    }

    boid.separation(wolves);

    boid.update();
    boid.show();
  }

  for (let i = 0; i < bunnies.length; i++) {
    wolfEater = bunnies[i].getEatenByWolves(wolves);
    bunnies[i].show();

    if (wolfEater) {
      bunnies.splice(i, 1);
      totalEatenBunny++;
      //console.log("Total carrots eaten: " + totalEatenBunny);
    }
  }

  for (let i = 0; i < carrots.length; i++) {
    eater = carrots[i].getEaten(bunnies);
    carrots[i].show();

    if (eater) {
      carrots.splice(i, 1);
      totalEatenFood++;
      //console.log("Total carrots eaten: " + totalEatenFood);
    }
  }

  if (carrots.length < 1) {
    for (let i = 0; i < 20; i++) {
      carrots.push(new Carrot(random(width), random(height)));
    }
  }
}

function mouseClicked() {
  if (mouseX < width && mouseY < height) {
    carrots.push(new Carrot(mouseX, mouseY));
  }
}

function toggleDebugView() {
  showDebug = !showDebug;
}


/*
Lifetime
Reproduction
Debug Levels
*/