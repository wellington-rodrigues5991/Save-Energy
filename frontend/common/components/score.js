import React,{Component} from 'react';

export default class Score extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id='score'>{this.props.points}</div>
        );
    }
}