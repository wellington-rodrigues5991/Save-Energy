import GameObject from '../config/gameObject';

export const Platform = new GameObject({
    preload(){
        this.load.image('platform', window.Data.platform );
        if(window.Data.platformForeGround != '') this.load.image('platformForeground', window.Data.platformForeGround );        
        if(window.Data.platformBackGround != '') this.load.image('platformBackground', window.Data.platformBackGround );

        this.load.audio('bacKgroundSound', window.Data.backgroundSound, {instances: 1, volume: 0.1});
        this.load.audio('dieSound', window.Data.dieSound, {instances: 1});
    },    
    create(){
        this.sound.add('bacKgroundSound');
        this.sound.add('dieSound');
        if(this.load.textureManager.list.platformBackground != undefined){
            this.platformBackground = this.add.sprite(window.innerWidth * .5, window.innerHeight, 'platformBackground');
            this.resisePlatformBackground();
        }

        this.platform = this.matter.add.sprite(window.innerWidth * .5, window.innerHeight, 'platform');
        this.resisePlatform();

        if(this.load.textureManager.list.platformForeground != undefined){
            this.platformForeground = this.add.sprite(window.innerWidth * .5, window.innerHeight, 'platformForeground');
            this.resisePlatformForeground();
        }

        this.left = {active: false, value: 0};
        this.config = {play: false, die: true}
        this.right = {active: false, value: 0};
        this.input.keyboard.on('keydown-Q', () => { this.left.active = true });
        this.input.keyboard.on('keydown-E', () => { this.right.active = true});
        this.input.keyboard.on('keyup-Q', () => { this.left.active = false});
        this.input.keyboard.on('keyup-E', () => { this.right.active = false});
        this.input.on('pointerdown', (pointer) => {            
            if(window.Data.play == true){
                if(pointer.x > window.innerWidth/2) this.right.active = true;
                else this.left.active = true;
            }
         });
         this.input.on('pointerup', (pointer) => {
             if(window.Data.play == true){
                 if(pointer.x > window.innerWidth/2) this.right.active = false;
                else this.left.active = false;
             }else{
                 if(window.Data.go == true){
                     console.log('tttt')
                    window.Data.play = true
                    window.Data.go = false;
                 }
             }
          });


        this.platform.body.allowGravity = false;
        this.platform.body.ignoreGravity = true;
        this.platform.body.isStatic = true;
        //this.platform.body.friction = 0;
        //this.platform.body.frictionStatic = 0.1;

        window.addEventListener('resize', function(){
            this.resisePlatform();
            this.resisePlatformForeground();
        }.bind(this))
    },
    update(){
        this.platform.rotation = (((this.left.value * -1) + this.right.value) * 0.5);

        if(this.left.active && this.left.value < 1) this.left.value += 0.02 * window.Data.rotationSpeed;
        if(this.right.active && this.right.value < 1) this.right.value += 0.02 * window.Data.rotationSpeed;

        if(!this.left.active && this.left.value > 0) this.left.value -= 0.05 * window.Data.rotationSlowDown;
        if(!this.right.active && this.right.value > 0) this.right.value -= 0.05 * window.Data.rotationSlowDown;

        if(window.Data.play === false){
            this.left.active = false;
            this.right.active = false;
            if(this.config.die){
              this.sound.play('dieSound');
              this.config.play = true;
              this.config.die = false
            }
        }
        if(window.Data.play == true && !this.config.play){
            this.sound.play('bacKgroundSound');
            this.config.play = true;
            this.config.die = true
        }        
        if(this.platform.rotation > -.02 && this.platform.rotation < 0.02){this.platform.rotation = 0;}
        if(this.player.y > window.innerHeight){
            this.platform.rotation = 0;
            this.left = {active: false, value: 0};
            this.right = {active: false, value: 0};
        }
    },
    resisePlatform(){
        const oldSizePlatform = {x: this.platform.displayWidth, y: this.platform.displayHeight};

        this.platform.displayWidth = window.innerWidth * .7;
        this.platform.displayHeight = (window.innerWidth * (oldSizePlatform.y/oldSizePlatform.x)) * .7; 
        this.platform.x = window.innerWidth * .5;
        this.platform.y = this.platform.displayHeight/2 + window.innerHeight * .7;
    },
    resisePlatformForeground(){
        const oldSizePlatform = {x: this.platformForeground.displayWidth, y: this.platformForeground.displayHeight};

        if(window.innerHeight < window.innerWidth){
            this.platformForeground.displayHeight = window.innerHeight * .7;
            this.platformForeground.displayWidth = (window.innerHeight * (oldSizePlatform.x/oldSizePlatform.y)) * .7; 
        }else{
            this.platformForeground.displayHeight = window.innerWidth * .7;
            this.platformForeground.displayWidth = (window.innerWidth * (oldSizePlatform.x/oldSizePlatform.y)) * .7; 
        }
        this.platformForeground.x = window.innerWidth * .5;
        this.platformForeground.y = this.platformForeground.displayHeight/2 + window.innerHeight * .7;
    },
    resisePlatformBackground(){
        const oldSizePlatform = {x: this.platformBackground.displayWidth, y: this.platformBackground.displayHeight};

        if(window.innerHeight < window.innerWidth){
            this.resisePlatformBackground.displayHeight = window.innerHeight * .7;
            this.platformBackground.displayWidth = (window.innerHeight * (oldSizePlatform.x/oldSizePlatform.y)) * .7; 
        }else{
            this.platformBackground.displayHeight = window.innerWidth * .7;
            this.platformBackground.displayWidth = (window.innerWidth * (oldSizePlatform.x/oldSizePlatform.y)) * .7; 
        }
        this.platformBackground.x = window.innerWidth * .5;
        this.platformBackground.y = this.platformBackground.displayHeight/2 + window.innerHeight * .7;
    }
})