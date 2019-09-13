import React,{Component} from 'react';

export default class Game extends Component{
    constructor(arg){
        super(arg);
        this.play = false;

        this.cenas = arg.cenas;
        this.tags = arg.tags;
        this.background = arg.background;

        this.target = arg.target;

        this.update = arg.update;
        this.start = arg.start;
        this.loop = arg.loop;

        this.content = [];
        this.layers = {};

        this._count = 0;
        this.score = 0;
        this._score = 0;
    }

    componentDidMount() {
        this.build(this.props.layer);
    }
    
    build(layers){
        for(let i = 0; i < layers.length; i++){
            this.content.push(<canvas key={i} id={layers[i]} ref={(c) =>  this.layers[layers[i]] = c.getContext('2d')} width={window.innerWidth+'px'} height={window.innerHeight+'px'}></canvas>);
        }

        this._loop();
    }

    resize(){
        if(document.getElementsByTagName('canvas')[0] != undefined){
            let canvas = document.getElementsByTagName('canvas');

            for(let i = 0; i < canvas.length; i++){
                if(window.innerHeight != canvas[i].height) canvas[i].height = window.innerHeight;
                if(window.innerWidth != canvas[i].width) canvas[i].width = window.innerWidth
            }
        }
    }

    _loop(){
        if(this.props.play === true){
            if(this._count === 0) this.go();
        }

        if(this.props.play == 'stop') this.stop();

        if(this.target !== null){
            this.clean();
            this._play();
            if(typeof this.update == 'function'){this.update();}
        }

        if(typeof this.loop == 'function'){this.loop();}

        this.resize();
        window.requestAnimationFrame(()=>this._loop())
    }

    go(){
        if(typeof this.start == 'function') this.start();
        let cena = 0;
        if(arguments.length > 0) cena = this.cenas;
        else{
            for(let i = 0; i < this.cenas.length; i++){
                if(this.cenas[i].main === true){
                    cena = i;
                    break;
                }
            }
        }
        this.target = this.cenas[cena];
        this.score = 0;
        this._score = new Date();
        this._count += 1;
    }

    stop(){       
        this.target = null;
        this._count = 0;
    }

    clean(){
        let obj = Object.keys(this.layers);
        for(let i = 0; i < obj.length; i++){
            this.layers[obj[i]].clearRect(0, 0, window.innerWidth, window.innerHeight)
        }
    }

    _play(){
        let obj = this.target.gameObjects;

        if(obj === undefined) return;      

        for(let i = 0; i < obj.length; i++){
            if(typeof obj[i].start === 'function' && this._count === 0) obj[i].start();
            if(typeof obj[i].update == 'function' && this._count > 0) obj[i].update();
        }

        this._count = this._count+1;
        let score = new Date() - this._score;
        score = score/1000;
        score = score/60;
        score = score.toFixed(2);

        this.score = score;
    }

    render(){
        let content = this.content;
        return (
            <div id="content">
                {content.map(content => content)}
            </div>
        );
    }
}