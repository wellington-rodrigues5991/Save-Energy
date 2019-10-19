import React,{Component} from 'react';

import Koji from '@withkoji/vcc';

export default class Tutorial extends Component{
    constructor(props){
        super(props);
        this.selector = React.createRef();
        
        this.state = {opacity: false};
        this.start = this.start.bind(this);
    }

    componentDidMount(){
        this.setState({opacity: true});
        document.getElementById('tutorial').children[0].innerHTML = Koji.config.settings.tutorial;
    }

    start(){
      this.selector.current.style.opacity = '0'
      this.selector.current.style.transform = 'scale(1.2)';
      setTimeout(() => this.selector.current.style.display = 'none', 500)
    }
    
    render(){
        let style = {display: 'flex',  justifyContent: 'center', alignItems: 'center', transition: 'all 0.5s', transitionDelay:'1.5s', opacity: '0', width:'100%', height:'100%', position:'absolute', top: '0px', left:'0px', background:'rgba(0,0,0,0.7)'};

        if(this.state.opacity) style.opacity = 1
        return(
            <div ref={this.selector} style={style}>
                <div id="tutorial" style={{padding:'40px', paddingBottom: '0px'}}>
                    <div></div>
                    <div style={{marginTop:'30px', background:'var(--main-primary)', padding: '10px 20px', float: 'left', borderRadius: '12px'}} onClick={this.start}>OK, start playing</div>
                </div>
            </div>
        );
    }
}