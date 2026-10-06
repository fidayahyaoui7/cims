/**
 * Normalise un numéro de téléphone tunisien
 * @param {string} phoneNumber - Le numéro de téléphone à normaliser
 * @returns {string} Le numéro de téléphone normalisé
 */
export const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Supprimer tous les caractères non numériques
  let normalized = phoneNumber.toString().replace(/\D/g, '');
  
  // Si le numéro commence par 00, le remplacer par +
  if (normalized.startsWith('00')) {
    normalized = `+${normalized.substring(2)}`;
  }
  
  // Si le numéro commence par +216 (indicatif international de la Tunisie)
  if (normalized.startsWith('+216')) {
    return normalized;
  }
  
  // Si le numéro commence par 216 (indicatif international sans le +)
  if (normalized.startsWith('216')) {
    return `+${normalized}`;
  }
  
  // Si le numéro commence par 0 (numéro national)
  if (normalized.startsWith('0')) {
    return `+216${normalized.substring(1)}`;
  }
  
  // Si le numéro commence par 9, 2, 5, 7 ou 9 (premiers chiffres des numéros tunisiens)
  if (/^[9257]/.test(normalized)) {
    return `+216${normalized}`;
  }
  
  // Si le numéro a 8 chiffres, on suppose que c'est un numéro fixe tunisien
  if (normalized.length === 8) {
    return `+216${normalized}`;
  }
  
  // Si le numéro a 10 chiffres et commence par 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
  if (normalized.length === 10 && /^(20|2[1-9]|[5-9][0-9])/.test(normalized)) {
    return `+216${normalized}`;
  }
  
  // Si le numéro a 11 chiffres et commence par 0, on supprime le 0 et on ajoute +216
  if (normalized.length === 11 && normalized.startsWith('0')) {
    return `+216${normalized.substring(1)}`;
  }
  
  // Si le numéro a 12 chiffres et commence par 216, on ajoute le +
  if (normalized.length === 12 && normalized.startsWith('216')) {
    return `+${normalized}`;
  }
  
  // Si le numéro a 13 chiffres et commence par 00216, on remplace 00 par +
  if (normalized.length === 13 && normalized.startsWith('00216')) {
    return `+${normalized.substring(2)}`;
  }
  
  // Si aucun des cas ci-dessus ne correspond, on retourne le numéro tel quel
  return normalized;
};

/**
 * Formate un numéro de téléphone pour l'affichage
 * @param {string} phoneNumber - Le numéro de téléphone à formater
 * @returns {string} Le numéro de téléphone formaté
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Normaliser d'abord le numéro
  const normalized = normalizePhoneNumber(phoneNumber);
  
  // Si le numéro commence par +216 (format international tunisien)
  if (normalized.startsWith('+216')) {
    const rest = normalized.substring(4);
    
    // Format pour les numéros mobiles (9X, 5X, 2X, 7X)
    if (/^[9257]/.test(rest)) {
      if (rest.length === 8) {
        return `${normalized.substring(0, 4)} ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4, 6)} ${rest.substring(6)}`;
      }
      return `${normalized.substring(0, 4)} ${rest}`;
    }
    
    // Format pour les numéros fixes (7 ou 8 chiffres)
    if (rest.length === 7) {
      return `${normalized.substring(0, 4)} ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
    }
    
    if (rest.length === 8) {
      return `${normalized.substring(0, 4)} ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
    }
    
    return normalized;
  }
  
  // Si le numéro ne commence pas par +216, on le retourne tel quel
  return phoneNumber;
};

/**
 * Vérifie si un numéro de téléphone est un numéro de téléphone tunisien valide
 * @param {string} phoneNumber - Le numéro de téléphone à vérifier
 * @returns {boolean} true si le numéro est valide, false sinon
 */
export const isValidTunisianPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  
  const normalized = normalizePhoneNumber(phoneNumber);
  
  // Vérifier si le numéro commence par +216 suivi de 8 chiffres
  if (/^\+216[0-9]{8}$/.test(normalized)) {
    const rest = normalized.substring(4);
    // Vérifier que le premier chiffre après +216 est 2, 4, 5, 7 ou 9
    return /^[24579]/.test(rest);
  }
  
  return false;
};

/**
 * Extrait les numéros de téléphone d'une chaîne de caractères
 * @param {string} text - Le texte contenant les numéros de téléphone
 * @returns {string[]} Un tableau des numéros de téléphone extraits
 */
export const extractPhoneNumbers = (text) => {
  if (!text) return [];
  
  // Expression régulière pour trouver les numéros de téléphone
  const phoneRegex = /(?:\+?216)?[\s.-]?[2-9][0-9]{7}|0[2-9][0-9]{7}/g;
  const matches = text.match(phoneRegex) || [];
  
  // Normaliser et dédupliquer les numéros
  const uniqueNumbers = [...new Set(matches.map(normalizePhoneNumber))];
  
  return uniqueNumbers;
};
