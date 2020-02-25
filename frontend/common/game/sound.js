import GameObject from '../config/gameObject';

export const Sound = new GameObject({
    preload(){
        if(window.Config.sound.background != undefined) this.load.audio('background', window.Config.sound.background);
        if(window.Config.sound.power != undefined) this.load.audio('power', window.Config.sound.power);
        if(window.Config.sound.die != undefined) this.load.audio('die', window.Config.sound.die);
        if(window.Config.sound.loseLife != undefined) this.load.audio('loseLife', window.Config.sound.loseLife);
        if(window.Config.sound.skin.on != undefined) this.load.image('soundSkin-on', window.Config.sound.skin.on);
        if(window.Config.sound.skin.off != undefined) this.load.image('soundSkin-off', window.Config.sound.skin.off);
    },    
    create(){
        this.music = {};

        this.music.on = true;
        this.music.skin = {};

        if(window.Config.sound.background != undefined) this.music.background = this.sound.add('background');
        if(window.Config.sound.power != undefined) this.music.power = this.sound.add('power');
        if(window.Config.sound.die != undefined) this.music.die = this.sound.add('die');
        if(window.Config.sound.loseLife != undefined) this.music.loseLife = this.sound.add('loseLife');
        if(window.Config.sound.skin.on != undefined) {
            this.music.skin.on = this.add.image(0, 0, 'soundSkin-on');
        	this.music.skin.on.setOrigin(0, 0);
        	this.music.skin.on.setInteractive();
            this.music.skin.on.on('pointerup', () => this.music.on = false);
        }
        if(window.Config.sound.skin.off != undefined){
            this.music.skin.off = this.add.image(0, 0, 'soundSkin-off');
        	this.music.skin.off.setOrigin(0, 0);
        	this.music.skin.off.setInteractive();
            this.music.skin.off.on('pointerup', () => this.music.on = true);
        }
    },
    update(){
        if(this.music.skin.on != undefined && this.music.skin.off != undefined){
            let on = this.music.skin.on;         
            let off = this.music.skin.off;     

            on.displayWidth = (on.displayWidth / on.displayHeight) * window.Grid.value * 1;
            on.displayHeight = window.Grid.value * 1;
            on.x = window.innerWidth - on.displayWidth - 20;
            on.y = 20;
            on.depth = 5002;
			on.alpha = (!this.music.on ? 0 : 1);
                   
            off.displayWidth = (off.displayWidth / off.displayHeight) * window.Grid.value * 1;
            off.displayHeight = window.Grid.value * 1;
            off.x = window.innerWidth - off.displayWidth - 20;
            off.y = 20;
            off.depth = 5002;
			off.alpha = (this.music.on ? 0 : 1);
        }
    }
})