import React,{Component} from 'react';

import Game from './game';
import Layer from './Layer';
import Home from './home';
import Leaderboard from './leaderboard';
import Tutorial from './tutorial';

import Koji from '@withkoji/vcc';

export default class App extends Component{
    constructor(props){
        super(props);

        this.state = {
            view: 1
        }
        this.first = true;
        this.changeView = this.changeView
    }

    changeView(){
        this[0].setState({view: this[1]})
        if(this[1] == 0) this[0].first = false;
    }

    render(){
      let style = {
        top: (
          this.state.view == 0 ? '0px' :
            (this.state.view == 1 ?
              'calc(-100% + 100px)':
              'calc(-200% + 100px)'
            )
          )
      };

      return <div id='app' style={style}>
        <div className='app0' style={{background:'url('+Koji.config.images.leaderboard+')'}}>
          {this.state.view == 0 && <Leaderboard/>}
        </div>
        <div className='app1' style={{background:'url('+Koji.config.images.home+')'}}>
          <Home start={this.changeView.bind([this, 2])}/>
        </div>
        <div className='app2' style={{background:'url('+Koji.config.images.home+')'}}>
          {this.state.view == 2 && 
          <div style={{position:'absolute', width:'100%', height:'100%'}}>
            <Game go={this.state.view} position='15' distance='-220' amount={Koji.config.general.amount}  die={this.changeView.bind([this, 0])}>
                <Layer/>
                <Layer/>
                <Layer/>
            </Game>
            {this.first && <Tutorial/>} 
          </div>}               
        </div>
      </div>;
    }
}