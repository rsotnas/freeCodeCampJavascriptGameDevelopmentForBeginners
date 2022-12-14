window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;


  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'ArrowLeft', 'ArrowUp', 'ArrowRight'].includes(e.key) && this.keys.indexOf(e.key) === -1) {
          this.keys.push(e.key);
        }
        // console.log(this.keys);
      });
      window.addEventListener('keyup', (e) => {
        if (['ArrowDown', 'ArrowLeft', 'ArrowUp', 'ArrowRight'].includes(e.key)) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
        // console.log(this.keys);
      })
    }

  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameHeight = gameHeight;
      this.gameWidth = gameWidth;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
      this.maxFrame = 8;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
    }

    draw(context) {
      // context.beginPath();
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(input, deltatime, enemies) {
      // collision detection'
      enemies.forEach(enemy => {
        const dx = (enemy.x + enemy.width / 2) - (this.x + this.width / 2);
        const dy = (enemy.y + enemy.height / 2) - (this.y + enemy.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width / 2 + this.width / 2) {
          gameOver = true;
        }
      })

      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) {
          this.frameX = 0;
        }
        else {
          this.frameX++;
        }
      }
      else {
        this.frameTimer += deltatime;
      }


      // controls
      if (input.keys.indexOf('ArrowRight') > -1) {
        this.speed = 5;
      }
      else if (input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      }
      else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
        this.vy -= 32;
      }
      else {
        this.speed = 0;
      }

      // horizontal movement
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

      // vertical movemnt
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      }
      else {
        this.maxFrame = 8;
        this.vy = 0;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;

    }

    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameHeight = gameHeight;
      this.gameWidth = gameWidth;
      this.image = document.getElementById('backgroundImage');
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 20;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.x = 0;
      }
    }

  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById('enemyImage');
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.speed = 8;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.markedForDeletion = false;
    }

    draw(context) {
      // context.beginPath();
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();
      context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(deltatime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      }
      else {
        this.frameTimer += deltatime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score++;
      }

    }
  };


  function handleEnemies(deltatime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    }
    else {
      enemyTimer += deltatime;
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltatime);
    });
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
  };

  function displayStatusText(context) {
    context.font = '40px Helvetica';
    context.fillStyle = 'black';
    context.fillText(`Score: ${score}`, 20, 50);
    context.fillStyle = 'white';
    context.fillText(`Score: ${score}`, 22, 52);
    if (gameOver) {
      context.texAlign = 'center';
      context.fillStyle = 'black';
      context.fillText('GAME OVER, try again...', (canvas.width - 400) / 2, 150);
      context.fillStyle = 'white';
      context.fillText('GAME OVER, try again...', (canvas.width - 400) / 2 + 2, 152);
    }
  };

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  (function animate(timestamp = 0) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    // background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  })();
})
