let Engine = Matter.Engine;
let Render = Matter.Render;
let World = Matter.World;
let Body = Matter.Body;
let Bodies = Matter.Bodies;
let Composite = Matter.Composite;
let Events = Matter.Events;

let engine = Engine.create();
Engine.run(engine); // run the engine

let paddle;
let boxes = [];

let isGameOver = false;

let date = new Date();
let time = date.getTime(); // used for spawning rows of falling boxes every few seconds
let secondsBetweenBlockSpawns = 3;

let scoreKeeper;

let explosions = []; // stores the explosion effect on collision

function setup() {
  const h = max(windowHeight, 568);
  const w = min(windowWidth, h);
  createCanvas(w, h);

  paddle = new Paddle(w * 0.5, h * 0.9);

  scoreKeeper = new ScoreKeeper();
}


function draw() {
  background(198, 70, 49); // vermillion

  if (!isGameOver) {
    paddle.render();
    paddle.move();
  }

  if (!isGameOver) {
    spawnBoxesAfterSetInterval(); // checks if enough time has passed to add more boxes
  }

  for (let i = boxes.length - 1; i >= 0; i--) { // go backwards so we can splice boxes out without disrupting loop
    let b = boxes[i];
    b.render();
    if (b.isOffscreen() && !isGameOver) {
      scoreKeeper.incrementScore(1);
      World.remove(engine.world, b);
      boxes.splice(i, 1);
    }
  }

  for (let i = explosions.length - 1; i >= 0; i--) { // for collision animation
    explosions[i].update();
    explosions[i].show();

    if (explosions[i].done()) {
      explosions.splice(i, 1);
    }
  }

  if (isGameOver) {
    scoreKeeper.renderGameOverScore();
  } else {
    scoreKeeper.render();
    let currentScore = scoreKeeper.score;
    setGravity(currentScore); // change gravity setting depending on the user's score
  }
}

function setGravity(currentScore) {
  let yGravity = engine.world.gravity.y;
  if (currentScore < 12) {
    yGravity = 1; // ease the player into the game
  } else {
    yGravity += 0.0001; // game gets more difficult over time
  }
  constrain(yGravity, 1, 2); // constrain difficulty
  engine.world.gravity.y = yGravity;
}

class ScoreKeeper {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.minScoreLength = 5;
    this.position = createVector(width * 0.98, height * 0.1);
  }

  getTextScore(intScore) {
    let s = intScore + "";
    while (s.length < this.minScoreLength) {
      s = "0" + s;
    }
    return s;
  }

  incrementScore(num) {
    this.score += num;
    if (this.score >= this.highScore) {
      this.highScore = this.score;
    }
  }

  resetScore() {
    this.score = 0;
  }

  renderGameOverScore() {
    let textScore = this.getTextScore(this.score);
    let textHighScore = this.getTextScore(this.highScore);
    let isNewHighScore = this.score >= this.highScore && this.score > 0;
    const x = width * 0.5;
    const y = (height * 0.5) - 144;
    push();
    textAlign(CENTER, CENTER);
    if (isNewHighScore) {
      fill(12);
      textSize(48);
      text("High Score!", x, y + 96);
      fill(255);
      text(textHighScore, x, y + 144);
    } else {
      textSize(20);
      fill(12);
      text("High Score", x, y);
      textSize(32);
      text("Blocks Dodged", x, y + 96);
      fill(255);
      text(textHighScore, x, y + 32);
      textSize(64);
      text(textScore, x, y + 144);
    }
    rectMode(CENTER);
    fill(12);
    rect(x, y + 246, 84, 84, 5); // shadow for faux "button"
    fill(255);
    rect(x, y + 242, 84, 84, 5); // faux restart "button" (user can click anywhere to restart)
    noFill();
    stroke(12);
    strokeWeight(4);
    arc(x, y + 236, 42, 42, 0, PI + HALF_PI); // restart symbol arc
    noStroke();
    fill(12);
    triangle(x, y + 224, x, y + 204, x + 21, y + 214); // restart symbol arrow
    textAlign(CENTER, CENTER);
    textSize(12);
    text("Play again", x, y + 270); // button instructions label
    pop();
  }

  render() {
    let textScore = this.getTextScore(this.score);
    let textHighScore = this.getTextScore(this.highScore);
    push();
    textAlign(RIGHT);
    textSize(10);
    fill(12);
    text("High Score", this.position.x, this.position.y);
    textSize(16);
    text("Blocks Dodged", this.position.x, this.position.y + 48);
    fill(255);
    text(textHighScore, this.position.x, this.position.y + 16);
    textSize(32);
    text(textScore, this.position.x, this.position.y + 76);
    pop();
  }
}

