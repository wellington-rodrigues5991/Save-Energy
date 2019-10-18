import React from 'react';
import {render} from 'react-dom';
import { Helmet } from 'react-helmet';
import './index.css';
import Koji from '@withkoji/vcc';

import App from './components/app';

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

window.hit = false;

document.documentElement.style.setProperty('--main-primary', Koji.config.settings.primary);
document.documentElement.style.setProperty('--main-secondary', Koji.config.settings.secondary);
document.documentElement.style.setProperty('--main-font', `'${getFontFamily(Koji.config.settings.fontFamily)}', sans-serif`);

window.audio = {
    ambient: Koji.config.sound.ambient,
    die: Koji.config.sound.die,
    shoot: Koji.config.sound.shoot,
    impact: Koji.config.sound.impact
}

for(let i =0; i < 4; i++){
    let key = Object.keys(window.audio);
    let audio = document.createElement('audio');
    let src = window.audio[key[i]];

    audio.src = src;
    audio.id = 'audio'+key[i];
    audio.type = "audio/mpeg";

    if(key[i] == 'ambient') audio.loop = true;

    window.audio[key[i]] = audio;
    document.getElementById('audio').appendChild(audio)
}

window.images = [[], [], []];
window.sprites = {};

window.sprites.shoot = new Image();
window.sprites.shoot.crossOrigin = 'anonymous';
window.sprites.shoot.onload =function(){
    let canvas = document.createElement('canvas');
    canvas.width = '20';
    canvas.height = '20';

    canvas.getContext("2d").drawImage(window.sprites.shoot, 0, 0, 20, 20);
    window.sprites.shoot = canvas;
};
window.sprites.shoot.src = Koji.config.images.impact;


const images = [
    Koji.config.sprites.badGuys,
    Koji.config.sprites.goodGuys,
    Koji.config.sprites.regularGuys
];
      
for(let i = 0; i < window.images.length; i++){
    for(let e = 0; e < images[i].length; e++){
        window.images[i].push(new Image());
        window.images[i][e].crossOrigin = 'anonymous'
        window.images[i][e].src = images[i][e];
    }
}

render(
    <div>
      <Helmet defaultTitle={Koji.config.general.name}>
        <link href={Koji.config.settings.fontFamily} rel="stylesheet"/>
      </Helmet>
      <App/>
    </div>,
    document.getElementById('root')
);