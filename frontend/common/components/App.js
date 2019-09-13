import React,{Component} from 'react';

export default class Game extends Component{
    constructor(arg){
        super(arg);
        
        this.active = 'null';
    }

    list(){
        let content = arguments[0][0];
        let active = this.props.active;

        if(active === 'leaderboard'){
            if(content.props.id === active) content = <div style={content.props.on} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
            else if(content.props.id === this.active) content = <div style={content.props.on} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
            else content = <div style={content.props.exit} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
        }
        else if(active === 'close'){
            if(content.props.id === this.active) content = <div style={content.props.on} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
            else if(content.props.id !== this.active) content = <div style={content.props.exit} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
            else content = <div style={content.props.exit} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
        }
        else{
            if(content.props.id === active) content = <div style={content.props.on} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
            else content = <div style={content.props.exit} key={arguments[0][1]} id={content.props.id}>{content.props.children}</div>;
        }
        
        if(arguments[0][1]+1 === this.props.children.length && active !== 'close' && active !== 'leaderboard'){
            this.active = active;
            this.useActive = false
        }
        return content;
    }

    render(){
        return(
            <div id="app">{this.props.children.map(function(){ return this.list(arguments)}.bind(this))}</div>
        )
    }
}