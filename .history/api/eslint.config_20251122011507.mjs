import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    // Bu obje genel yapılandırmayı içerir.
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: [js.configs.recommended], 
    
    // UYARI: Bu ayar (globals.browser) korunmuştur, bu da Node.js ortam değişkenlerinin (require, module.exports) tanınmamasına neden olacaktır.
    languageOptions: { 
        globals: globals.browser 
    },
    
    // ✅ KURAL EKLENDİ: no-unused-vars
    rules: {
        "no-unused-vars": ["error", {
            // 'passport' ile başlayan tüm değişkenlerin kullanılsa bile hata vermemesini sağlar.
            "varsIgnorePattern": "^passport" 
        }],
    },
  },

]);