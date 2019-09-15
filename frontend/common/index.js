import React from 'react';
import {render} from 'react-dom';
import { Helmet } from 'react-helmet';
import './index.css';

import ColliderManager from './engine/complements/collider';
import ImageManager from './engine/complements/image';
import InputManager from './engine/complements/input';
import PositionManager from './engine/complements/position';
import RenderManager from './engine/complements/render';
import Game from './engine/Game';
import Cena from './engine/Cenas';
import GameObject from './engine/GameObject';

import App from './components/App';
import Koji from 'koji-tools';
import Scoring from './components/Learderboard';

window.Koji = Koji;

function getFontFamily(ff) {
    const start = ff.indexOf('family=');
    if(start === -1) return 'sans-serif';
    let end = ff.indexOf('&', start);
    if(end === -1) end = undefined;
    return ff.slice(start + 7, end);
}

const prop = {
    cenas: [],
    tags: ['default'],
    background: null,
    play: false,
    target: null,
    layer:['moving'],
    start: null,
    update: null,
    loop: null
};
window.game = {};

console.log(window.Koji)
const config = {
    initial_speed : parseFloat(window.Koji.config.general.speed),
    speed : parseFloat(window.Koji.config.general.speed),
    aceleration : parseFloat(window.Koji.config.general.aceleration),
    obstacles: {
        amount: parseFloat(window.Koji.config.obstacles.amount),
        width: window.Koji.config.obstacles.width,
        height: window.Koji.config.obstacles.height,
    },
    bubbles:{
        amount: parseFloat(window.Koji.config.particles.amount),
        width: parseFloat(window.Koji.config.particles.width),
        height: parseFloat(window.Koji.config.particles.height),
    },
    player: {
        speed : window.Koji.config.player.speed,
        width: window.Koji.config.player.width,
        height: window.Koji.config.player.height
    }
};

const main = new Cena(prop);
main.main = true;
prop.cenas = [main];

window.old = {prop:{}, active: 'home', score: 0, leaderboard: null}

const resource = new ImageManager();
const input = new InputManager();
const position = new PositionManager(window.game);
const draw = new RenderManager();
const collision = new ColliderManager(position);
collision.direction = input;
let active = 'null';

if(window.Koji.config.particles.image != ""){
    resource.add(window.Koji.config.particles.image, 'bubble');
    resource.load('bubble', config.bubbles.width, config.bubbles.height, true);
}
if(window.Koji.config.player.image != ""){
    resource.add(window.Koji.config.player.image, 'player');
    resource.load('player', config.player.width, config.player.height);
}
if(window.Koji.config.obstacles.image != ""){
    resource.add(window.Koji.config.obstacles.image, 'obstacles1');
    resource.load('obstacles1', config.obstacles.width, config.obstacles.height)
}
if(window.Koji.config.obstacles.rope != ""){
    resource.add(window.Koji.config.obstacles.rope, 'rope');
    resource.load('rope', 2, config.obstacles.height)
}

function configGameObject(gameobject, layer, cena, collider){
    position.register(gameobject);
    draw.register(gameobject);
    if(collider) collision.register(gameobject);
    
    cena.load(gameobject);
    gameobject.layer = layer;
}

function changeView(cont){
    if(cont == undefined){
        active = 'home';
        update();
    }
    else{
        if(cont === 'content'){
            document.getElementsByTagName('audio')[0].play();
        }
        if(cont === 'try'){
            document.getElementsByTagName('audio')[0].pause();
            document.getElementsByTagName('audio')[0].currentTime = 0;
            document.getElementsByTagName('audio')[1].play();
        }
        active = cont;
    }
}
window.onload = function(){setTimeout(changeView, 1000)}

const anzois = {
    start: false,
    stop: false,
    gameObjects: [],
    ropes: [],
};

