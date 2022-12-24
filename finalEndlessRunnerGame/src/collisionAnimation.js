export default class CollisionAnimation {
  constructor(game, x, y) {
    this.game = game;
    this.image = document.getElementById('collision');
    this.spriteWidth = 100;
    this.spriteHeight = 90;
    this.sizeModifier = Math.random() * 1.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x - this.width * .5;
    this.y = y - this.height * .5;
    this.frameX = 0;
    this.maxFrame = 4;
    this.markedForDeletion = false;

    this.fps = Math.random() * 1 + 8;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  draw(context) {
    context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
  update(deltatime) {
    this.x -= this.game.speed;
    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;
    }
    else {
      this.frameTimer += deltatime;
    }



    if (this.frameX > this.maxFrame) {
      this.markedForDeletion = true;
    }

  }
}