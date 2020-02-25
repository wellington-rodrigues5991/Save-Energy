import GameObject from '../config/gameObject';
import Phaser from 'phaser';

export const Player = new GameObject({
	preload(){
		this.load.image("player", "./player.png"); //iginorar
		this.load.image("spark", window.Config.player.skin);
        console.log(window.Config.player.skin, 23)

		var progressBox = this.add.graphics();
		var progressBar = this.add.graphics();
		progressBox.fillStyle(window.Config.color.secundary.replace('#', '0x'), 1);
		progressBox.fillRect((window.innerWidth/2) - 105, (window.innerHeight/2) - 10, 210, 20);

		this.load.on('progress', function (value) {
			progressBar.clear();
			progressBar.fillStyle(window.Config.color.text.replace('#', '0x'), 1);
			progressBar.fillRect((window.innerWidth/2) - 100, (window.innerHeight/2) - 5, 200 * value, 10);
		});
		 
		this.load.on('complete', function () {
			progressBar.destroy();
			progressBox.destroy();
		});
	},  
  create(){;
	
	this.player = {};
	this.player.content = this.matter.add.image(window.innerWidth/2, window.innerHeight/2, "player");
	this.player.content.displayWidth = window.Grid.value * window.Config.player.size;
	this.player.content.displayHeight = window.Grid.value * window.Config.player.size;

	this.player.data = {};
	this.player.data.on = true;
	this.player.data.force = 1;
	this.player.content.alpha = 0;
	this.player.data.step = 0.03;
	this.player.data.x = window.innerWidth/2;
	this.player.data.y = window.innerHeight/2;
	this.player.content.config = {force: 1, content: null};
	this.player.content.setSensor(true);
	
	this.matter.world.on('collisionstart', event => {
		let pairs = event.pairs;

		for (var i = 0; i < pairs.length; i++){
			let bodyA = pairs[i].bodyA;
			let bodyB = pairs[i].bodyB;
			
			if(bodyA.id == this.player.content.body.id) {
				bodyA = pairs[i].bodyB;
				bodyB = pairs[i].bodyA;
			}

			if(bodyB.isSensor){
				if(!bodyA.isSensor && bodyA.id != this.tomada.content.body.id && bodyB.isSensor){
					if(bodyB.gameObject.config.force > 0){
						let p = this.getPositionOnCenter(bodyA.position, bodyB.gameObject);	
						bodyA.gameObject.setVelocity(p.x * window.Config.player.force, p.y * window.Config.player.force)
						this.player.content.config.content = bodyA.velocity;

						const target = bodyA.gameObject;
						let score = (p.x < 0 ? p.x * -1 : p.x) + (p.y < 0 ? p.y * -1 : p.y);

						this.addMiniScore(target.x, target.y, score * window.Config.player.force, target.id, '+');
					}
				}
			}
		}
	});

	this.player.data.scale = this.player.content.scale;

	this.input.on('pointerup', pointer => {
        if(
            pointer.x <= this.music.skin.on.x+this.music.skin.on.displayWidth &&
            pointer.y <= this.music.skin.on.y+this.music.skin.on.displayHeight &&
            pointer.x > 20 && pointer.y > 20
        ) return;
        
        if(window.Config.state == 'tutorial'){
			if(this.tutorial[5] > -4) this.tutorial[5] -= 1;
		}
		if(window.Config.state == 'home') window.Config.state = 'tutorial';

		if(this.player.data.force <= 0){
			let x = pointer.event.clientX;
			let y = pointer.event.clientY;

			if(x == undefined) x = pointer.event.changedTouches[0].clientX;
			if(y == undefined) y = pointer.event.changedTouches[0].clientY;

			this.player.data.x = x;
			this.player.data.y = y;
			this.player.data.force = 1;	
			this.player.data.on = false;

            if(this.emitter == undefined){
                this.emitter = this.add.particles('spark').createEmitter({
                    x: window.innerWidth * 2,
                    y: 300,
                    blendMode: 'ADD',
                    scale: { start: 0.002, end: 0 },
                    speed: { min: 100, max: 200 },
                    quantity: 200,
                    radial: true,
                    angle: { min: 0, max: 360 },
                    rotate: { min: 0, max: 360 },
                    alpha: { min: 0.1, max: 0.6 },
                    tint: [window.Config.color.secundary.replace('#', '0x'), window.Config.color.primary.replace('#', '0x')]
                });
                this.emitter.explode();
            }

			this.emitter.setPosition(x, y);
            if(this.music.on && this.music.power != undefined) this.music.power.play();

			setTimeout(() => {
				this.emitter.setEmitZone(emitZones[0]);
				this.emitter.explode();
			}, 5);
			

			setTimeout(() => this.player.data.on = true, window.Config.player.timeout); 
		}
	}, this);

	window.addEventListener('resize', () => {
		emitZones[0] = {
			source: new window.Phaser.Geom.Circle(0, 0, window.Grid.value * (window.Config.player.size / 2)),
			type: 'edge',
			quantity: 50
		};

		this.player.content.displayWidth = window.Grid.value * window.Config.player.size;
		this.player.content.displayHeight = window.Grid.value * window.Config.player.size;
	})
    
	

    var emitZones = [];

    emitZones.push({
        source: new window.Phaser.Geom.Circle(0, 0, window.Grid.value * (window.Config.player.size/2)),
        type: 'edge',
        quantity: 50
	})
  },
  update(){
	if(this.player.data.force >= 0){
		let scale = this.player.data.scale * (1 - this.player.data.force);

		if(scale <= 0) scale = 0.0001;
		this.player.content.setScale(scale);
		this.player.content.setPosition(this.player.data.x, this.player.data.y);

		this.player.data.force -= this.player.data.step;
		this.player.content.config.force = this.player.data.force;
		
	}
  },
  getPositionOnCenter(pos, parent){
	  let p = {x: 0, y: 0};
	  let center = {x: parent.displayWidth/2, y: parent.displayHeight/2};

	  p.x = (pos.x-parent.x)/center.x;
	  p.y = (pos.y-parent.y)/center.y;

	  p.x = Math.min(Math.max(p.x, -1), 1);
	  p.y = Math.min(Math.max(p.y, -1), 1);

	  if(p.y > 0 && p.y < 1) p.y = 1 - p.y;
	  if(p.y < 0 && p.y > -1) p.y = -1 - p.y;

	  if(p.x > 0 && p.x < 1) p.x = 1 - p.x;
	  if(p.x < 0 && p.x > -1) p.x = -1 - p.x;

	  return p;
  }
})