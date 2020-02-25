import Phaser from 'phaser';
import GameObject from '../config/gameObject';

export const Tomada = new GameObject({
	preload(){
    this.load.image("tomada", window.Config.tomada.skin);
	},  
  create(){
		this.tomada = {};
		this.tomada.content = this.matter.add.image(window.innerWidth/2, window.innerHeight * 1.5, "tomada", null, {
			plugin: {
        attractors: [ 
          (bodyA, bodyB) => { 
            if(!bodyA.isSensor && !bodyB.isSensor){
              return { x: (bodyA.position.x - bodyB.position.x) * 1e-6, y: (bodyA.position.y - bodyB.position.y) * 1e-6};
            }
          }
        ]
			}
    });
    
    if(this.tomada.content.displayWidth > this.tomada.content.displayHeight){
        this.tomada.content.displayHeight = (this.tomada.content.displayHeight/this.tomada.content.displayWidth) * (window.Grid.value * window.Config.tomada.size);
        this.tomada.content.displayWidth = window.Grid.value * window.Config.tomada.size;
    }
    else{
        this.tomada.content.displayWidth = (this.tomada.content.displayWidth/this.tomada.content.displayHeight) * (window.Grid.value * window.Config.tomada.size);
        this.tomada.content.displayHeight = window.Grid.value * window.Config.tomada.size;
    }
    
    this.tomada.content.setStatic(true);
    this.tomada.content.config = {life: window.Config.tomada.life, actual: window.Config.tomada.life, onCollider: false};
  },
  update(){
    this.cameras.main.rotation = this.tomada.content.rotation * -1;
    if(window.Config.state == 'home') this.tomada.content.y = window.innerHeight * 1.5;
    if(window.Config.state == 'tutorial'){
      if(this.tomada.content.y > window.innerHeight/2) this.tomada.content.y -= 30;
      if(this.tomada.content.y < window.innerHeight/2) this.tomada.content.y += 30;
    }
    
    this.resizeRatio(this.tomada.content);
    if(window.Config.state == "game" && window.Config.state == 'die') this.tomada.content.y = window.innerHeight/ 2;
    this.tomada.content.x = window.innerWidth/2;
  },
  resizeRatio(target){
    if(target.displayHeight >= target.displayWidth){
      target.displayWidth = (target.displayWidth/target.displayHeight) * (window.Grid.value * window.Config.tomada.size);
      target.displayHeight = window.Grid.value * window.Config.tomada.size;
    }
    if(target.displayHeight < target.displayWidth){
      target.displayHeight = (target.displayHeight/target.displayWidth) * (window.Grid.value * window.Config.tomada.size);
      target.displayWidth = window.Grid.value * window.Config.tomada.size;
    }
  }
})