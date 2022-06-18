function indexProject(e){
    let indexOl = document.getElementById('index').getElementsByTagName('ol')[0];
    let numbersToTurn;
    for(let i = 0; i < indexOl.childElementCount; i++){
        if(e.target===indexOl.getElementsByTagName('li')[i]){
            if(i === 0){ numbersToTurn = 1;}
            else{
                numbersToTurn = (i/2) + (i%2);
                if(Math.abs((i/2) - Math.round(i/2)) === 0.5){
                    numbersToTurn-=0.5;
                }
                else{
                    numbersToTurn++;
                }
            }
            for(let j = 0; j < numbersToTurn; j++){
                turnRightPage();
            }
            break;
        }
    }
}