function generateAnzol(){
    let anzol = new GameObject();
    configGameObject(anzol, 'moving', main, true);

    let rope = new GameObject();
    configGameObject(rope, 'moving', main, false);
    rope.anzol = anzol;
    anzois.ropes.push(rope);

    rope.update = function(){
        this.render(resource.load('rope', 3, this.anzol.position.y));
                
        if(!anzois.stop){
            this.position.x = this.anzol.position.x + (config.obstacles.width/2) - 1.5
        }
    };
    
    anzol.stayCollision = function(){
        changeView('try')
        config.speed = parseFloat(window.Koji.config.general.speed)

        anzois.stop = true;
        setTimeout(function(){
            prop.play = 'stop';
            update()
        }, 100);
        setTimeout(function(){
            anzois.start = true;
            anzois.stop = false;
        }, 110);
    }
    
    anzol.update = function(){
        this.render(resource.load('obstacles1', config.obstacles.width, config.obstacles.height));
                
        if(!anzois.stop){
            this.position.x -= config.speed;
            this.isOutofScreen();
        }
    }
    
    anzol.isOutofScreen = function(){
        let i = anzois.gameObjects.indexOf(this)
        let multiple = anzois.gameObjects.indexOf(this) + 1;
        multiple = multiple * 80;
        if(multiple < window.innerWidth){multiple = window.innerWidth}
        
        if(this.position.x < -50 && config.speed > 0){
            let y = (Math.random() * ((window.innerHeight/10) * 9.5) - config.obstacles.height);
            
            if(y < 0){y = 10 + (Math.random() * 20);}
            this.position.x = ((window.innerWidth/config.obstacles.amount) * (i + 0)) + window.innerWidth;
            this.position.y = y;
        }
        if(this.position.x > window.innerWidth + 50 && config.speed < 0){
            let y = (Math.random() * ((window.innerHeight/10) * 9.5) - config.obstacles.height);
            
            if(y < 0){y = 10 + (Math.random() * 20);}
            this.position.x = ((window.innerWidth/config.obstacles.amount) * (i + 0)) - window.innerWidth;
            this.position.y = y;
        }
    }
    anzois.gameObjects.push(anzol);
    
    resetAnzol(anzois.gameObjects.indexOf(anzol));
}

function reset(){
    for(let i = 0; i < anzois.gameObjects.length; i++){
        resetAnzol(i);
    }
}

function resetAnzol(i){
    let anzol = anzois.gameObjects[i];
    let x = ((window.innerWidth/config.obstacles.amount) * (i + 0));
    
    if(config.speed < 0)x = x - window.innerWidth;
    if(config.speed > 0)x = x + window.innerWidth;
    
    anzol.render(resource.load('obstacles1', config.obstacles.width, config.obstacles.height));
    anzol.position.x = x;
    anzol.position.y = (Math.random() * ((window.innerHeight/10) * 9.5) + 20);
    anzol.tag = 'anzol';
    anzol.tagCollision = 'fish';
    anzol.stop = false;
}

const fish = new GameObject();
configGameObject(fish, 'moving', main, true);

fish.tag = 'fish';
fish.tagCollision = 'anzol';
fish.position.x = 60;
fish.position.y = (window.innerHeight/2) - 30;
fish.speed = {x: 0, y: 0} 
fish.start = function(){
    fish.render(resource.load('player', config.player.width, config.player.height));
}

const wave = {
    amplitude: 2,
    frequency: 1,
    cont: -1,
    diif: 15,
    calcute(){
      if(window.Koji.config.player.bounceAnimation != 'true') return 0;

      let diif = (this.diif > 0 ? this.diif : this.diif * -1);
      let mult = fish.speed.y; mult = (mult == 0 ? 1 : mult);
      let sine = Math.sin( (this.cont * mult) / ((this.amplitude) * 10) ) * ((this.frequency) * diif) + (diif - 1);

      if(this.diif < 0) sine = sine * -1;

      this.diif = 1;
      this.cont += 1;

      return sine;
    }
}

fish.update = function(){
    let y = fish.position.y + (fish.speed.y * config.speed);
    let x = fish.position.x;

    let onda = wave.calcute();

    if(config.speed < 0){y = fish.position.y - (fish.speed.y * (config.speed*-1));}

    y = y + onda;

    let center = (window.innerHeight/2) - 30;
    if(y > 60 && y < window.innerHeight - 60 - config.player.height ){
        let diff = fish.position.y - center;
        diff = (diff < 0 ? diff *-1 : diff);
        diff = (diff/center);

        if(diff > 0.2){
            wave.frequency = 1.5;
        }
    }

    if(y < 60){y = 60; wave.diif = -5; wave.frequency = 1;}
    if(y > window.innerHeight - 60 - config.player.height){ y = window.innerHeight - 60 - config.player.height; wave.diif = 5; wave.frequency = 1;}    
    if(x < window.innerWidth - 60 - config.player.width && config.speed < 0){x = fish.position.x  + (fish.speed.x * (config.speed*-1));}
    if(x > 60 && config.speed > 0){x = fish.position.x  - (fish.speed.x * (config.speed));}

    fish.render(resource.load('player', config.player.width, config.player.height));
    fish.position.y = y + wave.calcute();
    fish.position.x = x;
}

