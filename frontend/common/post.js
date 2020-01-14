import React,{Component} from 'react';
import Koji from '@withkoji/vcc';

export default class App extends Component{
    constructor(props){
        super(props);

        this.state = {
            scale: 2,
            fundo: 0,
            display: 'none'
        }

        this.callback = function(){};

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount(){
        window.Data.openLeaderboard = this.open;
    }

    open(callback){
        this.callback = callback;
      this.setState({display: 'flex'})
      setTimeout(() => this.setState({scale: 1, fundo: 0.7}), 100);
    }

    close(){
      this.setState({scale: 2, fundo: 0})
      setTimeout(() => this.setState({display: 'none'}), 500);
    }

    send(){
        let name = document.getElementsByTagName('input')[0].value;
        console.log(name)
      addScore(name, window.Data.score, () => {this.close(); this.callback();})  
    }

    render(){
      return <div style={{width: '100%', height:'100vh', position: 'fixed', bottom:'0px', left:'0px', display: this.state.display, background:'rgba(0,0,0,'+this.state.fundo+')', transform:'scale('+this.state.scale+')', transition: 'transform 0.5s, background 0.5s', flexWrap: 'wrap', alignItems: 'center', alignContent: 'flex-end'}}>
      <h1 className="content">You made a TOP SCORE</h1>
      <div className="space"></div>
      <input type="text" placeholder="Put your name here" />
      <div className="space"></div>
      <button onClick={this.send}>Register Score</button>
    </div>;
    }
}

function addScore(name, score, callback){
    const body = {
        name: name,
        score: parseFloat(score),
        privateAttributes: {}
    };
    fetch(Koji.config.serviceMap.backend+'/leaderboard', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((jsonResponse) => callback())
    .catch(err => console.log(err));
}