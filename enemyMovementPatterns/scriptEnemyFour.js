/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 1;
const enemiesArray = [];
let gameFrame = 0;


class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = 'imgs/enemy4.png';
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 213;
    this.spriteHeight = 213;
    this.width = this.spriteWidth / 1;
    this.height = this.spriteHeight / 1;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 6 + 0);
  }
  update() {
    this.x = canvas.width / 3.4;
    this.y = canvas.height / 2.5;
    // this.x += Math.random() * 5 - 2.5;
    // this.y += Math.random() * 5 - 2.5;
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? this.frame = 0 : this.frame++;
    }
  }
  draw() {
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

// const enemy1 = new Enemy();
for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(new Enemy())
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemiesArray.forEach(enemy => {
    enemy.update();
    enemy.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}
animate()