import React from 'react';
import {render} from 'react-dom';
import { Helmet } from 'react-helmet';
import Koji from '@withkoji/vcc';
import WebFont from 'webfontloader';

import Phaser, { Math } from 'phaser';
import Scene from './config/scene';

import {Player} from './game/player';
import {Platform} from './game/platform';
import {Obstacles} from './game/obstacles';
import {Score} from './game/score';
import { Home } from './game/home';
import { BackgroundParallax } from './game/background';
import { Tutorial } from './game/tutorial';
import { Leaderboard } from './game/leaderboard';

import App from './post.js';

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

window.Data = {};
WebFont.load({
  google: { families: [ getFontFamily(Koji.config.general.fontFamily) ] },
  active: function(){
      render(
        <div>
        <Helmet defaultTitle={Koji.config.general.name}>
        </Helmet>
        <App/>
        </div>,
        document.getElementById('root')
    );

    window.Data = Object.assign(window.Data, {
        play: null,
        go: true,
        score: -1,

        background: Koji.config.game.background,

        backgroundSound: Koji.config.game.backgroundSound,
        dieSound: Koji.config.game.dieSound,
        hit: Koji.config.player.hit,

        logo: Koji.config.player.lifes,
        fontFamily : "'Anton'",
        textColor: Koji.config.general.text, 

        enimesSkin:  Koji.config.game.enemies,
        gridX: 12,
        startSpeed: Koji.config.platform.speed,
        acelleration: Koji.config.platform.acceleration,

        platform: Koji.config.platform.skin,
        platformForeGround: (Koji.config.platform.foreground == undefined ? '' : Koji.config.platform.foreground),
        platformBackGround: (Koji.config.platform.background == undefined ? '' : Koji.config.platform.background),
        rotationSpeed : Koji.config.platform.rotationSpeed/5,
        rotationSlowDown: Koji.config.platform.rotationSlowDown/5,

        player: Koji.config.player.skin,
        lifes: Koji.config.player.lifes,
        invincibilityTime: Koji.config.player.invincibilityTime,
        lifeIcon: Koji.config.player.lifeIcon
    });

    const scene1 = new Scene({name: 'test', content: [
        BackgroundParallax,
        Platform,
        Player, 
        Obstacles,
        Score,
        Home,
        Tutorial,
        Leaderboard
    ]});

    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xffffff,
        scene: [scene1],
        scale: {
            parent: 'phaser-game',
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "matter",
            matter: {
                debug: false,
                gravity: {x: 0, y: 5}
            }
        },
        loader: {crossOrigin: 'anonymous'},
        input :{
            activePointers:3,
        },
        autoRound: false,
        pixelArt: false
    };

    window.Game = new Phaser.Game(config);
  },
  inactive: function(){console.error('cant load the font')}
});