input.onAction(function(){
    if(prop.play == "stop" || !prop.play) return;

    if(input.action.position.y - fish.position.y > 0){
        fish.speed.y = config.player.speed*-1;
    }
    if(input.action.position.y - fish.position.y < 0){
        fish.speed.y = config.player.speed;
    }
});

prop.update = function(){
    
    if(anzois.gameObjects.length < config.obstacles.amount){
        let size = config.obstacles.amount - anzois.gameObjects.length;
        for(let i = 0; i < size; i++){
            generateAnzol();
        }
    }

    if(bubbles.gameObjects.length < config.bubbles.amount){
        let size = config.bubbles.amount - bubbles.gameObjects.length;
        for(let i = 0; i < size; i++){
            generateBubbles();
        }
    }
    if(anzois.start){
        for(let i = 0; i < anzois.gameObjects.length; i++){
            resetAnzol(i);
        }
    }
    anzois.start = false;
    config.speed += config.aceleration/10000;
}

prop.start = function(){
    anzois.start = true;
    anzois.stop = false;
    generatePlayer();
}


function generatePlayer(){
    anzois.stop = false;
    fish.position.x = 60;
    fish.position.y = (window.innerHeight/2) - 30;
    fish.speed = {x: 0, y: 0} 
}

const bubbles = {
    start: false,
    stop: false,
    gameObjects: [],
};

function generateBubbles(){
    let bubble = new GameObject();
    configGameObject(bubble, 'moving', main);

    bubble.update = function(){
        this.render(resource.load('bubble', Math.floor(Math.random() * config.bubbles.width), Math.floor(Math.random() * config.bubbles.height)));
                
        if(!bubble.stop){
            this.position.y -= config.speed;
            his.isOutofScreen();
        }
    };
    
    bubble.isOutofScreen = function(){
        let i = bubbles.gameObjects.indexOf(this)
        let multiple = bubbles.gameObjects.indexOf(this) + 1;
        multiple = multiple * 80;
        if(multiple < window.innerWidth){multiple = window.innerWidth}
        
        if(this.position.x < -50 && config.speed > 0){
            let y = (Math.random() * ((window.innerHeight/10) * 9.5) - config.bubbles.height);
            
            if(y < 0){y = 10 + (Math.random() * 20);}
            this.position.x = ((window.innerWidth/config.bubbles.amount) * (i + 0)) + window.innerWidth;
            this.position.y = window.innerHeight + config.bubbles.height;
        }
        if(this.position.x > window.innerWidth + 50 && config.speed < 0){
            let y = (Math.random() * ((window.innerHeight/10) * 9.5) - config.bubbles.height);
            
            if(y < 0){y = 10 + (Math.random() * 20);}
            this.position.x = ((window.innerWidth/config.bubbles.amount) * (i + 0)) - window.innerWidth;
            this.position.y = window.innerHeight + config.bubbles.height;
        }
    }
    bubbles.gameObjects.push(bubble);
    
    resetBubbles(bubbles.gameObjects.indexOf(bubble));
}

function resetBubbles(i){
    let bubble = bubbles.gameObjects[i];
    let x = ((window.innerWidth/config.bubbles.amount) * (i + 0));
    
    if(config.speed < 0)x = x - window.innerWidth;
    if(config.speed > 0)x = x + window.innerWidth;
    
    bubble.render(resource.load('bubble', Math.floor(Math.random() * config.bubbles.width), Math.floor(Math.random() * config.bubbles.height)));
    bubble.position.x = x;
    bubble.position.y = window.innerHeight + config.bubbles.height;
    bubble.tag = 'bubble';
    bubble.stop = false;
}

window.leaderboard = null;
prop.loop = function(){
    if(window.old.prop !== prop || window.old.active !== active || window.game.score != window.old.score){
        if(active === 'content'){
            prop.play = true;
            document.getElementsByTagName('audio')[0].volume = '0.6'
        }
        if(active === 'try'){
            document.getElementsByTagName('audio')[1].volume = '0.15'
        }

        if(active == 'leaderboard'){
            Scoring.getScores(function(){
                window.leaderboard = arguments[0];
                update()
            });
        }
        update()
        
    }

}

