export default function ({ app, route }) {
  const lang = localStorage.getItem('lang');
      if (lang) 
          app.i18n.locale = lang;
      
}