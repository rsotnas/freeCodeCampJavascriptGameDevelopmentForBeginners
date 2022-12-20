export default class InputHandler {

  constructor() {
    this.lastKey = '';

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.lastKey = "PRESS left";
          break;
        case 'ArrowUp':
          this.lastKey = "PRESS up";
          break;
        case 'ArrowDown':
          this.lastKey = "PRESS down";
          break;
        case 'ArrowRight':
          this.lastKey = "PRESS right";
          break;
      }
    })

    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.lastKey = "RELEASE left";
          break;
        case 'ArrowUp':
          this.lastKey = "RELEASE up";
          break;
        case 'ArrowDown':
          this.lastKey = "RELEASE down";
          break;
        case 'ArrowRight':
          this.lastKey = "RELEASE right";
          break;
      }
    })
  }
}