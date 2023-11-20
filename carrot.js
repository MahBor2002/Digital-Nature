class Carrot {
  constructor(posX, posY) {
    this.position = createVector(posX, posY);
    this.scalingshape = 5;
    this.col = color(255, 100, 0); //color(random(0, 255), random(0, 255), random(0, 255));
    this.eatenRadius = 10;
  }

  show() {
    //noFill();
    stroke(200, 70);
    noFill();
    strokeWeight(1);
    ellipse(this.position.x, this.position.y, this.eatenRadius * 2);

    stroke(this.col);
    strokeWeight(4);
    point(this.position.x, this.position.y);

    textSize(10);
    noStroke();
    fill(this.col);
    text("Carrot", this.position.x - 15, this.position.y - 10);
  }

  getEaten(eater) {
    for (let i = 0; i < eater.length; i++) {
      let d = p5.Vector.dist(this.position, eater[i].position);

      if (d < this.eatenRadius) {
        return true;
      }
    }
    return false;
  }
}
