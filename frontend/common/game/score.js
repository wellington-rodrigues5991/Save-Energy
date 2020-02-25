import GameObject from '../config/gameObject';
import Phaser from 'phaser';

export const Score = new GameObject({ 
  create(){
      this.ui = {};
      this.ui.score = this.add.text(0, 0, '0', { fontFamily: window.Config.font.family, fontSize: 112, color: window.Config.color.text});
      this.ui.score.y = -window.innerHeight;
      this.ui.life = this.add.graphics();
      this.ui.old = 0;
  },
  update(){
      if(this.ui.score.displayWidth > window.innerWidth * 0.9){
          this.ui.score.displayHeight = (this.ui.score.displayHeight/this.ui.score.displayWidth) * (window.innerWidth * 0.8);
          this.ui.score.displayWidth =  window.innerWidth * 0.9;
      }

      this.ui.score.x = (window.innerWidth - this.ui.score.displayWidth)/2;
      if(window.innerHeight < 600) this.ui.score.x = window.innerWidth - this.ui.score.displayWidth - 20;

      if(window.Config.state == 'game'){
        if(this.ui.score.y < 40) this.ui.score.y += 15;
        if(this.ui.score.y > 40) this.ui.score.y = 40;

        const life = this.tomada.content.config.actual/this.tomada.content.config.life;

        if(this.ui.old != this.ui.score.text) this.ui.score.setColor(window.Config.color.win);
        else this.ui.score.setColor(window.Config.color.text);
        
        this.ui.life.clear();
        if(!this.tomada.content.config.onCollider) this.ui.life.fillStyle(window.Config.color.text.replace('#', '0x'), 1);
        else this.ui.life.fillStyle(window.Config.color.lose.replace('#', '0x'), 1);

        this.ui.life.fillRect((window.innerWidth/2) - (100 * life), this.ui.score.y+this.ui.score.displayHeight+5, (200 * life), 10);

        
        if(window.innerHeight < 600) {
          this.ui.life.clear();          
          if(!this.tomada.content.config.onCollider) this.ui.life.fillStyle(window.Config.color.text.replace('#', '0x'), 1);
          else this.ui.life.fillStyle(window.Config.color.lose.replace('#', '0x'), 1);

          this.ui.life.fillRect(window.innerWidth - (200 * life) - 20, this.ui.score.y+this.ui.score.displayHeight+5, (200 * life), 10);
        }
        
        this.ui.score.depth = 5000;
        this.ui.life.depth = 5000;
      }

      if(window.Config.state != 'game' && window.Config.state != 'die'){
        this.ui.score.text = '0';
        this.tomada.content.config.actual = this.tomada.content.config.life;
      }
  }
})