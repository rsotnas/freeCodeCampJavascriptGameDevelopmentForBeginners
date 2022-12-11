const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();
console.log({ canvasPosition })
// ctx.fillStyle = 'white';
// ctx.fillRect(10, 20, 50, 50);

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * .7;
    this.height = this.spriteHeight * 0.7;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = 'imgs/boom.png';
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = 'sounds/Fire impact 1.wav';

  }

  update() {
    if (this.frame === 0) {
      this.sound.play();
    }
    this.timer++;
    if (this.timer % 10 === 0) {
      this.frame++;
    }

  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width * .5, 0 - this.height * .5, this.width, this.height);
    ctx.restore();
  }
}


function createAnimation(e) {
  let x = e.x - canvasPosition.left;
  let y = e.y - canvasPosition.top;
  explosions.push(new Explosion(x, y));
}


window.addEventListener('click', function (e) {
  createAnimation(e)
})


// window.addEventListener('mousemove', function (e) {
//   createAnimation(e)
// })


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}

animate();