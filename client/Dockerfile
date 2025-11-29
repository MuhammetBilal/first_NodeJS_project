# 1. Node.js ortamını kur
FROM node:18

# 2. Çalışma klasörünü ayarla
WORKDIR /app

# 3. Paket listelerini kopyala ve yükle
COPY package*.json ./
RUN npm install

# 4. Tüm proje dosyalarını kopyala
COPY . .

# 5. Projeyi derle (Build al - dist klasörü oluşur)
RUN npm run build

# 6. Uygulamayı sunmak için basit bir sunucu (serve) yükle
RUN npm install -g serve

# 7. Portu dışarı aç (Vite varsayılanı 5173)
EXPOSE 5173

# 8. Uygulamayı başlat
CMD ["serve", "-s", "dist", "-l", "5173"]