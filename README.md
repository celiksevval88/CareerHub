# CareerHub

CareerHub, öğrencilerin özgeçmişlerini oluşturup staj ve iş ilanlarına başvurabildiği; şirketlerin ilan yayımlayıp başvuruları değerlendirebildiği bir kariyer platformudur.

## Kullanılan Teknolojiler

### Backend
- Java 21
- Spring Boot
- Spring Security ve JWT
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

### Frontend
- React
- JavaScript
- HTML ve CSS

## Temel Özellikler

### Öğrenci
- Üye olma ve giriş yapma
- E-posta doğrulama
- CV oluşturma ve görüntüleme
- CV'yi PDF olarak indirme
- İş ilanlarını görüntüleme ve başvuru yapma
- Başvuruların durumunu takip etme

### Şirket
- Şirket profili oluşturma
- İş ilanı yayımlama
- Öğrenci başvurularını görüntüleme
- Başvuru durumlarını güncelleme
- Başvurularla ilişkili CV'leri görüntüleme ve indirme

### Yönetici
- Kullanıcıları ve şirketleri görüntüleme
- Şirket onay durumlarını yönetme

## Proje Yapısı

- `src/`: Spring Boot backend kaynak kodları
- `careerhub-frontend/`: React frontend uygulaması
- `pom.xml`: Backend bağımlılıkları ve Maven yapılandırması

## Çalıştırma

Backend ve frontend ayrı terminallerde çalıştırılır.

### Backend

Projenin ana klasöründe:

```bash
.\mvnw.cmd spring-boot:run
```

Backend varsayılan olarak `http://localhost:8080` adresinde çalışır.

### Frontend

Frontend klasörüne geç:

```bash
cd careerhub-frontend
npm install
npm run dev
```

Geliştirme sunucusunun gösterdiği yerel adresi tarayıcıda aç.

## Veritabanı ve Ortam Değişkenleri

Uygulamanın çalışması için PostgreSQL kurulu olmalı ve `careerhub` veritabanı oluşturulmalıdır.

Veritabanı parolası, JWT anahtarı ve e-posta ayarları ortam değişkenleriyle yapılandırılır. Gerçek parolalar ve gizli anahtarlar kaynak koduna veya GitHub'a eklenmemelidir.

## Geliştirme

CareerHub, Java Spring Boot tabanlı REST API ve React tabanlı kullanıcı arayüzü kullanılarak geliştirilmiştir.
