import Player from './src/player.js';
import Input from './src/input.js';
import Background from './src/background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './src/enemies.js';
import { UI } from './src/UI.js';

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;


  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.lives = 5;
      this.groundMargin = 40;
      this.speed = 0;
      this.maxSpeed = 6;
      this.debug = false;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new Input(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];

      this.UI = new UI(this);
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.score = 0;
      this.fontColor = 'black';
      this.maxParticles = 50;
      this.time = 0;
      this.maxTime = 10000;
      this.gameOver = false;

      this.floatingMessages = [];
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltatime) {
      this.time += deltatime;
      if (this.time > this.maxTime) this.gameOver = true;
      this.background.update();
      this.player.update(this.input.keys, deltatime);
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      }
      else {
        this.enemyTimer += deltatime;
      }
      this.enemies.forEach(enemy => {
        enemy.update(deltatime);
        if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
      })

      this.floatingMessages.forEach((msg, index) => {
        msg.update();
        if (msg.markedForDeletion) this.floatingMessages.splice(index, 1);
      })
      // console.log({ e: this.enemies })
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(index, 1);
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      this.collisions.forEach((collision, index) => {
        collision.update(deltatime)
        if (collision.markedForDeletion) this.collisions.splice(index, 1);
      })
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach(enemy => {
        enemy.draw(context)
      })
      this.UI.draw(context);
      this.particles.forEach(particle => {
        particle.draw(context);
      })
      this.collisions.forEach(collision => {
        collision.draw(context);
      })
      this.floatingMessages.forEach((msg, index) => {
        msg.draw(context);
      })
    }


    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      }
      else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingEnemy(this));

      // console.log(this.enemies);
    }
  };



  const game = new Game(canvas.width, canvas.height);


  let lasttime = 0;
  function animate(timestamp = 0) {
    // console.log(lasttime)
    const deltatime = timestamp - lasttime;
    lasttime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltatime);
    game.draw(ctx)
    if (!game.gameOver) requestAnimationFrame(animate);
  }

  animate()

});