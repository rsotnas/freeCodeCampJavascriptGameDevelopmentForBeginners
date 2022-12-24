import { Sitting, Running, Jumping, Falling, Rolling, Diving, HIT } from "./playerStates.js";
import CollisionAnimation from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessage.js";


export default class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById('player');
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 1;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 5;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [
      new Sitting(this.game)
      , new Running(this.game)
      , new Jumping(this.game)
      , new Falling(this.game)
      , new Rolling(this.game)
      , new Diving(this.game)
      , new HIT(this.game)
    ];


  }
  update(input, deltatime) {
    // this.x++;
    this.checkCollision();
    this.currentState.handleInput(input);
    this.x += this.speed;

    if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
    else this.speed = 0;




    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;



    this.y += this.vy;
    if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;


    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    // sprite animation
    // console.log(this.frameTimer)
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    }
    else {
      this.frameTimer += deltatime;
    }


  }
  draw(context) {
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollision() {
    this.game.enemies.forEach(enemy => {
      if (
        enemy.x < this.x + this.width
        && enemy.x + enemy.width > this.x
        && enemy.y < this.y + this.height
        && enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true;
        this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2))
        if (
          this.currentState === this.states[4]
          || this.currentState === this.states[5]
        ) {
          this.game.score++;
          this.game.floatingMessages.push(new FloatingMessage(
            '+1'
            , enemy.x
            , enemy.y
            , 150
            , 50
          ));
        }
        else {
          // this.game.score--;

          this.setState(6, 0)
          this.game.lives--;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    })
  }
}