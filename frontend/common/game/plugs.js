import GameObject from '../config/gameObject';

export const Plugs = new GameObject({
	preload(){
    this.plugs = {};
    this.plugs.types = [];
    this.load.crossOrigin = 'anonymous';

    for(let i = 0; i < window.Config.enimes.length; i++){
        this.plugs.types[i] = {};
        this.plugs.types[i].force = window.Config.enimes[i].force;
        this.plugs.types[i].hunger = window.Config.enimes[i].hunger;
        this.plugs.types[i].size = window.Config.enimes[i].size;
        this.load.image("plugs"+i, window.Config.enimes[i].skin);
    }

    this.plugs.content = [];
  },  
  update(){
    if(window.Config.state == 'game'){
      if(
        this.music.on && 
        this.music.background != undefined && 
        this.music.background.isPlaying == false
      ) this.music.background.play();
      for(let i = 0; i < this.plugs.content.length; i++){
        this.plugs.content[i].body.angle = window.Phaser.Math.Angle.BetweenPoints(
          {x:this.plugs.content[i].x, y: this.plugs.content[i].y}, 
          {x: window.innerWidth/2, y: window.innerHeight/2}
        );
      }
    }
    if(window.Config.state == 'die'){
      if( this.music.background != undefined ) this.music.background.stop();
      let countPlugs = 0;
      for(let i = 0; i < this.plugs.content.length; i++){
        if(!this.plugs.content[i].isStatic()){
          if(
            (this.plugs.content[i].x < 0 || this.plugs.content[i].x > window.innerWidth) &&
            (this.plugs.content[i].y < 0 || this.plugs.content[i].y > window.innerHeight)
          ) this.plugs.content[i].setStatic(true);
          else this.endPlugs();
        }
        else countPlugs++;
      }
    }
  },
  startPlugs(){
    this.removePlugs();
    this.ui.score.text = '0';
    this.tomada.content.config.actual = this.tomada.content.config.life;

    if(window.Config.state == 'game'){
      for(let i = 0; i < 2; i++){
        this.addPlugs(true);
      }
      this.addPlugs();
    }    
  },
  endPlugs(){
    for(let i = 0; i < this.plugs.content.length; i++){
      if(!this.plugs.content[i].isStatic()){
        if(this.plugs.content[i].x > window.innerWidth/2) this.plugs.content[i].setVelocityX(200);
        else this.plugs.content[i].setVelocityX(-200);

        
        if(this.plugs.content[i].y > window.innerHeight/2) this.plugs.content[i].setVelocityY(200);
        else this.plugs.content[i].setVelocityY(-200);
      }
    }

    window.Config.state = 'die'
  },
  addPlugs(t, mass, id){    
    if(window.Config.state == 'lose') return;
    
    let x = (Math.random() > 0.5 ? window.innerWidth+100 : (window.innerWidth+100) * -1);
    let y = (Math.random() > 0.5 ? window.innerHeight+100 : (window.innerHeight+100) * -1);
    let e = (Math.random() * (this.plugs.types.length-1)).toFixed(0);
    let i = this.plugs.content.length;

    if(e >= this.plugs.types.length) e = this.plugs.types.length-1;
    if(e < 0) e = 0;
    if(id != undefined ) e = id;

    this.plugs.content[i] = this.matter.add.image(x, y, 'plugs'+e);
    this.plugs.content[i].config = this.plugs.types[e];
    this.plugs.content[i].setMass(this.plugs.content[i].body.mass / (mass == undefined ? this.plugs.types[e].force : mass));

    this.resizeRealSize(this.plugs.content[i]);
    if(t == undefined && window.Config.state == 'game') setTimeout(() => this.addPlugs(), Math.random() * window.Config.enimesRespaw);
  },
  resizeRealSize(target){
    if(target.displayHeight > target.displayWidth){
      target.displayHeight = (target.displayHeight/target.displayHeight) * (window.Grid.value * target.config.size);
      target.displayWidth = window.Grid.value * target.config.size;
    }
    else{
      target.displayWidth = (target.displayHeight/target.displayHeight) * (window.Grid.value * target.config.size);
      target.displayHeight = window.Grid.value * target.config.size;
    }
  },
  removePlugs(){
    for(let i = 0; i < this.plugs.content.length; i++){
      this.plugs.content[i].destroy();
    }

    this.plugs.content = [];
  },
})