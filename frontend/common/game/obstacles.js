import GameObject from '../config/gameObject';

export const Obstacles = new GameObject({
    preload(){
        const enimesSkin = window.Data.enimesSkin;
        for(let i = 0; i < enimesSkin.length; i++){this.load.image('enimes'+i, enimesSkin[i]);}
        this.load.audio('hit', window.Data.hit, {instances: 1});
    },    
    create(){        
        this.obsctacles = {
            y: window.innerHeight,
            x: window.innerWidth,
            gridX: window.Data.gridX,
            gridY: 50,
            count: 100,
            go: false,
            start: 0,
            startSpeed: window.Data.startSpeed,
            speed: 0.5,
            content: []
        };
        this.sound.add('hit');
        this.enimes = [];
        window.addEventListener('resize', function(){this.resizeObstacle();}.bind(this));
        this.generateLine();
        this.matter.world.on('collisionstart', function (event) {
            let pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++){
                let bodyA = pairs[i].bodyA;
                let bodyB = pairs[i].bodyB;

                if(pairs[i].isSensor){
                    if(!bodyA.isSensor && bodyB.isSensor && bodyA.id === this.player.body.id && !this.player.config.invensible){
                        this.player.config.lifes.actual--;
                        this.setInvensible();
                        this.sound.play('hit');
                    }
                }
            }
        }.bind(this));

        this.ObstaclesDie();
    },
    update(){
        let destroy = [];
        let seconds = (this.time.now - this.obsctacles.start) / 10000;

        if(window.Data.play == true && !this.obsctacles.go) this.ObstaclesIniciate();
        if(window.Data.play == false && this.obsctacles.go) this.ObstaclesDie();

        for(let i = 0; i < this.enimes.length; i++){
            let x = ((this.obsctacles.y * 2)/this.obsctacles.gridY);

            if(this.obsctacles.go){
                this.obsctacles.speed = this.obsctacles.startSpeed * (seconds * window.Data.acelleration);
                this.enimes[i].y += this.obsctacles.speed;
            }
            for(let e = 0; e < this.obsctacles.content[i].length; e++){
                const oldSizeEnime = {
                    x: this.obsctacles.content[i][e].displayWidth, 
                    y: this.obsctacles.content[i][e].displayHeight
                };

                this.obsctacles.content[i][e].y = this.enimes[i].y;
            }

            if(this.enimes[i].y > window.innerHeight + this.enimes[i].displayHeight){
                this.goTop(this.enimes[i])
            }
        }
    },
    ObstaclesIniciate(){
        
        this.obsctacles.go = true;
        this.obsctacles.start = this.time.now;
    },
    ObstaclesDie(){
        for(let i = 0; i < this.obsctacles.count; i++){
            let y = ((this.obsctacles.y * 2)/this.obsctacles.gridY);
            let x = ((this.obsctacles.x)/this.obsctacles.gridX);
            const oldSizeEnime = {x: this.enimes[i].displayWidth, y: this.enimes[i].displayHeight};
            
            this.enimes[i].displayHeight = x * 3;
            this.enimes[i].displayWidth = (x * (oldSizeEnime.x/oldSizeEnime.y));
            this.enimes[i].displayWidth = 1;

            this.enimes[i].x = -10000;
            this.enimes[i].y = ((i * x) + (x * 2)*i) * -1;
        }

        this.obsctacles.go = false;
        this.obsctacles.speed = this.obsctacles.startSpeed;
    },
    resizeObstacle(){
        const factorY = window.innerHeight/this.obsctacles.y;
        const factorX = window.innerWidth/this.obsctacles.x;
        const y = ((this.obsctacles.y * 2)/this.obsctacles.gridY);
              
        for(let i = 0; i < this.enimes.length; i++){
            const children = this.enimes[i];
            
            if(children.active){
                children.displayHeight = children.displayHeight * factorX;
                children.y = children.y * factorX;
                
                for(let e = 0; e < this.obsctacles.content[i].length; e++){
                    let oldSizeEnime = {
                        x: this.obsctacles.content[i][e].displayWidth, 
                        y: this.obsctacles.content[i][e].displayHeight
                    };

                    this.obsctacles.content[i][e].x *= factorX;
                    this.obsctacles.content[i][e].displayHeight *= factorX;
                    this.obsctacles.content[i][e].displayWidth *= factorX;
                }
            }
        }
        
        this.obsctacles.y = window.innerHeight;
        this.obsctacles.x = window.innerWidth;
    },
    FindBase(){
        let y = 0;
        
        for(let i = 0; i < this.enimes.length; i++){
            if(this.enimes[i].y < y) y = this.enimes[i].y;
        }
        
        return y;                
    },
    goTop(children){
        let top = this.FindBase();
        
        children.y = (top - children.displayHeight);
    },
    generateLine(){
        for(let i = 0; i < this.obsctacles.count; i++){
            let y = ((this.obsctacles.y * 2)/this.obsctacles.gridY);
            let x = ((this.obsctacles.x)/this.obsctacles.gridX);

            this.enimes[i] = this.matter.add.sprite(this.obsctacles.x * .5, this.obsctacles.y, 'enimes0');
            const oldSizeEnime = {x: this.enimes[i].displayWidth, y: this.enimes[i].displayHeight};
            
            this.enimes[i].displayHeight = x * 3;
            this.enimes[i].displayWidth = (x * (oldSizeEnime.x/oldSizeEnime.y));
            this.enimes[i].displayWidth = 1;

            this.enimes[i].x = -100;
            this.enimes[i].y = ((i * x) + (x)) * -1;

            this.enimes[i].body.isSensor = true;
            this.enimes[i].body.ignoreGravity = true;

            this.obsctacles.content.push(this.generateObstaclesGrid(this.enimes[i]));
        }
    },
    generateObstaclesGrid(parent){
        let data = [];
        let size = (Math.random() * 4);

        //if(Math.random() > 0.6){
            let pos = this.generateObstaclesPosition(size);

            for(let i = 0; i < size.toFixed(0); i++){
                let random = (Math.random() * (window.Data.enimesSkin.length-1)).toFixed(0);
                data[i] = this.matter.add.sprite(0, 0, 'enimes'+random);
                const oldSize = {x: data[i].displayWidth, y: data[i].displayHeight};
                let x = ((this.obsctacles.x)/this.obsctacles.gridX);
                
                data[i].displayHeight = x;
                data[i].displayWidth = x * (oldSize.x/oldSize.y);

                data[i].y = parent.y;
                data[i].x = x * (pos);

                pos++;
                data[i].body.isSensor = true;
                data[i].body.ignoreGravity = true;
            }
        //}

        return data;
    },
    generateObstaclesPosition(size){
        let pos = Math.random() * this.obsctacles.gridX;
        if(pos+size > this.obsctacles.gridX) pos = this.obsctacles.gridX - size;

        return pos;
    }
})