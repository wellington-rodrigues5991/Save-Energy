import GameObject from '../config/gameObject';

export const Tutorial = new GameObject({
	preload(){
	},  
    create(){
        this.tutorial = [];
        this.tutorial[0] = this.add.text(0, 0, window.Config.tutorial[0], { fontFamily: window.Config.font.family, fontSize: 22, align: "center", wordWrap: { width: window.innerWidth * .6, useAdvancedWrap: true }, color: window.Config.color.text});
        this.tutorial[1] = this.add.text(0, 0, window.Config.tutorial[1], { fontFamily: window.Config.font.family, fontSize: 22, align: "center", wordWrap: { width: window.innerWidth * .6, useAdvancedWrap: true }, color: window.Config.color.text });
        this.tutorial[2] = this.add.text(0, 0, window.Config.tutorial[2], { fontFamily: window.Config.font.family, fontSize: 22, align: "center", wordWrap: { width: window.innerWidth * .6, useAdvancedWrap: true }, color: window.Config.color.text });
        this.tutorial[3] = this.add.text(0, 0, window.Config.tutorial[3], { fontFamily: window.Config.font.family, fontSize: 22, align: "center", wordWrap: { width: window.innerWidth * .6, useAdvancedWrap: true }, color: window.Config.color.text });
        this.tutorial[6] = this.add.text(0, 0, window.Config.tutorialClick, { fontFamily: window.Config.font.family, fontSize: 22, align: "center", wordWrap: { width: window.innerWidth * .6, useAdvancedWrap: true }, color: window.Config.color.text });

        this.tutorial[5] = 0;

    },
    update(){
        if(window.Config.state == 'home'){
            this.tutorial[0].x = (window.innerWidth - this.tutorial[0].displayWidth)/2;
            this.tutorial[0].y = window.innerHeight;
            this.tutorial[0].setWordWrapWidth(window.innerWidth * .8)

            this.tutorial[1].x = (window.innerWidth - this.tutorial[1].displayWidth)/2;
            this.tutorial[1].y = window.innerHeight;
            this.tutorial[1].setWordWrapWidth(window.innerWidth * .8)

            this.tutorial[2].x = (window.innerWidth - this.tutorial[2].displayWidth)/2;
            this.tutorial[2].y = window.innerHeight;
            this.tutorial[2].setWordWrapWidth(window.innerWidth * .8);

            this.tutorial[3].x = (window.innerWidth - this.tutorial[3].displayWidth)/2;
            this.tutorial[3].y = window.innerHeight;
            this.tutorial[3].setWordWrapWidth(window.innerWidth * .8);

            this.tutorial[6].x = (window.innerWidth - this.tutorial[6].displayWidth)/2;
            this.tutorial[6].y = window.innerHeight * -1;
            this.tutorial[6].setWordWrapWidth(window.innerWidth * .8);

            this.tutorial[7] = 0;

            this.tutorial[4] = window.innerHeight;
        }
        if(window.Config.state == 'tutorial'){
            if(this.tutorial[4] > 0) this.tutorial[4] -= 30;
            if(this.tutorial[4] < 0) this.tutorial[4] = 0;

            for(let i = 0; i < 4; i++){
                this.tutorial[i].x = (window.innerWidth * (this.tutorial[5] + i)) + (window.innerWidth - this.tutorial[i].displayWidth)/2;
                this.tutorial[i].setWordWrapWidth(window.innerWidth * .8)

                if(this.tutorial[7] == 0) this.tutorial[i].y = window.innerHeight - this.tutorial[i].displayHeight-40 + this.tutorial[4];
                else this.tutorial[i].y += 10;
            } 

            this.tutorial[6].x = (window.innerWidth - this.tutorial[6].displayWidth)/2;
            
            this.tutorial[6].setWordWrapWidth(window.innerWidth * .8);
            if(this.tutorial[5] > -3) this.tutorial[6].y = 40 - this.tutorial[4];
            else this.tutorial[6].y -= 30;

            if(this.tutorial[5] == -1 && this.plugs.content.length == 0) this.addPlugs(true, 5, 0);
            if(this.plugs.content.length > 0 && this.tutorial[5] < -2){
                if(!(
                    this.plugs.content[0].y > 0 && this.plugs.content[0].y < window.innerHeight &&
                    this.plugs.content[0].x > 0 && this.plugs.content[0].x < window.innerWidth
                )){
                    this.tutorial[7] = 1;
                    this.removePlugs();
                    setTimeout(() => { window.Config.state = 'game'; this.startPlugs() }, 100);
                }
            }
        }
        
        if(window.Config.state == 'game' && this.tutorial.length > 0){
            for(let i = 0; i < 4; i++){ this.tutorial[i].destroy(); } 
            this.tutorial = [];
        }
    }
})