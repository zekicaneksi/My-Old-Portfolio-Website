let funcInterval;
let isFuncIntervalRunning=false;

function notesDivInitialize(){
    document.getElementById('notesDiv-sendDiv').onclick = sendMessage;
    document.getElementById('notesDiv-form-container').keyup = function(event){
        if (event.code === 'Enter')
        {
            event.preventDefault();
            sendMessage();
        }
    }

    document.getElementById('notesDiv-bottomScroll').onmouseover= function(){
        if(!isFuncIntervalRunning){
            funcInterval = window.setInterval(function () {notesDiv_scroll('down');},5); 
            isFuncIntervalRunning=true;
        }
    }

    document.getElementById('notesDiv-bottomScroll').onmouseleave = function(){
        isFuncIntervalRunning=false;
        window.clearInterval(funcInterval);
    }

    document.getElementById('notesDiv-topScroll').onmouseover= function(){
        if(!isFuncIntervalRunning){
        funcInterval = window.setInterval(function () {notesDiv_scroll('up');},10);
        isFuncIntervalRunning=true;
        }
    }

    document.getElementById('notesDiv-topScroll').onmouseleave = function(){
        isFuncIntervalRunning=false;
        window.clearInterval(funcInterval);
    }

    document.getElementById('notesDiv-topScroll').style.visibility="hidden";
    
    getMessages();

}

function notesDiv_scroll(direction){
    let msgContainer = document.getElementById('notesDiv-messagesContainer');
    let bottomScroll = document.getElementById('notesDiv-bottomScroll');
    let topScroll = document.getElementById('notesDiv-topScroll');
    if(direction==='down'){
        msgContainer.scrollTop+=1;
        if(msgContainer.scrollHeight === Math.floor((msgContainer.scrollTop + msgContainer.clientHeight)) || msgContainer.scrollHeight-1 === Math.floor((msgContainer.scrollTop + msgContainer.clientHeight))){
            bottomScroll.style.visibility="hidden";
            bottomScroll.onmouseleave();
        }
        else{
            topScroll.style.visibility="visible";
        }
    }
    else{
        msgContainer.scrollTop-=1;
        if(msgContainer.scrollTop === 0){
            topScroll.style.visibility="hidden";
            topScroll.onmouseleave();
        }
        bottomScroll.style.visibility="visible";
    }

}

function getMessages(){
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if(httpRequest.status === 200){
               let messages=[];
               messages=httpRequest.responseText.split('\n');
               messages.pop();

               for (let message of messages) {
                addMesage(message);
              }

            }
            else{
                if(currentLanguage === 'tr'){
                    window.alert("Bilinmeyen hata");
                }
                else{
                    window.alert("Unknown error");
                }
            }
        }
    };
    httpRequest.open('GET', '/notesMessagesGet', true);
    httpRequest.send();
}


function addMesage(message){
    let msgContainerDiv = document.createElement('div');
    msgContainerDiv.classList.add('notesDiv-msgContainer');
    
    let msgSender = document.createElement('p');
    msgSender.innerText=message.slice(0,message.indexOf(':',0));

    let msgDiv = document.createElement('div');
    msgDiv.style.marginLeft="3%";
    msgDiv.classList.add('msgContainerDiv');

    let msg = document.createElement('p');
    msg.innerText=message.slice(message.indexOf(':',0)+1);

    msgContainerDiv.appendChild(msgSender);
        msgDiv.appendChild(msg);

        msgContainerDiv.appendChild(msgDiv);
        msgContainerDiv.appendChild(document.createElement('hr'));
        
        document.getElementById('notesDiv-messagesContainer').appendChild(msgContainerDiv);
}


function sendMessage(){
    if(!checkInputs()){
        return;
    }
    
    let messageToSend = document.getElementById('notesDiv-messageName').value+':'+document.getElementById('notesDiv-messageToSend').value;
    let msgContainer = document.getElementById('notesDiv-messagesContainer');

    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if(httpRequest.status === 200){
                document.getElementById('notesDiv-messageToSend').value='';
                addMesage(messageToSend);
                msgContainer.scrollTo(0,msgContainer.scrollHeight);
                document.getElementById('notesDiv-bottomScroll').style.visibility="hidden";
                if(msgContainer.scrollTop!=0){
                    document.getElementById('notesDiv-topScroll').style.visibility="visible";
                }
            }
            else{
                if(currentLanguage === 'tr'){
                    window.alert("Bilinmeyen hata");
                }
                else{
                    window.alert("Unknown error");
                }
            }
        }
    };
    httpRequest.open('POST', '/notesMessages', true);
    httpRequest.setRequestHeader('Content-Type', 'text/plain');
    httpRequest.send(messageToSend);
}

function checkInputs(){
    let name = document.getElementById('notesDiv-messageName').value;
    let msg = document.getElementById('notesDiv-messageToSend').value;
    if(msg === '' || name === ''){
        if(currentLanguage === 'tr'){
            window.alert("Lütfen boş alan bırakmayın");
        }
        else{
            window.alert("Please don't leave a field empty");
        }
        return false;
    }
    if(msg.includes(':') || name.includes(':')){
        if(currentLanguage === 'tr'){
            window.alert("Lütfen alanlarda ':' karakterini kullanmayın");
        }
        else{
            window.alert("Please don't use the ':' character in the fields");
        }
        return false;
    }
    return true;
}

notesDivInitialize();