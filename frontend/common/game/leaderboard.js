import GameObject from '../config/gameObject';
import Koji from '@withkoji/vcc';

export const Leaderboard = new GameObject({ 
    create(){
        this.leaderborad = {name: '', point: '', list: false};
        this.leaderborad.names =  this.add.text(0, window.innerHeight * .05, this.leaderborad.name, { fontFamily:  window.Data.fontFamily});
        this.leaderborad.points =  this.add.text(0, window.innerHeight * .05, this.leaderborad.point, { fontFamily:  window.Data.fontFamily});
        
        this.leaderborad.names.setColor(window.Data.textColor);
        this.leaderborad.points.setColor(window.Data.textColor);

        this.leaderborad.names.setAlign('left');
        this.leaderborad.points.setAlign('right');

        this.leaderborad.names.setFontSize (24);
        this.leaderborad.points.setFontSize (24);

        this.leaderborad.names.setLineSpacing (10);
        this.leaderborad.points.setLineSpacing (10);

        window.addEventListener('resize', function(){
            this.resizeFont();
        }.bind(this))
    },
    update(){
        if(window.Data.play == true){
            this.leaderborad.list = false;

            this.leaderborad.names.alpha = 0;
            this.leaderborad.points.alpha = 0;
        }
        if(window.Data.play == false && !this.leaderborad.list){
            let data = this.getLeaderBoard();
            
            this.leaderborad.name = data[0].join('\n');
            this.leaderborad.point = data[1].join('\n');
            this.leaderborad.list = true;

            this.leaderborad.names.setText(this.leaderborad.name);
            this.leaderborad.points.setText(this.leaderborad.point);

            this.leaderborad.names.alpha = 1;
            this.leaderborad.points.alpha = 1;
        }
        this.leaderborad.names.setText(this.leaderborad.name);
        this.leaderborad.points.setText(this.leaderborad.point);

        let pos = this.leaderborad.names.displayWidth + this.leaderborad.points.displayWidth + 40;
        this.leaderborad.names.x = window.innerWidth/2 - pos/2;
        this.leaderborad.points.x = this.leaderborad.names.x + this.leaderborad.names.displayWidth + 20;

        this.leaderborad.names.y = this.score.y + this.score.displayHeight + 5;
        this.leaderborad.points.y = this.leaderborad.names.y;
        
    },
    getLeaderBoard(){
        console.log(Koji.config.serviceMap.backend)
        fetch(Koji.config.serviceMap.backend+'/leaderboard')
        .then((response) => response.json())
        .then(({ scores }) => {
            if(scores.length > 5) scores = scores.slice(0,5);
            const temp = [[], []];

            console.log(scores)
            for(let i = scores.length-1; i >= 0; i--){
                console.log(scores[i].score, i)
              temp[0].push(scores[i].name);
              temp[1].push(parseFloat(scores[i].score));
            }

            this.leaderborad.name = temp[0].join('\n')
            this.leaderborad.point = temp[1].join('\n');

            let min = Math.min.apply(null, temp[1]);

            if(min == Infinity || min == NaN) min = 0;
            if(parseInt(this.score.text) > min){
                this.post();
            }else{
                window.Data.go = true;
            }
        })
        .catch(err => {
            console.log('Fetch Error: ', err);
        });
        
        return [[], []]
    },
    post(){
      window.Data.go = false;
      window.Data.openLeaderboard(() => {
          window.Data.go = true;
          this.getLeaderBoard()
      });
    }
})