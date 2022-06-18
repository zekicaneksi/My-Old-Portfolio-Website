var currentPage = 0;
var whichPageOnTop='top';

var topPage, bottomPage, topPageProject, bottomPageProject;

function throwPage(){
    let thePagetoThrow;
    currentPage++;
    if(currentPage===projects.length){
        RemovePopUp();
        setTimeout(() => {
            currentPage=0;
            if(whichPageOnTop==='top'){
                topPageProject.innerHTML=projects[currentPage].projectHtml;
                topPage.offsetHeight;
            }
            else{
                bottomPageProject.innerHTML=projects[currentPage].projectHtml;
                bottomPage.offsetHeight;
            }
          }, 700);
        return;
    }
    if(whichPageOnTop === 'top'){
        whichPageOnTop='bottom';
        thePagetoThrow=topPage;
        bottomPageProject.innerHTML=projects[currentPage].projectHtml;
        bottomPage.offsetHeight;
    }
    else{
        whichPageOnTop='top';
        thePagetoThrow=bottomPage;
        topPageProject.innerHTML=projects[currentPage].projectHtml;
        topPage.offsetHeight;
    }
    thePagetoThrow.classList.add("projects-throw-anim");
    setTimeout(() => {
        if(whichPageOnTop === 'top'){
            topPage.style.zIndex="2";
            bottomPage.style.zIndex="1";
        }
        else{
            topPage.style.zIndex="1";
            bottomPage.style.zIndex="2";
        }
        thePagetoThrow.classList.remove("projects-throw-anim");
      }, 700);
}

function InitPages(){

    topPage = document.getElementsByClassName('projects-topPage')[0];
    bottomPage = document.getElementsByClassName('projects-bottomPage')[0];
    topPageProject = document.getElementsByClassName('projects-topPage-projects')[0];
    bottomPageProject = document.getElementsByClassName('projects-bottomPage-projects')[0];

    topPageProject.innerHTML=projects[currentPage].projectHtml;
    topPage.offsetHeight;
}

InitPages();