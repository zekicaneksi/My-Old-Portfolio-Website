[![image](https://user-images.githubusercontent.com/59491631/174395603-afa07b52-2d17-45cb-9ab5-bdd15f5ca060.png)](https://github.com/zekicaneksi/zekicaneksi.com/blob/main/README_tr.md)<br>

Türkçe README için bayrağa tıklayın. <br>
(For the README in Turkish, click the flag.)  

# zekicaneksi.com

My poorly made portfolio web site.

### Table of Contents

<!--ts-->
   * [Description of the Project](#description-of-the-project)
      * [Used Libraries / Technologies](#used-libraries--technologies)
      * [Directory Structure](#directory-structure)
      * [How to Add/Remove a Project](#how-to-addremove-a-project)
      * [How Does The Translation Work](#how-does-the-translation-work)
      * [Reverse Proxy](#reverse-proxy)
      * [Anything Else](#anything-else)
   * [Discussion](#discussion)
   * [Deployment (in my case)](#deployment-in-my-case)
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

## Discussion

Here, i want to talk about, in my opinion, what is done absolutely wrong and what could be better.

#### Design

Nobody likes the design but me, apparently. Let's just agree to disagree on this matter.

#### Is Mobile Domain Neccessary?

I believe not. I think the desktop version of the site could be responsive enough for mobile devices. Only, the projects' animations would not applicable to mobile. But an other "projectsDiv" for mobile users could be made and showed via javascript.

Then why did i not do it? It was too much of a hustle.

#### Is Mobile Domain Responsive Enough?

Absolutely not. I made a lot of mistakes on the front end and relized them when the project was already finished. Now, fixing them is even more of a hustle than making the project from scratch. And that's why i won't fix them.

#### Naming Variables

Because it is a SPA and everything is just added to a one big pile of code, naming variables is a pain. I couldn't think of anything other than basically start naming everything by some kind of an identifier. I believe there are tools to solve such a problem but in my case, my solution was enough and i just didn't want to do the research, but will soon of course.

## Deployment (in my case)

I used AWS for everything.
- Launched an EC2 / t2.micro x64-bit (x86) machine with the operation system Canonical, Ubuntu, 22.04 LTS
- Installed Nginx, Nodejs and Npm on the server
- Put the project into the server
- Got an elastic ip addeess, and assosicated it with the machine.
- Got my domain
- Configured Route53 for routing
- Got my TLS (SSL) sertificate from via Let's Encrpyt (Certbot);<br>
https://letsencrypt.org/getting-started/ <br>
https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal

### Some commands and information that'll help me and maybe some of you in the future
When you close the SSH session to the EC2 machine, the processes that you opened die. For them not to die this command is used (you use this to run node processes);
```
sudo nohup node index.js &
```
To stop/start nginx;
```
sudo systemctl stop nginx
sudo systemctl start nginx
```
List processes that listen to ports;
```
sudo lsof -i -P -n | grep LISTEN
```
And finally, my final nginx.config file (that Certbot automatically created);
```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
events {
	worker_connections 768;
}
http {
	sendfile on;
	tcp_nopush on;
	types_hash_max_size 2048;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	gzip on;

	server {
		server_name m.*;
		location / {
			proxy_pass       http://localhost:2000;
		}
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/zekicaneksi.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/zekicaneksi.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }
  
    server {
		listen 80 default_server;
		location / {
			proxy_pass       http://localhost:3000;
		}
    }
	
    server {
		location / {
			proxy_pass       http://localhost:3000;
		}
    server_name www.zekicaneksi.com zekicaneksi.com; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/zekicaneksi.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/zekicaneksi.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
    server {
    if ($host = www.zekicaneksi.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    if ($host = zekicaneksi.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    server_name www.zekicaneksi.com zekicaneksi.com;
    return 404; # managed by Certbot
}
	server {
    if ($host = m.zekicaneksi.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
		server_name m.*;
    return 404; # managed by Certbot
}}
```
