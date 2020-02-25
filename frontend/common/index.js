import React from 'react';
import {render} from 'react-dom';
import Phaser from 'phaser';
import Scene from './config/scene';
import WebFont from 'webfontloader';
import Koji from '@withkoji/vcc';

import { Player } from './game/player';
import { Plugs } from './game/plugs';
import { Tomada } from './game/tomada';

import { Home } from './game/home';
import { Tutorial } from './game/tutorial';
import { MiniScore } from './game/mini-score';
import { Score } from './game/score';
import { End } from './game/end';
import { Sound } from './game/sound';
import { Leaderboard } from './game/leaderboard';

import App from './post.js';

window.Phaser = Phaser;

function getFontFamily(ff) {
  const start = ff.indexOf('family=');
  let string = '';

  if(start === -1) return 'sans-serif';
  let end = ff.indexOf('&', start);
  if(end === -1) end = undefined;
  ff = ff.slice(start + 7, end);
  ff = ff.split('+');

  for(let i = 0; i < ff.length; i++){
    string += ff[i];
    if(i < ff.length-1) string += ' ';
  }

  return string;
}

const font = getFontFamily(Koji.config.main.general.font).split(':');

window.Config = {
    state: 'home',

    //general
    logo: {image: Koji.config.main.general.appLogo, text: Koji.config.main.general.appName},
    color: {primary: Koji.config.main.general.primary, secundary: Koji.config.main.general.secundary, text: Koji.config.main.general.text, win: Koji.config.main.general.win, lose: Koji.config.main.general.lose},
    font: {family: font[0], type: font[1] != undefined ? ':'+font[1] : ''},
    startText: Koji.config.main.general.startText,
    backgroundHome: Koji.config.main.general.backgroundHome,
    backgroundGame: Koji.config.main.general.backgroundGame,

    //tutorial
    tutorialClick: Koji.config.main.tutorial.tutorialClick,
    tutorial: [
        Koji.config.main.tutorial.firstStep, 
        Koji.config.main.tutorial.secondStep, 
        Koji.config.main.tutorial.thirdStep, 
        Koji.config.main.tutorial.fourthStep
    ],

    //sound
    sound: {
        background: Koji.config.main.sounds.ambientMusic,
        power: Koji.config.main.sounds.powerActivate,
        loseLife: Koji.config.main.sounds.songWhenLoseLife,
        die: Koji.config.main.sounds.deathAmbientMusic,
        skin: {
            on: Koji.config.main.sounds.buttonSkinActive,
            off: Koji.config.main.sounds.buttonSkinDisabled
        }
    },

    player: {
        skin: Koji.config.game.player.partclieEffect,
        size: parseFloat(Koji.config.game.player.size),
        force: parseFloat(Koji.config.game.player.force),
        timeout: parseFloat(Koji.config.game.player.timeout)
    },
    tomada: {
        skin: Koji.config.game.tower.skin,
        size: parseFloat(Koji.config.game.tower.size),
        life: parseFloat(Koji.config.game.tower.life)
    },
    enimes: [],
    enimesRespaw: parseFloat(Koji.config.game.enimesRespaw.timeToSpawnAEnemy) * 1000
};

for(let i = 0; i < Koji.config.game.enimes.length; i++){
    const enime = Koji.config.game.enimes[i];
    const value = {};

    value.size = parseFloat(enime.size);
    value.force = parseFloat(enime.force);
    value.hunger = parseFloat(enime.hunger);
    value.skin = enime.skin;
    
    window.Config.enimes.push(value)
}

document.documentElement.style.setProperty('--color-primary', window.Config.color.primary)
document.documentElement.style.setProperty('--color-text', window.Config.color.text)
document.getElementById('phaser-game').style.opacity = '1';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '0x'+window.Config.color.primary.replace('#', ''),
    scene: [new Scene([ Home, Tomada, Plugs, Player, Tutorial, MiniScore, Score, End, Sound, Leaderboard])],
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "matter",
        matter: {
            debug: false,
            gravity: {scale: 0},
            plugins: { attractors: true, collisionevents: true}
        }
    },
    loader: {crossOrigin: 'anonymous'},
    input :{
        activePointers:3,
    },
    autoRound: true,
    pixelArt: false
};

document.documentElement.style.setProperty('--font-family', window.Config.font.family)

WebFont.load({
    google: {
      families: [window.Config.font.family+window.Config.font.type, 'sans-serif']
    },
    active: () => window.Game = new Phaser.Game(config),
});

window.Grid = {
    value: null,
    calculate(){
        if(window.innerHeight > window.innerWidth) window.Grid.value = window.innerHeight/20;
        else window.Grid.value = window.innerWidth/20;
    }
};

window.Grid.calculate();
window.addEventListener('resize', window.Grid.calculate);

render(
    <div>
        <App/>
    </div>,
    document.getElementById('root')
);

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};