    // Global variables
    
    var currentLanguage= navigator.language || navigator.userLanguage;
    var languagesData = {};

    var activePopUp=null;
    var projects = [];

    var animationOnProgress=false;

    //--------------------------  Popup

    function PopUp(elementId){
      if(activePopUp!=null)
        return;
      activePopUp = document.getElementById(elementId);
      activePopUp.classList.add('popUp');
    }

    function RemovePopUp(){
      if (activePopUp!=null && !animationOnProgress) {
	if(currentPage != 0){
        currentPage=2;
        turnLeftPage();	
	}
        activePopUp.classList.add('popDown');
        animationOnProgress=true;
        setTimeout(() => {
          hideElement();
        }, 400);
      }
    }

    function hideElement(){
      activePopUp.classList.remove('popUp','popDown');
      animationOnProgress=false;
      activePopUp = null;
    }

    // --------------------------  Translation

    function translateDOM(domTree){
      let elements = domTree.getElementsByClassName('translate');
      for (let element of elements) {
        let key = element.dataset.translatekey;
        element.innerText = languagesData[currentLanguage][key];
      }
    }

    async function switchLanguage(langCode){
      let flags = document.getElementsByClassName('flag');
      currentLanguage = langCode;
      for(let element of flags){
        element.disabled=true;
      }
      if(languagesData[langCode]==undefined){
        await fetch(window.location.origin + '/commonAssets/languages/lang.' + currentLanguage + '.js')
          .then(response => response.json())
          .then(data => languagesData[currentLanguage] = data);
      }
      translateDOM(document);
      let dummyElement = document.createElement("null");
      for(let element of projects){
        dummyElement.innerHTML = element.projectHtml; translateDOM(dummyElement); element.projectHtml = dummyElement.innerHTML
      }
      for (let element of flags) {
        element.disabled = false;
      }
    }

    // --------------------------  Loaders

    function removeTableLoaders(){
      let holdDiv = document.getElementById("notebook");
      holdDiv.onclick = function(event) {
        PopUp('notesDiv');
        let msgContainer=document.getElementById('notesDiv-messagesContainer');
        if(msgContainer.scrollHeight===msgContainer.clientHeight){
          document.getElementById('notesDiv-bottomScroll').style.visibility="hidden";
        }
      }
      holdDiv = document.getElementById("projects");
      holdDiv.onclick=function(event){
        PopUp('projectsDiv');
      }
      holdDiv = document.getElementById("id");
      holdDiv.getElementsByTagName("img")[0].onclick=function(event){
        PopUp('cvDiv');
      }

      holdDiv = document.getElementsByClassName("loader");
      for (let index = 0; index < holdDiv.length; index++) {
        holdDiv[index].style.display="none";
      }

      document.getElementsByClassName('table')[0].onclick=function(e){
        if(e.target==this){
          RemovePopUp();
        }
      }
    }

    // --------------------------  Lazy Loading

    function getJavaScript(url){
      let s = document.createElement('script');
      s.type = "text/javascript";               
      s.async = false;
      s.src = url;
      var fs = document.getElementsByTagName('script')[0];
      fs.parentNode.insertBefore(s, fs);
    }

    async function lazyLoadPage() {

      switch (currentLanguage) {
        case 'tr-TR':
          currentLanguage='tr';
          break;

        default:
          currentLanguage='en';
          break;
      }

      await fetch(window.location.origin + '/commonAssets/languages/lang.'+currentLanguage+'.js')
              .then(response => response.json())
              .then(data => languagesData[currentLanguage] = data);

      translateDOM(document);

      await Promise.allSettled([
        fetch(window.location.origin + '/cvDiv.css')
          .then(response => response.text())
          .then(data => document.getElementsByTagName('style')[0].innerHTML += data),

        fetch(window.location.origin + '/cvDiv.html')
          .then(response => response.text())
          .then(data => {let element = document.getElementById("cvDiv"); element.innerHTML = data; translateDOM(element);}),

        fetch(window.location.origin + '/notesDiv.css')
          .then(response => response.text())
          .then(data => document.getElementsByTagName('style')[0].innerHTML += data),

        fetch(window.location.origin + '/notesDiv.html')
          .then(response => response.text())
          .then(data => {let element = document.getElementById("notesDiv"); element.innerHTML = data; translateDOM(element);}),

        fetch(window.location.origin + '/projectList')
          .then(response => response.json())
          .then(data => { projects = data; }),

        fetch(window.location.origin + '/projectsDiv.css')
          .then(response => response.text())
          .then(data => document.getElementsByTagName('style')[0].innerHTML += data),

        fetch(window.location.origin + '/projectsDiv.html')
          .then(response => response.text())
          .then(data => {let element = document.getElementById("projectsDiv"); element.innerHTML = data; translateDOM(element);}),

        fetch(window.location.origin + '/musicList')
          .then(response => response.json())
          .then(data => { 
                let select = document.getElementById('SongsSelect');
                select.setAttribute('size',data.length.toString());
                for(const element of data){
                  audioUrl.push(window.location.origin+'/commonAssets/music/'+element);
                  let songName = element.replace(/_/g, " ");
                  select.options.add(new Option(songName, songName));
                }
             }),
      ]);

      let dummyElement = document.createElement("null");

      getJavaScript(window.location.origin + '/cvDiv.js');
      getJavaScript(window.location.origin + '/notesDiv.js');

      for (const element of projects) {
        await Promise.allSettled([
          fetch(window.location.origin + '/projects/' + element.projectNumber + '-' + element.projectName + '.html')
            .then(response => response.text())
            .then(data => {dummyElement.innerHTML=data; translateDOM(dummyElement);element.projectHtml = dummyElement.innerHTML}),

          fetch(window.location.origin + '/projects/' + element.projectNumber + '-' + element.projectName + '.css')
            .then(response => response.text())
            .then(data => document.getElementsByTagName('style')[0].innerHTML += data),
        ]);
        getJavaScript(window.location.origin + '/projects/' + element.projectNumber + '-' + element.projectName + '.js');
      }

      getJavaScript(window.location.origin + '/projectsDiv.js');
      removeTableLoaders();

    }

    // --------------------------  Walkman

    let ctx;
    let audioUrl=[];
    let audio=[];
    let gainNode;
    let index;
    let isSongPlaying = false;

    async function playback() {

      let SongsSelect = document.getElementById("SongsSelect");
      if(index==SongsSelect.selectedIndex){
        if(document.getElementById('walkman').getElementsByTagName('div')[0].style.display=="none"){
          ctx.suspend();
          isSongPlaying=false;
          setWalkmanButton('play');
        }
        else{
          ctx.resume();
          isSongPlaying=true;
          setWalkmanButton('pause');
        }
        return;
      }

      SongsSelect.disabled=true;

      let walkmanButton = document.getElementById('walkman').getElementsByTagName('button')[0];
      walkmanButton.disabled = true;

      let holdElement = document.getElementsByClassName('slide')[0];
      if(holdElement!=undefined)
        holdElement.classList.remove('slide');

      if(ctx!=undefined){
        await ctx.close();
      }

      ctx = new AudioContext();

      let url;

      if(SongsSelect.selectedIndex == -1){
            url=audioUrl[0];
            SongsSelect.selectedIndex=0;
            index=0;
        }
        else{
            index = SongsSelect.selectedIndex;
            url = audioUrl[index];
        }

      if(audio[index] == undefined){
        await fetch(url)
          .then(data => data.arrayBuffer())
          .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
          .then(decodeAudioData => {
            audio[index] = decodeAudioData;
          });
      }

      gainNode = ctx.createGain();
      let bufferSource = ctx.createBufferSource();
      bufferSource.buffer = audio[index];
      bufferSource.addEventListener('ended', onSongEnd);
      bufferSource.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.setValueAtTime(document.getElementById('volumeSlider').value / 100, ctx.currentTime);
      bufferSource.start(ctx.currentTime);
      isSongPlaying=true;

      document.getElementById("SongsSelect").getElementsByTagName("option")[index].classList.add('slide');
      walkmanButton.disabled = false;
      setWalkmanButton('toggle');
      SongsSelect.disabled = false;
    }

    async function onSongEnd(){
      let walkmanButton = document.getElementById('walkman').getElementsByTagName('button')[0];
      walkmanButton.disabled = true;
      setWalkmanButton('play');
      await ctx.close();
      ctx = new AudioContext();
      
      gainNode = ctx.createGain();
      let bufferSource = ctx.createBufferSource();
      bufferSource.buffer = audio[index];
      bufferSource.addEventListener('ended', onSongEnd);
      bufferSource.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.setValueAtTime(document.getElementById('volumeSlider').value / 100, ctx.currentTime);
      bufferSource.start(ctx.currentTime);

      ctx.suspend();
      isSongPlaying=false;
      walkmanButton.disabled = false;
    }

    function setWalkmanButton(option){

      let playButton = document.getElementById('walkman').getElementsByTagName('div')[0];
      let stopButton = document.getElementById('walkman').getElementsByTagName('div')[1];

      switch (option) {
        
        case 'toggle':
          if (playButton.style.diplay == "none") {
            stopButton.style.display = "none";
            playButton.style.display = "block";
          }
          else {
            playButton.style.display = "none";
            stopButton.style.display = "block";
          }
          break;
        case 'play':
          stopButton.style.display = "none";
          playButton.style.display = "block";
          break;
        case 'pause':
          playButton.style.display = "none";
          stopButton.style.display = "block";
          break;
        default:
          break;
      }
      
      
    }

    lazyLoadPage();