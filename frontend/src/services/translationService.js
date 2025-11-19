import axios from 'axios';

// Translation service for backend integration
class TranslationService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
  }

  // Translate text using Google Translate API (backend)
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      const response = await axios.post(`${this.baseURL}/api/translate`, {
        text,
        targetLanguage,
        sourceLanguage
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      return response.data.translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  // Re-fetch diagnosis with translated content
  async getDiagnosisTranslated(diagnosisId, targetLanguage) {
    try {
      const response = await axios.get(`${this.baseURL}/api/diagnose/${diagnosisId}/translate`, {
        params: { language: targetLanguage },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      return response.data;
    } catch (error) {
      console.error('Translated diagnosis fetch failed:', error);
      throw error;
    }
  }

  // Get crops data in specified language
  async getCropsTranslated(targetLanguage) {
    try {
      const response = await axios.get(`${this.baseURL}/api/crops`, {
        params: { language: targetLanguage },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      return response.data;
    } catch (error) {
      console.error('Translated crops fetch failed:', error);
      throw error;
    }
  }

  // Get history with translations
  async getHistoryTranslated(targetLanguage) {
    try {
      const response = await axios.get(`${this.baseURL}/api/history`, {
        params: { language: targetLanguage },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      return response.data;
    } catch (error) {
      console.error('Translated history fetch failed:', error);
      throw error;
    }
  }
}

export default new TranslationService();