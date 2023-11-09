[![image](https://user-images.githubusercontent.com/59491631/174395603-afa07b52-2d17-45cb-9ab5-bdd15f5ca060.png)](https://github.com/zekicaneksi/zekicaneksi.com/blob/main/README_tr.md)<br>

Türkçe README için bayrağa tıklayın. <br>
(For the README in Turkish, click the flag.)  

# My Old Portfolio Website

My old portfolio website.

### Table of Contents

<!--ts-->
   * [Description of the Project](#description-of-the-project)
      * [Used Libraries / Technologies](#used-libraries--technologies)
      * [Directory Structure](#directory-structure)
      * [How to Add/Remove a Project](#how-to-addremove-a-project)
      * [How Does The Translation Work](#how-does-the-translation-work)
      * [How to Add/Remove a Music](#how-to-addremove-a-music)
      * [Reverse Proxy](#reverse-proxy)
      * [Anything Else](#anything-else)
<!--te-->

## Description of the Project

The site is a single page web aplication. (SPA)<br>
It has a subdomain for mobile devices and both domains are served with different Node.js processes.

### Used Libraries / Technologies

For the front end, no library whatsoever is used.<br>
For backend, Express.js and body-parser are used.<br>
Nginx is used for reverse proxy.

### Directory Structure
```bash
├───app
    ├───appDesktop
    │   ├───node_modules
    │   └───public
    │       ├───assets
    │       └───projects
    ├───appMobile
	│   ├───node_modules
    │   └───public
    │       ├───assets
    │       └───projects
    └───commonAssets
        ├───icon
        ├───images
        ├───languages
        └───music
```

Node.js is setup in the "public" folders.

### How to Add/Remove a Project

The projects are located under the public/projects folders.

Every projects has their own CSS/HTML/JS files that are dynamically loaded and added to the document. So, every project must name their variables uniquely. Such as "projectOne-arrow"

To add a project, just put the CSS/HTML/JS files into the directory. Give them the same number and name. And that is all.

To remove a project just delete the files of the project and rearrange the project numbers.

### How Does The Translation Work

There are language files under the commonAssets/languages folder. Files include key-value pairs. Like this;
```
	"cvDivText" : "cv things",
	"notesDivGreetings": "Leave a message!",
	"indexNotes" : "NOTES",
```

Elements which have a innerText property can be translated.<br>
To be translated element should have ```translate``` class. and a ```data-translateKey=''``` attribute.

Then, after these language files are read, the translation happens like this;

```js
    function translateDOM(domTree){
      let elements = domTree.getElementsByClassName('translate');
      for (let element of elements) {
        let key = element.dataset.translatekey;
        element.innerText = languagesData[currentLanguage][key];
      }
    }
```

### How to Add/Remove a Music

To add a music, put it into the commonAssets/music folder. Make sure the name doesn't include any special character and use '\_' instead of spaces. <br>
To remove a music, just delete it from the folder.

### Reverse Proxy

Nginx config file; (Windows)

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;

    server {
            listen 80;
            server_name m.*;
            location / {
                proxy_pass       http://localhost:2000;
            }
    }
    server {
            listen 80 default_server;
            location / {
                proxy_pass       http://localhost:3000;
            }
    }
}
```

### Anything Else

Anything else about the project can be inspected in the code. It is pretty self-explanatory.
(i hope)
