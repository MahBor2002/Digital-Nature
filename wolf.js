class Wolf {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.scalingshape = 5;
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(10, 20));
    this.acceleration = createVector();
    this.maxForce = 0.3;
    this.maxSpeed = 1;
    this.col = color(0, 10, 255); //color(random(0, 255), random(0, 255), random(0, 255));
    this.pickedFood = null;
    this.perceptionRadius = 20;
    //this.seeingFood = 150;
    this.wanderTheta = PI / 2;
    this.seekRadius = 100;

    this.currentPath = [];
    this.paths = [this.currentPath];
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    this.theta = this.velocity.heading() + PI / 2;

    if (frameCount % 5 == 0) {
      //only draw a path once every 10 frames to save frames
      this.currentPath.push(this.position.copy());
    }

    if (this.currentPath.length > 200 || this.paths.length > 10) {
      this.currentPath = [];
      this.paths = [this.currentPath];
    }
  }

  show() {
    noFill();
    strokeWeight(1);
    stroke(255, 100);
    circle(this.position.x, this.position.y, this.perceptionRadius);
    stroke(0, 0, 255, 50);
    circle(this.position.x, this.position.y, this.seekRadius * 2);

    fill(this.col);
    strokeWeight(2);
    //point(this.position.x, this.position.y);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.theta);
    //stroke(127);

    triangle(
      -this.scalingshape,
      this.scalingshape,
      this.scalingshape,
      this.scalingshape,
      0,
      -this.scalingshape * 2
    );

    textSize(10);
    noStroke();
    text("Wolf", -10, 17);
    pop();

    noFill();
    stroke(0, 0, 255, 30);

    for (let path of this.paths) {
      beginShape();
      for (let v of path) {
        vertex(v.x, v.y);
      }
      endShape();
    }
  }

  edges() {
    let hitEdge = false;
    if (this.position.x > width) {
      this.position.x = 0;
      hitEdge = true;
    } else if (this.position.x < 0) {
      this.position.x = width;
      hitEdge = true;
    }
    if (this.position.y > height) {
      this.position.y = 0;
      hitEdge = true;
    } else if (this.position.y < 0) {
      this.position.y = height;
      hitEdge = true;
    }

    if (hitEdge) {
      this.currentPath = [];
      this.paths.push(this.currentPath);
    }
  }

  seek(findTarget) {
    let d;
    let target = createVector(random(width), random(height));
    let closest = 1000;
    let currentTarget;

    for (let i = 0; i < findTarget.length; i++) {
      d = p5.Vector.dist(this.position, findTarget[i].position);

      if (d < this.seekRadius && d < closest) {
        closest = d;
        target = findTarget[i].position;
        currentTarget = findTarget[i];
      }
    }

    if (target) {
      let desired = p5.Vector.sub(target, this.position);
      desired.setMag(this.maxSpeed);
      return desired;
    } else {
      console.log("No target");
    }
    //let steering = p5.Vector.sub(desired, this.velocity);
    //steering.limit(this.maxForce);
    //this.applyForce(steering);

    //if (d < 10) this.pickedFood = currentTarget;
  }

  separation(boids) {
    let perceptionRadius = this.perceptionRadius;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    this.applyForce(steering);
  }
  //eatFood(target) {

  //}

  wander(target) {
    let wanderPoint = this.velocity.copy();
    wanderPoint.setMag(200);
    wanderPoint.add(this.position);
    if (showDebug) circle(wanderPoint.x, wanderPoint.y, 8);

    let wanderRadius = 50;

    if (showDebug) {
      noFill();
      circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);
      line(this.position.x, this.position.y, wanderPoint.x, wanderPoint.y);
    }

    let rotationalTheta = this.wanderTheta + this.velocity.heading();

    let wanderX = wanderRadius * cos(rotationalTheta);
    let wanderY = wanderRadius * sin(rotationalTheta);
    let wanderVec = createVector(wanderX, wanderY);

    wanderPoint.add(wanderX, wanderY);
    if (showDebug) {
      fill(0, 255, 0);
      circle(wanderPoint.x, wanderPoint.y, 16);
      line(this.position.x, this.position.y, wanderPoint.x, wanderPoint.y);
    }

    let steer = wanderPoint.sub(this.position);
    steer.setMag(this.maxForce / 3);
    this.applyForce(steer);
    let displaceRange = 0.2;
    this.wanderTheta += random(-displaceRange, displaceRange);

    if (!target) {
      //Wander
      let displaceRange = 0.2;
      this.wanderTheta += random(-displaceRange, displaceRange);
      //this.col = color(255, 10, 100);
    } else {
      //Seek
      let targeted = this.seek(target);
      if (targeted.x > 0 && targeted.y > 0) {
        this.wanderTheta = targeted.heading() - this.velocity.heading();
        //this.col = color(0, 100, 100);
      } else {
        //Seek
        let targeted = this.seek(target);
        this.wanderTheta = targeted.heading() - this.velocity.heading();
      }
    }

    /*if (target) {
      let targeted = this.seek(target);
      //if (abs(targeted.x) > 0.01 && abs(targeted.y) > 0.01) {
    
      let pos = createVector(this.position.x, this.position.y);
      pos.sub(targeted);
      let dis = p5.Vector.dist(this.position, targeted);
      console.log(dis);
      if (dis < this.seeingFood) {
        this.wanderTheta = targeted.heading() - this.velocity.heading();
        this.col = color(0, 100, 100);
      } else {
      let displaceRange = 0.55;
      this.wanderTheta += random(-displaceRange, displaceRange);
      this.col = color(255, 10, 100);
    }
      //}
    } else {*/

    //}

    if (showDebug) this.drawArrow(this.position, wanderVec, "red");
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(1);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
}
