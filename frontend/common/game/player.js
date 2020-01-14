import GameObject from '../config/gameObject';

export const Player = new GameObject({
    preload(){
        this.load.image('player', window.Data.player);
    },    
    create(){
        this.player = this.matter.add.sprite(window.innerHeight * .5, window.innerHeight * -1, 'player');
        this.resizePlayer();

        window.addEventListener('resize', function(){this.resizePlayer()}.bind(this))
        this.player.config = {
            lifes: {max: window.Data.lifes, actual: window.Data.lifes},
            invensible: false,
            start: {x: this.player.x, y: this.player.y},
            time: window.Data.invincibilityTime
        };
    },
    update(){
        this.player.body.speed = 0;
        if(
            this.player.y > window.innerHeight*2 ||
            this.player.config.lifes.actual <= 0
        ){
            if(window.Data.play == true) window.Data.play = false;
            this.player.rotation = 0;
            this.matter.body.setStatic(this.player.body, true);
            this.matter.body.setPosition(this.player.body, {x: this.player.config.start.x, y: window.innerHeight * -1});
            setTimeout(() => {
                this.matter.body.setStatic(this.player.body, false)
            }, 200);
            this.player.config.lifes.actual = this.player.config.lifes.max;
        }
    },
    setInvensible(){     
        this.player.config.invensible = true;   
        this.player.alpha = 0.2;

        setTimeout(() => this.player.alpha = 1, this.player.config.time/9);
        setTimeout(() => this.player.alpha = 0.2, this.player.config.time/8);
        setTimeout(() => this.player.alpha = 1, this.player.config.time/7);
        setTimeout(() => this.player.alpha = 0.2, this.player.config.time/6);
        setTimeout(() => this.player.alpha = 1, this.player.config.time/5);
        setTimeout(() => this.player.alpha = 0.2, this.player.config.time/4);
        setTimeout(() => this.player.alpha = 1, this.player.config.time/3);
        setTimeout(() => this.player.alpha = 0.2, this.player.config.time/2);
        setTimeout(() => this.player.alpha = 1, this.player.config.time);
        setTimeout(() => this.player.config.invensible = false, this.player.config.time);
    },
    resizePlayer(){        
        const oldSizePlayer = {x: this.player.displayWidth, y: this.player.displayHeight};

        if(window.innerHeight > window.innerWidth){
            this.player.displayWidth = window.innerHeight * .1;
            this.player.displayHeight = (window.innerHeight * (oldSizePlayer.y/oldSizePlayer.x)) * .1;
        }else{
            
            this.player.displayWidth = window.innerWidth * .1;
            this.player.displayHeight = (window.innerWidth * (oldSizePlayer.y/oldSizePlayer.x)) * .1;
        }

        this.player.x = window.innerWidth * .5;
        this.player.y = (window.innerHeight * .7) - this.player.displayHeight;
    }
})