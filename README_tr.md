# zekicaneksi.com

Acemice hazırlanmış portfolyo web sitem.

### İçindekiler

<!--ts-->
   * [Proje Açıklaması](#proje-açıklaması)
      * [Kullanılan Kütüphaneler / Teknolojiler](#kullanılan-kütüphaneler--teknolojiler)
      * [Dizin Yapısı](#dizin-yapısı)
      * [Nasıl Proje Eklenir/Çıkarılır](#nasıl-proje-eklenirçıkarılır)
      * [Çeviri Nasıl Çalışır](#çeviri-nasıl-çalışır)
      * [Reverse Proxy](#reverse-proxy)
      * [Diğer Her Şey](#diğer-her-şey)
   * [Tartışma](#tartışma)
   * [Deployment (benim durumum için)](#deployment-benim-durumum-için)
<!--te-->

## Proje Açıklaması

Site, bir tek sayfa uygulamasıdır. (SPA) <br>
Mobil cihazlar için bir alt domaini vardır. Her iki domain de Node.js ile sunuluyor.

### Kullanılan Kütüphaneler / Teknolojiler

Front end için hiçbir kütüphane kullanılmamıştır.<br>
Backend için Express.js ve body-parser kütüphaneleri kullanılmıştır.<br>
Reverse proxy amaçlı Nginx kullanılmıştır.

### Dizin Yapısı
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

Node.js, "public" klasörülerinde bulunmaktadır.

### Nasıl Proje Eklenir/Çıkarılır

Projeler public/projects klasörü altında bulunmaktadır.

Her projenin kendine ait, dinamik olarak yüklenip dökümana eklenen CSS/HTML/JS dosyaları vardır. Yani, her projede değişkenler eşşsiz tanımlanmalıdır. "projeBir-ok" gibi.

Bir proje eklemek için, klasöre projenin CSS/HTML/JS dosyalarını koymak yeterlidir. Hepsine aynı numara ve isim verilmeli. Bu kadar.

Bir projeyi kaldırmak için ise proje dosyaları silinmeli, ve diğer projelerin numaraları tekrar ayarlanmalıdır.

### Çeviri Nasıl Çalışır

commonAssets/languages klasörü altında dil dosyaları vardır. Dosyalar anahtar-değer çiftlerini içerirler. Şu şekilde;
```
	"cvDivText" : "cv things",
	"notesDivGreetings": "Leave a message!",
	"indexNotes" : "NOTES",
```

innerText özelliğine sahip elementler çeviri işlemine tabi tutulabilirler.<br>
Çevrilecek element ```translate``` sınıfına üye olmalı, ve ```data-translateKey=''``` özelliğine sahip olmalı.

Sonra, dil dosyaları okunduğunda, çeviri şu şekilde yapılır;
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

Nginx config dosyası; (Windows)

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

### Diğer Her Şey

Proje hakkındaki diğer her şey için kod incelenebilir. Kod kendini anlatıyor yeterince. (umarım)

## Tartışma

Burada, fikrimce, proje hakkında neler yanlış oldu ve neler daha iyi olabilirdi onu konuşmak istiyorum.

#### Design

Görünüşe göre dizaynı benden başka kimse beğenmiyor. Bu konuda fikir ayrılığına karar kılalım.

#### Mobil Alt Domaini Gerekli Mi?

İnaniyorum ki hayır. Masaüstü versiyonu mobil cihazlar için yeterince responsive olabilirdi. Yalnızca projelerin animasyonu uygun olmazdı. Fakat mobil kullanıcılar için başka bir "projectsDiv" oluşuturulabilir ve javascript ile gösterilebilirdi.

O halde neden yapmadım? Çok uğraştırırdı.

#### Site Yeterince Responsive Mi?

Kesinlikle hayır. Front end kısmında çok fazla hata yaptım. Hatalarımın farkına proje halihazırda bittiğinde vardım. Artık hataları düzeltmek projeyi baştan yapmaktan daha fazla iş olacağı için düzeltmeyeceğim.

## Deployment (benim durumum için)

Her şey için AWS'yi kullandım (Amazon Web Services).
- Bir EC2 / t2.micro x64-bit (x86) makinesini Canonical, Ubuntu, 22.04 LTS işletim sistemiyle başlattım.
- Nginx, Nodejs ve Npm'i sunucuya kurdum.
- Projeleri servera yükledim.
- Bir elastik ip adresi alıp, makineyle eşleştirdim.
- Domainimi aldım.
- Route53'ü yönlendirme için ayarladım.
- TLS (SSL) sertifikamı Let's Encrypt (Certbot) aracılığıyla edindim;<br>
https://letsencrypt.org/getting-started/ <br>
https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal

### Bana ve bazılarınıza ilerde yardımı dokunabilecek bazı komutlar ve bilgiler
EC2 makinesine olan SSH bağlantısını kesince, bağlantı süresince açılan processler kapanıyor. Kapanmamaları için şu komut kullanılıyor (node processleri için kullandım);
```
sudo nohup node index.js &
```
Nginx'i durdurmak / başlatmak için;
```
sudo systemctl stop nginx
sudo systemctl start nginx
```
Portları dinleyen processleri listelemek için;
```
sudo lsof -i -P -n | grep LISTEN
```
Ve son olarak, nihai nginx.config dosyam (Certbot'un otomatik olarak oluşturduğu);
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
