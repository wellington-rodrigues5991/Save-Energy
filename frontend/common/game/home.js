import GameObject from '../config/gameObject';

export const Home = new GameObject({
	preload(){
		this.load.image("home", window.Config.logo.image);
		this.load.image("backgroundHome", window.Config.backgroundHome);
		this.load.image("backgroundGame", window.Config.backgroundGame);
	},  
    create(){
        this.home = {};
        
        this.backgroundGame = null;
        if(window.Config.backgroundGame != undefined) this.backgroundGame = this.add.image(window.innerWidth, 0, 'backgroundGame');

        if(window.Config.backgroundHome != undefined) this.home.background = this.add.image(0, 0, 'backgroundHome');
        if(window.Config.logo.image == undefined) this.home.logo = this.add.text(0, 0, window.Config.logo.text, { fontFamily: window.Config.font.family, color: window.Config.color.text });
        else {
            this.home.logo = this.add.image(0, 0, 'home');
            this.home.logo.setOrigin(0, 0)
        }

        this.home.button = this.add.text(0, 0, window.Config.startText, {fontFamily: window.Config.font.family, color: window.Config.color.text});
        this.home.button.setFontSize(18);

        this.home.count = window.innerWidth;

        console.log(window.Config.logo, '22222223333')
    },
    update(){
        if(window.Config.state == 'home'){
            if(this.home.count > 0) this.home.count -= 60;
            if(this.home.count < 0) this.home.count = 0;
            if(window.Config.logo.image == undefined) this.home.logo.setFontSize(window.innerWidth/4);

            this.home.logo.displayHeight = (this.home.logo.displayHeight/this.home.logo.displayWidth) * window.innerWidth * (window.innerWidth < 600 ? 0.6 : 0.3);
            this.home.logo.displayWidth = window.innerWidth * (window.innerWidth < 600 ? 0.6 : 0.3);
            
            this.home.button.x = (window.innerWidth - this.home.button.displayWidth) / 2 - this.home.count;
            this.home.button.y = window.innerHeight - this.home.button.displayHeight*2;
            
            this.home.logo.x = (window.innerWidth - this.home.logo.displayWidth) / 2 - this.home.count;
            this.home.logo.y = this.home.button.y - this.home.logo.displayHeight - 50;

            if(window.Config.backgroundHome != undefined){
                this.home.background.setOrigin(0, 0)
                
                this.home.background.displayWidth = (this.home.background.displayWidth/this.home.background.displayHeight) * window.innerHeight;
                this.home.background.displayHeight = window.innerHeight;            
                this.home.background.x = (window.innerWidth - this.home.background.displayWidth) / 2 - this.home.count;
                this.home.background.y = (window.innerHeight - this.home.background.displayHeight) / 2;
            }
        }
        if(window.Config.state == 'tutorial'){
            if(this.home.logo.x > -window.innerWidth * 3){
                this.home.button.x -= 30;
                this.home.logo.x -= 55;
                if(window.Config.backgroundHome != undefined) this.home.background.x -= 60;
            }
            else{
                this.home.button.destroy();
                this.home.logo.destroy();
                if(window.Config.backgroundHome != undefined) this.home.background.destroy();
            }

            if(this.backgroundGame != null){
                this.backgroundGame.setOrigin(0, 0);
                if(this.backgroundGame.x > 0) this.backgroundGame.x -= 65;
                else this.backgroundGame.x = (window.innerWidth - this.backgroundGame.displayWidth) / 2 - this.home.count;

                this.backgroundGame.displayWidth = (this.backgroundGame.displayWidth/this.backgroundGame.displayHeight) * window.innerHeight;
                this.backgroundGame.displayHeight = window.innerHeight;
                this.backgroundGame.y = (window.innerHeight - this.backgroundGame.displayHeight) / 2;                
            }
        }
        if(window.Config.state == 'game' && window.Config.state == 'die'){
            this.backgroundGame.displayWidth = (this.backgroundGame.displayWidth/this.backgroundGame.displayHeight) * window.innerHeight;
            this.backgroundGame.displayHeight = window.innerHeight;
            this.backgroundGame.x = (window.innerWidth - this.backgroundGame.displayWidth) / 2 - this.home.count;
            this.backgroundGame.y = (window.innerHeight - this.backgroundGame.displayHeight) / 2;
        }
    }
})