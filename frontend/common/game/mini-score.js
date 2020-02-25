import GameObject from '../config/gameObject';
import Phaser from 'phaser';

export const MiniScore = new GameObject({ 
  create(){
      this.miniscore = [];

      this.matter.world.on('collisionactive', event => {
        let pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++){
          let bodyA = pairs[i].bodyA;
                let bodyB = pairs[i].bodyB;
                
          if(!bodyA.isSensor && !bodyB.isSensor){
            let target = null;

            if(bodyA.id == this.tomada.content.body.id) target = bodyB.gameObject;
            if(bodyB.id == this.tomada.content.body.id) target = bodyA.gameObject;
            if(target != null){
              this.tomada.content.config.onCollider = true;
              this.addMiniScore(target.x, target.y, target.config.hunger.toFixed(0), target.id, '-');
            }
          }
        }
      });

      this.matter.world.on('collisionend', event => {
        let pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++){
          let bodyA = pairs[i].bodyA;
                let bodyB = pairs[i].bodyB;
                
          if(!bodyA.isSensor && !bodyB.isSensor){
            let target = null;

            if(bodyA.id == this.tomada.content.body.id) target = bodyB.gameObject;
            if(bodyB.id == this.tomada.content.body.id) target = bodyA.gameObject;
            if(target != null) this.tomada.content.config.onCollider = false;
          }
        }
      });
  },
  update(){
    const size = this.miniscore.length;
    for(let i = 0; i < size; i++){
      if(this.miniscore[i] != undefined){
        let speed = this.miniscore[i].displayHeight * 0.7;
        let alpha = 0.1;

        if(this.miniscore[i].config.type == '+') {speed = 2; alpha = 0.01}
        this.miniscore[i].y -= speed;
        this.miniscore[i].alpha -= alpha;

        if(this.miniscore[i].alpha <= 0.5 && this.miniscore[i].config != true){
          this.ui.old = this.ui.score.text;
          this.miniscore[i].destroy();
          this.miniscore[i].config = true;
        }
      }
    }
  },
  addMiniScore(x, y, text, id, type){
    if(window.Config.state == 'lose') return;

    let i = this.miniscore.length;
    let color = window.Config.color.lose;

    if(type == '+') {
      text = text/10;
      color = window.Config.color.win;
      this.ui.score.text = parseInt(this.ui.score.text) + parseInt(text);
    }
    if(type == '-') {
      if(this.tomada.content.config.actual-parseInt(text) > 0) {
        this.tomada.content.config.actual -= parseInt(text);
        if(this.music.on && this.music.loseLife != undefined && this.music.loseLife.isPlaying == false) this.music.loseLife.play();
      }
      else{ 
        window.Config.state = 'lose';
        this.endPlugs();
      }
    }
    if(text < 0) text = text * -1;
    if(!this.cameras.main.shake.isRunning && type == '-') this.cameras.main.shake(20, 0.01)

    text = parseInt(text);

    this.miniscore[i] = this.add.text(0, 0, type+text, { fontFamily: window.Config.font.family, fontSize: 22, color: color});
    this.miniscore[i].x = x - (this.miniscore[i].displayWidth/2);
    this.miniscore[i].y = y - this.miniscore[i].displayHeight;
    this.miniscore[i].config = {id: id, type: type};
  }
})