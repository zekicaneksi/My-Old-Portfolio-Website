    var currentPage = 0;
    var lastTurn="left";

    var turningPage, pageFront, pageBack, pinnedPageLeft, pinnedPageRight, bookLeftBtn, bookRightBtn;

    function turnRightPage(){
        if(currentPage!=0){
            pinnedPageLeft.innerHTML=projects[currentPage-1].projectHtml;
        }
        if(currentPage==2){
            pinnedPageLeft.style="background-image: linear-gradient(to left, #FBDB6A, #EDC020);";
            turningPage.getElementsByClassName("seperator-left")[0].style="display: block;";
        }
        pageFront.innerHTML=projects[currentPage].projectHtml;
        pageBack.innerHTML=projects[currentPage+1].projectHtml;
        pinnedPageRight.innerHTML=projects[currentPage+2].projectHtml;

        if(lastTurn=="right"){
            turningPage.classList.remove("turnRightPageAnim");
        }
        else{
            turningPage.classList.remove("turnLeftPageAnim");
            turningPage.classList.remove("resetLeftPageTurn");
        }
        turningPage.offsetHeight; // to trigger paint(draw)

        turningPage.classList.add("turnRightPageAnim");

        
        currentPage+=2;
        lastTurn="right";

        if(currentPage>=projects.length-1){
            for (let i = 0; i < bookRightBtn.length; i++) {
                bookRightBtn[i].style.display = "none";
            }
        }

        if(currentPage>=2){
            let i = 0;
            if(currentPage-2 == 0)
                i = 1;
            for (; i < bookLeftBtn.length; i++) {
                bookLeftBtn[i].style.display = "block";
            }
        }

    }

    function turnLeftPage(){
        pageFront.innerHTML=projects[currentPage-2].projectHtml;
        pageBack.innerHTML=projects[currentPage-1].projectHtml;
        if(currentPage!=2){
            pinnedPageLeft.innerHTML=projects[currentPage-3].projectHtml;
        }
        else{
            pinnedPageLeft.innerHTML="";
        }
        if(currentPage==2){
            pinnedPageLeft.style="background-image: none;";
            turningPage.getElementsByClassName("seperator-left")[0].style="display: none;";
        }
        pinnedPageRight.innerHTML=projects[currentPage].projectHtml;

        if(lastTurn=="left"){
            turningPage.classList.remove("turnLeftPageAnim");
            turningPage.classList.add("resetLeftPageTurn");
            turningPage.offsetHeight;
            turningPage.classList.add("turnLeftPageAnim");
            turningPage.classList.remove("resetLeftPageTurn");
        }
        else{
            turningPage.classList.add("turnLeftPageAnim");
            turningPage.classList.remove("turnRightPageAnim");
        }

        turningPage.offsetHeight;

        

        currentPage-=2;
        lastTurn="left";

        if(currentPage==0){
            for (let i = 0; i < bookLeftBtn.length; i++) {
                bookLeftBtn[i].style.display = "none";
            }
        }

        if(currentPage<=projects.length-2){
            for (let i = 0; i < bookRightBtn.length; i++) {
                bookRightBtn[i].style.display = "block";
            }
        }

    }

    function InitPages(){

        turningPage = document.getElementsByClassName("turning-page")[0];
        pageFront = turningPage.getElementsByClassName("page-front-project")[0];
        pageBack = turningPage.getElementsByClassName("page-back-project")[0];
        pinnedPageLeft = document.getElementsByClassName("pinned-page-left-project")[0];
        pinnedPageRight = document.getElementsByClassName("pinned-page-right-project")[0];
        bookLeftBtn = document.getElementsByClassName("bookLeftBtn");
        bookRightBtn = document.getElementsByClassName("bookRightBtn");

        if(projects.length<2){
            for (let i = 0; i < bookRightBtn.length; i++) {
                bookRightBtn[i].style.display = "none";
            }
        }

        document.getElementsByClassName("pinned-page-left")[0].onclick=function(event){
            if(currentPage==0)
                RemovePopUp();
        }

        pageFront.innerHTML=projects[currentPage].projectHtml;
        turningPage.offsetHeight;
    }

    InitPages();