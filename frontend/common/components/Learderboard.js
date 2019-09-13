import Koji from 'koji-tools';

function getScores(callback){
    let httpRequest = new XMLHttpRequest();
    let url = 'https://backend-2bed8b54-1268-4f52-a645-9296c91b3ba3.withkoji.com/leaderboard';
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                let data = JSON.parse(httpRequest.responseText);
                console.log(data)
                data = data.scores;
                data = data.sort((a, b) => a.score < b.score ? 1 : -1);
                data = data.slice(0, data.length > 10 ? 10 : data.length);
                
                this(data);
            }
        }
    }.bind(callback);
    httpRequest.open('GET', url);
    httpRequest.send(); 
}

function addScore(e){
    let httpRequest = new XMLHttpRequest();
    let url ='https://backend-2bed8b54-1268-4f52-a645-9296c91b3ba3.withkoji.com/leaderboard/save';
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                let data = JSON.parse(httpRequest.responseText);
                
                if(data.success == true) this('leaderboard')
            }
        }
    }.bind(e);

    let data = {};

    data.name = document.getElementById("nameScore").value;
    data.score = game.score;
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(JSON.stringify(data)); 
}

export default {
    getScores,
    addScore,
};