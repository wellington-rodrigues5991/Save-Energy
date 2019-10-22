import React,{Component} from 'react';

import Koji from '@withkoji/vcc';

export default class Home extends Component{
    constructor(props){
        super(props);

        this.go = this.go.bind(this)
        this.count = 0;
    }

    go(){
        this.props.start()
        this.count++;
        document.getElementById('audioambient').play()
    }

    render(){
        let style = {textAlign:'center', position: 'absolute', width:'100%', height: '0px', height: '70px'};
        let title = Koji.config.settings.name.split('\n');

        if(this.count == 0) style.bottom = '15px';
        else style.top = '0px';
        
        return <div style={{width:'100%', height:'100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center'}}>
            <h1 className='logo'>
                {title.map((s, i) => <p key={i}>{s}</p>)}
                <span className='logo1'>{title.map((s, i) => <p key={i}>{s}</p>)}</span>
                <span className='logo2'>{title.map((s, i) => <p key={i}>{s}</p>)}</span>
                <img src={Koji.config.sprites.goodGuys[0]} className='logo3' />
            </h1>
            <div style={style}>
                <span onClick={this.go} className='btn'>{Koji.config.settings.play}</span>
            </div>
        </div>;
    }
}
