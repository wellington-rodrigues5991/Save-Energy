import GameObject from '../config/gameObject';

export const Home = new GameObject({
    preload(){
        this.load.image('logo', window.Data.logo);
    },  
    create(){
        this.home = {};
        this.home.text = this.add.text(0, window.innerHeight * .05, 'Touch/Click to play the game', { fontFamily:  window.Data.fontFamily});
        this.home.text.setColor(window.Data.textColor);
        this.home.logo = this.add.sprite(0, window.innerHeight * .05, 'logo');
        this.home.config = {count: 0}
    },
    update(){
        if(window.Data.play == null){
            let size = window.innerWidth;
            if(window.innerHeight > window.innerWidth) size = window.innerHeight;
            this.home.text.setFontSize(size * .03);
            this.home.text.x = window.innerWidth/2 - this.home.text.displayWidth/2;
            this.home.text.y = window.innerHeight - this.home.text.displayHeight - window.innerHeight*.05;

            const logoSize = {x: this.home.logo.displayWidth, y: this.home.logo.displayHeight}
            

            this.home.logo.displayWidth = (window.innerHeight * .25) * (logoSize.x/logoSize.y);
            this.home.logo.displayHeight = window.innerHeight * .25;

            this.home.logo.x = window.innerWidth/2;
            this.home.logo.y = window.innerHeight*.3;
        }
        if(window.Data.play == true){
            if(this.home.logo.y < window.innerHeight * 2) this.home.logo.y += 25;
            if(this.home.text.y < window.innerHeight){
                this.home.text.y += 5;
                this.home.config.count++;
            }            
        }
        if(window.Data.play == false){
            if(this.home.text.y > window.innerHeight - this.home.text.displayHeight - window.innerHeight*.05) this.home.text.y -= 5;
            else{
                if(this.home.config.count == 0){
                    window.Data.go = true;
                    console.log('estou fudendo')
                }
                this.home.config.count++;
            }
        }
    }
})