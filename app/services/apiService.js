// app/service/apiService.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.viaconsulting.mg/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // Augmenté pour la production
});

// Intercepteur pour le logging (seulement en développement)
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
      return config;
    },
    (error) => {
      console.error('❌ Erreur requête API:', error);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log(`✅ ${response.status} ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error(`❌ Erreur ${error.response?.status} ${error.config?.url}:`, error.response?.data);
      return Promise.reject(error);
    }
  );
}

export const apiService = {
  // Receptions
  async getReceptions() {
    const response = await apiClient.get('/receptions');
    return response.data;
  },

  async createReception(data) {
    const response = await apiClient.post('/receptions', data);
    return response.data;
  },

  async getReception(id) {
    const response = await apiClient.get(`/receptions/${id}`);
    return response.data;
  },

  async updateReception(id, data) {
    const response = await apiClient.put(`/receptions/${id}`, data);
    return response.data;
  },

  async deleteReception(id) {
    const response = await apiClient.delete(`/receptions/${id}`);
    return response.data;
  },

  async getReceptionTransitions(id) {
    const response = await apiClient.get(`/receptions/${id}/transitions`);
    return response.data;
  },

  async marquerCommeLivre(id) {
    try {
      const response = await apiClient.post(`/receptions/${id}/livrer`);
      console.log(`✅ Réception ${id} marquée comme livrée`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur lors du marquage comme livré pour réception ${id}:`, error);
      throw error;
    }
  },

  // Facturations
  async getFacturations() {
    const response = await apiClient.get('/facturations');
    return response.data;
  },

  async createFacturation(data) {
    // NE PAS calculer le statut côté frontend - Le backend gère la logique métier
    const formattedData = {
      reception_id: data.reception_id,
      date_paiement: data.date_paiement,
      numero_facture: data.numero_facture,
      designation: data.designation,
      encaissement: data.encaissement,
      prix_unitaire: parseFloat(data.prix_unitaire) || 0,
      quantite: parseFloat(data.quantite) || 0,
      paiement_avance: parseFloat(data.paiement_avance) || 0,
      montant_paye: parseFloat(data.montant_paye) || 0,
    };
    
    const response = await apiClient.post('/facturations', formattedData);
    return response.data;
  },

  async getFacturation(id) {
    const response = await apiClient.get(`/facturations/${id}`);
    return response.data;
  },

  async updateFacturation(id, data) {
    const response = await apiClient.put(`/facturations/${id}`, data);
    return response.data;
  },

  async deleteFacturation(id) {
    const response = await apiClient.delete(`/facturations/${id}`);
    return response.data;
  },

  async checkFacturationReception(receptionId) {
    const response = await apiClient.get(`/facturations/check-reception/${receptionId}`);
    return response.data;
  },

  async getFacturationsByStatus(status) {
    const response = await apiClient.get(`/facturations/status/${status}`);
    return response.data;
  },

  // Impayes
  async getImpayes() {
    const response = await apiClient.get('/impayes');
    return response.data;
  },

  async createImpaye(data) {
    // Formater les données pour correspondre à la validation backend
    const formattedData = {
      reception_id: data.reception_id,
      date_paiement: data.date_paiement,
      numero_facture: data.numero_facture,
      designation: data.designation,
      encaissement: data.encaissement,
      prix_unitaire: parseFloat(data.prix_unitaire) || 0,
      quantite: parseFloat(data.quantite) || 0,
      montant_paye: parseFloat(data.montant_paye) || 0,
    };

    console.log('📤 Données envoyées à /impayes:', formattedData);
    
    const response = await apiClient.post('/impayes', formattedData);
    return response.data;
  },

  async getImpaye(id) {
    const response = await apiClient.get(`/impayes/${id}`);
    return response.data;
  },

  async updateImpaye(id, data) {
    const formattedData = {
      date_paiement: data.date_paiement,
      numero_facture: data.numero_facture,
      designation: data.designation,
      encaissement: data.encaissement,
      prix_unitaire: data.prix_unitaire !== undefined ? parseFloat(data.prix_unitaire) : undefined,
      quantite: data.quantite !== undefined ? parseFloat(data.quantite) : undefined,
      montant_paye: data.montant_paye !== undefined ? parseFloat(data.montant_paye) : undefined,
    };

    // Supprimer les champs undefined
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined) {
        delete formattedData[key];
      }
    });

    const response = await apiClient.put(`/impayes/${id}`, formattedData);
    return response.data;
  },

  async deleteImpaye(id) {
    const response = await apiClient.delete(`/impayes/${id}`);
    return response.data;
  },

  async checkImpayeReception(receptionId) {
    const response = await apiClient.get(`/impayes/check-reception/${receptionId}`);
    return response.data;
  },

  // Fiche Livraisons
  async getFicheLivraisons() {
    const response = await apiClient.get('/fiche-livraisons');
    return response.data;
  },

  async createFicheLivraison(data) {
    const formattedData = {
      reception_id: data.reception_id,
      date_livraison: data.date_livraison,
      lieu_depart: data.lieu_depart,
      destination: data.destination,
      livreur_nom: data.livreur_nom,
      livreur_prenom: data.livreur_prenom,
      livreur_telephone: data.livreur_telephone,
      livreur_vehicule: data.livreur_vehicule,
      destinateur_nom: data.destinateur_nom,
      destinateur_prenom: data.destinateur_prenom,
      destinateur_fonction: data.destinateur_fonction,
      destinateur_contact: data.destinateur_contact,
      type_produit: data.type_produit,
      poids_net: parseFloat(data.poids_net) || 0,
      ristourne_regionale: parseFloat(data.ristourne_regionale) || 0,
      ristourne_communale: parseFloat(data.ristourne_communale) || 0,
      prix_unitaire: parseFloat(data.prix_unitaire) || 0,
      quantite_a_livrer: parseFloat(data.quantite_a_livrer) || 0,
    };

    const response = await apiClient.post('/fiche-livraisons', formattedData);
    return response.data;
  },

  async getFicheLivraison(id) {
    const response = await apiClient.get(`/fiche-livraisons/${id}`);
    return response.data;
  },

  async updateFicheLivraison(id, data) {
    const response = await apiClient.put(`/fiche-livraisons/${id}`, data);
    return response.data;
  },

  async deleteFicheLivraison(id) {
    const response = await apiClient.delete(`/fiche-livraisons/${id}`);
    return response.data;
  },

  // Méthodes utilitaires
  async getReceptionSolde(id) {
    try {
      const response = await apiClient.get(`/impayes/check-reception/${id}`);
      return response.data;
    } catch (error) {
      // Si l'endpoint n'existe pas, retourner un objet vide
      if (error.response?.status === 404) {
        return { exists: false, data: null, calculs: null };
      }
      throw error;
    }
  },

  // Méthode pour formater les nombres en Ariary
  formatAriary(amount) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' Ar';
  },

  // Méthode pour valider les données avant envoi
  validateImpayeData(data) {
    const errors = [];
    
    if (!data.reception_id) errors.push('Reception ID est requis');
    if (!data.date_paiement) errors.push('Date de paiement est requise');
    if (!data.numero_facture) errors.push('Numéro de facture est requis');
    if (!data.designation) errors.push('Désignation est requise');
    if (!data.encaissement) errors.push('Encaissement est requis');
    if (!data.prix_unitaire || data.prix_unitaire <= 0) errors.push('Prix unitaire doit être positif');
    if (!data.quantite || data.quantite <= 0) errors.push('Quantité doit être positive');
    if (!data.montant_paye || data.montant_paye < 0) errors.push('Montant payé doit être positif ou zéro');

    // Validation du montant payé vs prix total
    const prixTotal = (parseFloat(data.prix_unitaire) || 0) * (parseFloat(data.quantite) || 0);
    const montantPaye = parseFloat(data.montant_paye) || 0;
    
    if (montantPaye > prixTotal) {
      errors.push(`Le montant payé (${this.formatAriary(montantPaye)}) ne peut pas dépasser le prix total (${this.formatAriary(prixTotal)})`);
    }

    return errors;
  },

  validateFacturationData(data) {
    const errors = [];
    
    if (!data.reception_id) errors.push('Reception ID est requis');
    if (!data.date_paiement) errors.push('Date de paiement est requise');
    if (!data.numero_facture) errors.push('Numéro de facture est requis');
    if (!data.designation) errors.push('Désignation est requise');
    if (!data.encaissement) errors.push('Encaissement est requis');
    if (!data.prix_unitaire || data.prix_unitaire <= 0) errors.push('Prix unitaire doit être positif');
    if (!data.quantite || data.quantite <= 0) errors.push('Quantité doit être positive');
    if (!data.paiement_avance || data.paiement_avance < 0) errors.push('Paiement d\'avance doit être positif ou zéro');
    if (!data.montant_paye || data.montant_paye < 0) errors.push('Montant payé doit être positif ou zéro');

    // Validation des montants
    const prixTotal = (parseFloat(data.prix_unitaire) || 0) * (parseFloat(data.quantite) || 0);
    const montantPaye = parseFloat(data.montant_paye) || 0;
    const paiementAvance = parseFloat(data.paiement_avance) || 0;
    
    if (montantPaye > prixTotal) {
      errors.push(`Le montant payé (${this.formatAriary(montantPaye)}) ne peut pas dépasser le prix total (${this.formatAriary(prixTotal)})`);
    }

    if (paiementAvance > montantPaye) {
      errors.push(`Le paiement d'avance (${this.formatAriary(paiementAvance)}) ne peut pas dépasser le montant payé (${this.formatAriary(montantPaye)})`);
    }

    return errors;
  }
};

export default apiService;
