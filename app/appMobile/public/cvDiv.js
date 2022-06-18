let idLastSide='front';

function turnId(){
    let cvDivInner = document.getElementById('cvDiv-inner');
    if(idLastSide === 'front'){
        cvDivInner.style.transform="rotateY(180deg)";
        idLastSide='back';
    }
    else{
        cvDivInner.style.transform="";
        idLastSide='front';
    }
}