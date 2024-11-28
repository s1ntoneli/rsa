import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  zh: {
    translation: {
      keyManagement: {
        title: '密钥管理',
        generateNew: '生成新的密钥对',
        publicKey: '您的公钥：',
        downloadPrivate: '下载私钥',
        copyShareLink: '复制分享链接',
        success: {
          generated: '新的密钥对生成成功！',
          copied: '分享链接已复制到剪贴板！'
        },
        error: {
          generation: '生成密钥对失败'
        }
      }
    }
  },
  en: {
    translation: {
      keyManagement: {
        title: 'Key Management',
        generateNew: 'Generate New Key Pair',
        publicKey: 'Your Public Key:',
        downloadPrivate: 'Download Private Key',
        copyShareLink: 'Copy Share Link',
        success: {
          generated: 'New key pair generated successfully!',
          copied: 'Share link copied to clipboard!'
        },
        error: {
          generation: 'Failed to generate key pair'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false
    }
  });

export default i18n; 