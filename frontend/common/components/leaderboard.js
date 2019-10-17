import React,{Component} from 'react';
import Koji from '@withkoji/vcc';

export default class eaderboard extends Component{
    constructor(props){
        super(props);
        this.component = React.createRef();
        this.state = {
            scores: [],
            dataIsLoaded: false,
            error: false
        }
        this.addCheck = false;
        this.load = this.load.bind(this);
        this.add = this.add.bind(this);
        this.key = this.key.bind(this);
    }

    componentDidMount(){
        this.load();
    }

    load(){
        fetch(`http://backend-116d2e8b-e5c2-4e71-8245-0effaa287328.koji-apps.com/leaderboard`)
        .then((response) => response.json())
        .then(({ scores }) => {
            console.log(scores)
            if(scores.length > 5) scores = scores.slice(0,5);
            this.setState({ dataIsLoaded: true, scores });
        })
        .catch(err => {
            console.log('Fetch Error: ', err);
            this.setState({ error: true });
        });
    }

    add(){
        if(!this.addCheck){
            this.addCheck = true;
            let score = (window.score < 0 ? 1 : window.score);
            addScore(this.component.current.value, score, this.load);
        }
    }

    key(){
        if(event.key === 'Enter') this.add();
    }

    render(){
        let map = null, record = false, score = 0;
        if(window.score > 0 && !this.addCheck) score = window.score;
        if(this.state.scores.length > 0){
            map = this.state.scores.map((item, i) => {
                if(score > item.score) record = true;
                return <li key={i}><span>{i+1}º {item.name}</span> <span>{item.score}</span></li>
            })
        }
        if(this.state.scores.length < 4 && score > 0) record = true;
        
        return <div className='leaderboard'>
            {!this.state.dataIsLoaded && <div style={{width:'100%', height:'100%', textAlign:'center', lineHeight:'400px'}}>Loading...</div>}
            {this.state.dataIsLoaded && <ul>
                <h2>Leaderboard</h2>
                {map}
                {record && <div className='record'>
                    <div><input ref={this.component} type='text' placeholder='Your Name' onKeyPress={this.key} onBlur={this.add}/></div>
                    <div>NEW RECORD: {score}</div>
                </div>}
                {!record && <div className='record'>
                    <div style={{fontSize:'22pt'}}>You Lose</div>
                    <div></div>
                </div>}
            </ul>}
        </div>;
    }
}

function addScore(name, score, callback){
    const body = {
        name: name,
        score: score,
        privateAttributes: {}
    };
    fetch(`http://backend-116d2e8b-e5c2-4e71-8245-0effaa287328.koji-apps.com/leaderboard`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((jsonResponse) => callback())
    .catch(err => console.log(err));
}