class Box {
  constructor(x, y, w) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = w * 0.25;

    this.box = Bodies.rectangle(this.position.x, this.position.y, this.width, this.height);
    this.vertices = this.box.vertices;
    World.add(engine.world, [this.box]);
  }

  isOffscreen() {
    return (this.box.position.y > height + this.width);
  }

  render() {
    let vertices = this.vertices;
    fill(255);
    noStroke();

    beginShape();
    for (let v of vertices) {
      vertex(v.x, v.y);
    }
    endShape();
  }
}

class Paddle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.width = width * 0.1;
    this.height = this.width * 0.25;
    this.moveDirection = 0;
    this.speed = this.width * 0.25;

    this.box = Bodies.rectangle(this.position.x, this.position.y, this.width, this.height, {
      isStatic: true
    });
    World.add(engine.world, [this.box]);
  }

  switchMoveDirection(type) {
    switch (type) {
      case 'left':
        this.moveDirection = -1;
        break
      case 'right':
        this.moveDirection = 1;
        break
      default:
        this.moveDirection = 0;
    }
  }

  move() {
    const direction = this.moveDirection;
    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x > width) {
      this.position.x = width;
    } else {
      this.position.x += this.speed * direction;
    }
    const { x, y } = this.position;
    Body.setPosition(this.box, { x, y });
  }

  resetPaddle() {
    this.position.x = width * 0.5;
    const { x, y } = this.position;
    Body.setPosition(this.box, { x, y });

    this.speed = this.width * 0.25;

    World.add(engine.world, [this.box]);
  }

  render() {
    let vertices = this.box.vertices;
    fill(255);
    noStroke();

    beginShape();
    for (let v of vertices) {
      vertex(v.x, v.y);
    }
    endShape();
  }
}

function spawnBoxesAfterSetInterval() {
  let currentDate = new Date();
  let currentTime = currentDate.getTime();
  if (currentTime > time + (secondsBetweenBlockSpawns * 1000)) {
    time = currentTime;
    addFallingBoxes();
  }
}

function addFallingBoxes() {
  const numberOfBoxes = 5;
  const colWidth = width / numberOfBoxes;
  const y = -height / numberOfBoxes;
  const randomColNotAdded = Math.floor(Math.random() * numberOfBoxes);
  for (let i = 0; i < numberOfBoxes; i++) {
    if (i !== randomColNotAdded) {
      let x = (colWidth * 0.5) + (i * colWidth);
      let boxWidth = colWidth * 0.75;
      let box = new Box(x, y, boxWidth);
      boxes.push(box);
    }
  }
}

Events.on(engine, 'collisionStart', function(event) {
  if (!isGameOver) {
    isGameOver = true;
    const { x, y } = paddle.position;
    explosions.push(new Explosion(x, y));
    World.remove(engine.world, paddle.box);
  }
});

function resetTime() {
  date = new Date();
  time = date.getTime();
}

function resetGame() {
  removeBoxes();
  paddle.resetPaddle();
  resetTime();
  scoreKeeper.resetScore()
  isGameOver = false;
}

function removeBoxes() {
  for (let i = boxes.length - 1; i >= 0; i--) {
    let b = boxes[i];
    World.remove(engine.world, b);
    boxes.splice(i, 1);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === 65) { // 65 is the 'a' key
    paddle.switchMoveDirection('left');
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) { // 68 is the 'd' key
    paddle.switchMoveDirection('right');
  }
  return false;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    paddle.switchMoveDirection('none');
  } else if (keyCode === 65 || keyCode === 68) {
    paddle.switchMoveDirection('none');
  }
  return false;
}

function mouseClicked() {
  if (isGameOver) {
    resetGame();
  }
  return false; // prevent default
}

class Explosion {
  constructor(x, y) {
    this.explosion = new Particle(x, y);
    this.particles = [];
    this.numberOfParticles = 100;

    this.explode();
  }

  done() {
    if (this.particles.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();

      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      const p = new Particle(this.explosion.position.x, this.explosion.position.y);
      this.particles.push(p);
    }
  }

  show() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.lifespan = 255; // particles fade away after a certain amount of time
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(height * 0.012, height * 0.036));
    this.maxSize = height * 0.01;
  }

  update() {
    this.velocity.mult(0.90);
    this.lifespan -= 8;
    this.position.add(this.velocity);
  }

  done() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    let alpha = (this.lifespan > 175) ? 255 : this.lifespan;
    let size = map(this.lifespan, 0, 255, 0, this.maxSize);
    push();

    strokeWeight(size);
    stroke(255, alpha);
    point(this.position.x, this.position.y);

    pop();
  }
}