export default class Input {
  constructor(game) {
    this.keys = [];
    this.game = game;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      else if (e.key === 'ArrowUp' && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      else if (e.key === 'ArrowLeft' && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      else if (e.key === 'ArrowRight' && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      else if (e.key === 'Enter' && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      else if (e.key === 'd') {
        this.game.debug = !this.game.debug;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowDown') {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
      else if (e.key === 'ArrowUp') {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
      else if (e.key === 'ArrowLeft') {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
      else if (e.key === 'ArrowRight') {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
      else if (e.key === 'Enter') {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}