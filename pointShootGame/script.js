const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;


let ravens = [];
class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + .4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = 'imgs/raven.png';
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    this.color = `rgb(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]})`;
  }
  update(deltatime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY *= -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
    if (this.x < 0 - this.width) gameOver = true;


  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

const raven = new Raven();
let explosions = [];

class Explosions {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = 'imgs/boom.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = 'sounds/Fire impact 1.wav';
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeletion = false;
  }
  update(deltatime) {
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltatime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeletion = true;
    }
  }
  draw() {
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size);
  }
}

function drawScore() {
  ctx.textAlign = 'center';
  ctx.font = '50px Impact';
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 100, 50);
  // ctx.fillStyle = 'white';
  // ctx.fillText('Score: ' + score, 10, 50)
}

function drawGameOver() {
  ctx.fillStyle = 'black';
  ctx.fillText(`GAME OVER, your score is ${score}`, canvas.width / 2, canvas.height / 2)
}

window.addEventListener('click', function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  // console.log({ detectPixelColor });
  const pc = detectPixelColor.data;
  ravens.forEach(raven => {
    if (raven.randomColors[0] === pc[0] && raven.randomColors[1] === pc[1] && raven.randomColors[2] === pc[2]) {

      raven.markedForDeletion = true;
      score++;
      explosions.push(new Explosions(raven.x, raven.y, raven.width));
    }
  })
});


(function animate(timestamp = 0) {
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log('test')
  // raven.draw();
  // raven.update();
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => a.width - b.width);
  };
  // console.log(ravens)
  drawScore();
  [...ravens, ...explosions].forEach(raven => raven.update(deltatime));
  [...ravens, ...explosions].forEach(raven => raven.draw());
  ravens = ravens.filter(raven => !raven.markedForDeletion);
  explosions = explosions.filter(explosion => !explosion.markedForDeletion);
  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
})()