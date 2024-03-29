# zekicaneksi.com

Kişisel portfolio web sitem.

### İçindekiler

<!--ts-->
   * [Proje Açıklaması](#proje-açıklaması)
      * [Kullanılan Kütüphaneler / Teknolojiler](#kullanılan-kütüphaneler--teknolojiler)
      * [Dizin Yapısı](#dizin-yapısı)
      * [Nasıl Proje Eklenir/Çıkarılır](#nasıl-proje-eklenirçıkarılır)
      * [Çeviri Nasıl Çalışır](#çeviri-nasıl-çalışır)
      * [Müzik Nasıl Eklenir/Çıkarılır](#müzik-nasıl-eklenirçıkarılır)
      * [Reverse Proxy](#reverse-proxy)
      * [Diğer Her Şey](#diğer-her-şey)
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

### Müzik Nasıl Eklenir/Çıkarılır

Eklenilmesi istenen müzik, commonAssets/music klasörüne özel harf içermeden, boşluk yerine '\_' çizgi kullanılarak atılmalı. <br>
Müzik çıkarmak için ise, istenmeyen müzik klasörden silinir.

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