function changeActive(t){
    active = t;
}

function addScore(e){
    let name = document.getElementById('nameScore').value;
    if(arguments[0].keyCode == 13 && name !== '') Scoring.addScore(changeActive);
}

function update(){
    let content = {
        on:{right: '0%', filter: 'blur(0px)', WebkitFilter: 'blur(0px)', backgroundImage: 'url('+window.Koji.config.general.backgroundImage+')'},
        off:{right: '0%', filter: 'blur(10px)', WebkitFilter: 'blur(10px)', backgroundImage: 'url('+window.Koji.config.general.backgroundImage+')', opacity : '0.3'}
    }, 
    home = { on:{right: '0%', backgroundImage: 'url('+window.Koji.config.general.backgroundHome+')'}, off:{right: '-100%', backgroundImage: 'url('+window.Koji.config.general.backgroundHome+')'}}, 
    tri = { on:{right: '0%'}, off:{right: '-100%'}}, 
    leaderboard = { on: {right: '0%', top: '50px', height:'calc(100% - 50px)'}, off: {right: '0%', top: '150%'}};

    window.old.prop = prop;
    window.old.active = active;
    window.old.score = window.game.score;
    window.old.leaderboard = window.leaderboard;

    document.documentElement.style.setProperty('--main-bg-color', window.Koji.config.general.colorPrimary);
    document.documentElement.style.setProperty('--main-sc-color', window.Koji.config.general.colorSecondary);
    document.documentElement.style.setProperty('--main-font', "'"+getFontFamily(Koji.config.general.fontFamily)+"', sans-serif");

    render(
        <div style={{width:window.innerWidth+'px', height:window.innerHeight+'px'}}>
             <Helmet defaultTitle={Koji.config.general.name}>
                <link href={Koji.config.general.fontFamily} rel="stylesheet" />
            </Helmet>
            <audio src={window.Koji.config.sounds.backgroundMusic} loop />
            <audio src={window.Koji.config.sounds.dieSound}/>

            <App active={active}>
                <div on={content.on} exit={content.off} id='content'>
                    <Game 
                        cenas={prop.cenas} tags={prop.tags}
                        background={prop.background}
                        play={prop.play}
                        target={prop.target}
                        layer={prop.layer}
                        update={prop.update}
                        start={prop.start}
                        loop={prop.loop}
                        ref={(pageComponent) => {window.game = pageComponent}}
                    />
                    <div id='score'>{window.Koji.config.general.scoreMessage} {window.game.score} sec</div>
                </div>

                <div on={home.on} exit={home.off} id='home'>
                        <button onClick={()=>changeView('leaderboard')}>Leaderboard</button>
                        <div className="break"></div>
                        <button onClick={()=>changeView('content')}>{window.Koji.config.general.buttonText}</button>
                </div>

                <div on={tri.on} exit={tri.off} id='try'>
                    <button onClick={()=>changeView('leaderboard')}>Leaderboard</button>
                        <div className="break"></div>
                    <button onClick={()=>changeView('content')}>Try Again</button>
                    <div id="die">
                        <span>{window.Koji.config.general.dieMessage} {window.game.score} seconds</span>
                        <input type="text" id="nameScore" placeholder="Type your name for Leaderboard" data-count="0" onKeyUp={addScore}/>
                    </div>
                        
                </div>

                <div on={leaderboard.on} exit={leaderboard.off} id='leaderboard'>
                    <div id="contleaderboard">
                        <ul id="leaderboardContent">
                            {window.leaderboard == null && <span>carregado...</span>}
                            {window.leaderboard != null && <h3>Leaderboard</h3>}
                            {(window.leaderboard != null) && 
                                window.leaderboard.map(function(){
                                    return <div key={arguments[1]}>
                                        <span>{arguments[1]+1}. {arguments[0].name}</span>
                                        <span>{arguments[0].score}</span>
                                    </div>
                                })
                            }
                        </ul>
                        <div className="close" onClick={()=>changeView('close')}>+</div>
                    </div>
                    
                </div>
            </App>
            
        </div>, 
        document.getElementById('root')
    )
;}

update();