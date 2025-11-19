import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translatedData, setTranslatedData] = useState({});

  // Function to translate text using backend API
  const translateText = async (text, targetLanguage = currentLanguage) => {
    if (targetLanguage === 'en' || !text) return text;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          text,
          targetLanguage
        })
      });

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  };

  // Function to translate diagnosis results
  const translateDiagnosis = async (diagnosis, targetLanguage = currentLanguage) => {
    if (targetLanguage === 'en') return diagnosis;

    try {
      const translatedExplanation = await translateText(diagnosis.explanation, targetLanguage);
      const translatedDisease = await translateText(diagnosis.disease.replace(/_/g, ' '), targetLanguage);

      return {
        ...diagnosis,
        explanation: translatedExplanation,
        disease: translatedDisease,
        originalDisease: diagnosis.disease,
        originalExplanation: diagnosis.explanation
      };
    } catch (error) {
      console.error('Diagnosis translation failed:', error);
      return diagnosis;
    }
  };

  // Function to handle language change
  const changeLanguage = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    // Clear translated data cache when language changes
    setTranslatedData({});
  };

  const value = {
    currentLanguage,
    changeLanguage,
    translateText,
    translateDiagnosis,
    translatedData,
    setTranslatedData
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;