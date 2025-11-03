// context/ReceptionsContext.tsx
"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../app/services/apiService';

// Interfaces (inchangées)
interface Reception {
  id: number;
  type: string;
  dateHeure: string;
  designation: string;
  provenance: string;
  nom_fournisseur: string;
  prenom_fournisseur: string;
  id_fiscale: string;
  localisation: string;
  contact: string;
  poids_brut: number | null;
  poids_net: number | null;
  unite: string;
  poids_packaging?: number | null;
  taux_dessiccation?: number | null;
  taux_humidite_fg?: number | null;
  poids_agreé?: number | null;
  densite?: number | null;
  taux_humidite_cg?: number | null;
  statut: string;
  created_at?: string;
  updated_at?: string;
}

interface Facturation {
  id: number;
  reception_id: number;
  date_paiement: string;
  numero_facture: string;
  designation: string;
  encaissement: string;
  prix_unitaire: number;
  quantite: number;
  paiement_avance: number;
  montant_paye: number;
  created_at?: string;
  updated_at?: string;
}

interface Impaye {
  id: number;
  reception_id: number;
  date_paiement: string;
  numero_facture: string;
  designation: string;
  encaissement: string;
  prix_unitaire: number;
  quantite: number;
  montant_paye: number;
  created_at?: string;
  updated_at?: string;
  // Ajouter les calculs retournés par le backend
  calculs?: {
    prix_total: number;
    reste_a_payer: number;
    solde_impaye: number;
    paiement_complet: boolean;
  };
}
interface ReceptionsState {
  receptions: Reception[];
  facturations: Facturation[];
  impayes: Impaye[];
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
}

interface ReceptionsContextType extends ReceptionsState {
  refetch: () => Promise<void>;
  createReception: (data: any) => Promise<Reception>;
  updateReception: (id: number, data: any) => Promise<Reception>;
  deleteReception: (id: number) => Promise<void>;
  createFacturation: (data: any) => Promise<Facturation>;
  updateFacturation: (id: number, data: any) => Promise<Facturation>;
  deleteFacturation: (id: number) => Promise<void>;
  createImpaye: (data: any) => Promise<Impaye>;
  updateImpaye: (id: number, data: any) => Promise<Impaye>;
  deleteImpaye: (id: number) => Promise<void>;
  getReceptionSolde: (id: number) => Promise<any>;
  getReceptionTransitions: (id: number) => Promise<any>;
  checkImpayeReception: (receptionId: number) => Promise<any>;
  createFicheLivraison: (data: any) => Promise<any>;
  updateFicheLivraison: (id: number, data: any) => Promise<any>;
  deleteFicheLivraison: (id: number) => Promise<void>;
  marquerCommeLivre: (id: number) => Promise<void>; // Nouvelle méthode
}

// État initial et actions (inchangés)
const initialState: ReceptionsState = {
  receptions: [],
  facturations: [],
  impayes: [],
  loading: false,
  initialLoading: true,
  error: null
};

const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_INITIAL_LOADING: 'SET_INITIAL_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_RECEPTIONS: 'SET_RECEPTIONS',
  ADD_RECEPTION: 'ADD_RECEPTION',
  UPDATE_RECEPTION: 'UPDATE_RECEPTION',
  DELETE_RECEPTION: 'DELETE_RECEPTION',
  SET_FACTURATIONS: 'SET_FACTURATIONS',
  ADD_FACTURATION: 'ADD_FACTURATION',
  UPDATE_FACTURATION: 'UPDATE_FACTURATION',
  DELETE_FACTURATION: 'DELETE_FACTURATION',
  SET_IMPAYES: 'SET_IMPAYES',
  ADD_IMPAYE: 'ADD_IMPAYE',
  UPDATE_IMPAYE: 'UPDATE_IMPAYE',
  DELETE_IMPAYE: 'DELETE_IMPAYE',
  UPDATE_RECEPTION_STATUS: 'UPDATE_RECEPTION_STATUS'
} as const;

type Action = 
  | { type: typeof ACTION_TYPES.SET_LOADING; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_INITIAL_LOADING; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_ERROR; payload: string | null }
  | { type: typeof ACTION_TYPES.SET_RECEPTIONS; payload: Reception[] }
  | { type: typeof ACTION_TYPES.ADD_RECEPTION; payload: Reception }
  | { type: typeof ACTION_TYPES.UPDATE_RECEPTION; payload: Reception }
  | { type: typeof ACTION_TYPES.DELETE_RECEPTION; payload: number }
  | { type: typeof ACTION_TYPES.SET_FACTURATIONS; payload: Facturation[] }
  | { type: typeof ACTION_TYPES.ADD_FACTURATION; payload: Facturation }
  | { type: typeof ACTION_TYPES.UPDATE_FACTURATION; payload: Facturation }
  | { type: typeof ACTION_TYPES.DELETE_FACTURATION; payload: number }
  | { type: typeof ACTION_TYPES.SET_IMPAYES; payload: Impaye[] }
  | { type: typeof ACTION_TYPES.ADD_IMPAYE; payload: Impaye }
  | { type: typeof ACTION_TYPES.UPDATE_IMPAYE; payload: Impaye }
  | { type: typeof ACTION_TYPES.DELETE_IMPAYE; payload: number }
  | { type: typeof ACTION_TYPES.UPDATE_RECEPTION_STATUS; payload: { receptionId: number; statut: string } };

// Reducer (inchangé)
const receptionsReducer = (state: ReceptionsState, action: Action): ReceptionsState => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTION_TYPES.SET_INITIAL_LOADING:
      return { ...state, initialLoading: action.payload };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false, initialLoading: false };
    case ACTION_TYPES.SET_RECEPTIONS:
      return { ...state, receptions: action.payload, loading: false, initialLoading: false, error: null };
    case ACTION_TYPES.ADD_RECEPTION:
      return { ...state, receptions: [action.payload, ...state.receptions], loading: false, error: null };
    case ACTION_TYPES.UPDATE_RECEPTION:
      return { ...state, receptions: state.receptions.map(item => item.id === action.payload.id ? action.payload : item), loading: false, error: null };
    case ACTION_TYPES.DELETE_RECEPTION:
      return { ...state, receptions: state.receptions.filter(item => item.id !== action.payload), loading: false, error: null };
    case ACTION_TYPES.SET_FACTURATIONS:
      return { ...state, facturations: action.payload, loading: false, error: null };
    case ACTION_TYPES.ADD_FACTURATION:
      return { ...state, facturations: [action.payload, ...state.facturations], loading: false, error: null };
    case ACTION_TYPES.UPDATE_FACTURATION:
      return { ...state, facturations: state.facturations.map(item => item.id === action.payload.id ? action.payload : item), loading: false, error: null };
    case ACTION_TYPES.DELETE_FACTURATION:
      return { ...state, facturations: state.facturations.filter(item => item.id !== action.payload), loading: false, error: null };
    case ACTION_TYPES.SET_IMPAYES:
      return { ...state, impayes: action.payload, loading: false, error: null };
    case ACTION_TYPES.ADD_IMPAYE:
      return { ...state, impayes: [action.payload, ...state.impayes], loading: false, error: null };
    case ACTION_TYPES.UPDATE_IMPAYE:
      return { ...state, impayes: state.impayes.map(item => item.id === action.payload.id ? action.payload : item), loading: false, error: null };
    case ACTION_TYPES.DELETE_IMPAYE:
      return { ...state, impayes: state.impayes.filter(item => item.id !== action.payload), loading: false, error: null };
    case ACTION_TYPES.UPDATE_RECEPTION_STATUS:
      return { ...state, receptions: state.receptions.map(item => item.id === action.payload.receptionId ? { ...item, statut: action.payload.statut } : item), loading: false, error: null };
    default:
      return state;
  }
};

const ReceptionsContext = createContext<ReceptionsContextType | undefined>(undefined);

export const ReceptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(receptionsReducer, initialState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const [receptionsResponse, facturationsResponse, impayesResponse] = await Promise.all([
        apiService.getReceptions(),
        apiService.getFacturations(),
        apiService.getImpayes()
      ]);

      let receptionsData: Reception[] = [];
      let facturationsData: Facturation[] = [];
      let impayesData: Impaye[] = [];

      if (Array.isArray(receptionsResponse)) {
        receptionsData = receptionsResponse;
      } else if (receptionsResponse && typeof receptionsResponse === 'object') {
        if (Array.isArray(receptionsResponse.data)) {
          receptionsData = receptionsResponse.data;
        } else if (receptionsResponse.data) {
          receptionsData = [receptionsResponse.data];
        } else if (Array.isArray(receptionsResponse.receptions)) {
          receptionsData = receptionsResponse.receptions;
        }
      }

      if (Array.isArray(facturationsResponse)) {
        facturationsData = facturationsResponse;
      } else if (facturationsResponse && typeof facturationsResponse === 'object') {
        if (Array.isArray(facturationsResponse.data)) {
          facturationsData = facturationsResponse.data;
        } else if (facturationsResponse.data) {
          facturationsData = [facturationsResponse.data];
        } else if (Array.isArray(facturationsResponse.facturations)) {
          facturationsData = facturationsResponse.facturations;
        }
      }

      if (Array.isArray(impayesResponse)) {
        impayesData = impayesResponse;
      } else if (impayesResponse && typeof impayesResponse === 'object') {
        if (Array.isArray(impayesResponse.data)) {
          impayesData = impayesResponse.data;
        } else if (impayesResponse.data) {
          impayesData = [impayesResponse.data];
        } else if (Array.isArray(impayesResponse.impayes)) {
          impayesData = impayesResponse.impayes;
        }
      }

      dispatch({ type: ACTION_TYPES.SET_RECEPTIONS, payload: receptionsData });
      dispatch({ type: ACTION_TYPES.SET_FACTURATIONS, payload: facturationsData });
      dispatch({ type: ACTION_TYPES.SET_IMPAYES, payload: impayesData });
    } catch (err) {
      dispatch({ 
        type: ACTION_TYPES.SET_ERROR, 
        payload: (err as Error).message || 'Erreur lors du chargement des données' 
      });
    }
  };

  const createReception = async (receptionData: any): Promise<Reception> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const newReceptionFromApi = await apiService.createReception(receptionData);

      const newReception: Reception = {
        id: newReceptionFromApi.id || 0,
        type: newReceptionFromApi.type || receptionData.type || '',
        dateHeure: newReceptionFromApi.dateHeure || receptionData.dateHeure || new Date().toISOString().slice(0, 19).replace('T', ' '),
        designation: newReceptionFromApi.designation || receptionData.designation || '',
        provenance: newReceptionFromApi.provenance || receptionData.provenance || '',
        nom_fournisseur: newReceptionFromApi.nom_fournisseur || receptionData.nom_fournisseur || '',
        prenom_fournisseur: newReceptionFromApi.prenom_fournisseur || receptionData.prenom_fournisseur || '',
        id_fiscale: newReceptionFromApi.id_fiscale || receptionData.id_fiscale || '',
        localisation: newReceptionFromApi.localisation || receptionData.localisation || '',
        contact: newReceptionFromApi.contact || receptionData.contact || '',
        poids_brut: newReceptionFromApi.poids_brut !== undefined ? newReceptionFromApi.poids_brut : receptionData.poids_brut || null,
        poids_net: newReceptionFromApi.poids_net !== undefined ? newReceptionFromApi.poids_net : receptionData.poids_net || null,
        unite: newReceptionFromApi.unite || receptionData.unite || 'Kg',
        poids_packaging: newReceptionFromApi.poids_packaging !== undefined ? newReceptionFromApi.poids_packaging : receptionData.poids_packaging || null,
        taux_dessiccation: newReceptionFromApi.taux_dessiccation !== undefined ? newReceptionFromApi.taux_dessiccation : receptionData.taux_dessiccation || null,
        taux_humidite_fg: newReceptionFromApi.taux_humidite_fg !== undefined ? newReceptionFromApi.taux_humidite_fg : receptionData.taux_humidite_fg || null,
        poids_agreé: newReceptionFromApi.poids_agreé !== undefined ? newReceptionFromApi.poids_agreé : receptionData.poids_agreé || null,
        densite: newReceptionFromApi.densite !== undefined ? newReceptionFromApi.densite : receptionData.densite || null,
        taux_humidite_cg: newReceptionFromApi.taux_humidite_cg !== undefined ? newReceptionFromApi.taux_humidite_cg : receptionData.taux_humidite_cg || null,
        statut: newReceptionFromApi.statut || 'Non payé',
        created_at: newReceptionFromApi.created_at || new Date().toISOString(),
        updated_at: newReceptionFromApi.updated_at || new Date().toISOString(),
      };

      dispatch({ type: ACTION_TYPES.ADD_RECEPTION, payload: newReception });
      return newReception;
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
      throw err;
    }
  };

  const updateReception = async (id: number, data: any): Promise<Reception> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const updatedReception = await apiService.updateReception(id, data);
      dispatch({ type: ACTION_TYPES.UPDATE_RECEPTION, payload: updatedReception });
      return updatedReception;
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
      throw err;
    }
  };

  const deleteReception = async (id: number): Promise<void> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      await apiService.deleteReception(id);
      dispatch({ type: ACTION_TYPES.DELETE_RECEPTION, payload: id });
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
      throw err;
    }
  };

  // FACTURATION - NE FAIT AUCUN CALCUL DE STATUT
  const createFacturation = async (facturationData: any): Promise<Facturation> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      // ENVOI SIMPLE AU BACKEND - LE BACKEND CALCULE LE STATUT
      const newFacturationFromApi = await apiService.createFacturation(facturationData);

      const newFacturation: Facturation = {
        id: newFacturationFromApi.id || 0,
        reception_id: newFacturationFromApi.reception_id || facturationData.reception_id || 0,
        date_paiement: newFacturationFromApi.date_paiement || facturationData.date_paiement || new Date().toISOString().slice(0, 10),
        numero_facture: newFacturationFromApi.numero_facture || facturationData.numero_facture || '',
        designation: newFacturationFromApi.designation || facturationData.designation || '',
        encaissement: newFacturationFromApi.encaissement || facturationData.encaissement || '',
        prix_unitaire: newFacturationFromApi.prix_unitaire !== undefined ? newFacturationFromApi.prix_unitaire : facturationData.prix_unitaire || 0,
        quantite: newFacturationFromApi.quantite !== undefined ? newFacturationFromApi.quantite : facturationData.quantite || 0,
        paiement_avance: newFacturationFromApi.paiement_avance !== undefined ? newFacturationFromApi.paiement_avance : facturationData.paiement_avance || 0,
        montant_paye: newFacturationFromApi.montant_paye !== undefined ? newFacturationFromApi.montant_paye : facturationData.montant_paye || 0,
        created_at: newFacturationFromApi.created_at || new Date().toISOString(),
        updated_at: newFacturationFromApi.updated_at || new Date().toISOString(),
      };

      dispatch({ type: ACTION_TYPES.ADD_FACTURATION, payload: newFacturation });
      
      // RAFRAÎCHIR POUR RÉCUPÉRER LE VRAI STATUT CALCULÉ PAR LE BACKEND
      await fetchData();
      
      return newFacturation;
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
      throw err;
    }
  };

  const updateFacturation = async (id: number, data: any): Promise<Facturation> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const updatedFacturation = await apiService.updateFacturation(id, data);
      dispatch({ type: ACTION_TYPES.UPDATE_FACTURATION, payload: updatedFacturation });
      await fetchData();
      return updatedFacturation;
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
      throw err;
    }
  };

  const deleteFacturation = async (id: number): Promise<void> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      await apiService.deleteFacturation(id);
      dispatch({ type: ACTION_TYPES.DELETE_FACTURATION, payload: id });
      await fetchData();
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
      throw err;
    }
  };

// context/ReceptionsContext.tsx

// Dans la fonction createImpaye, ajouter un log pour debugger
const createImpaye = async (impayeData: any): Promise<Impaye> => {
  dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
  try {
    console.log('🔄 Création impayé - Données:', impayeData);
    
    const response = await apiService.createImpaye(impayeData);
    console.log('✅ Réponse complète backend:', response);

    // Gérer la structure de réponse du backend
    const newImpayeFromApi = response.data || response;
    
    const newImpaye: Impaye = {
      id: newImpayeFromApi.id || 0,
      reception_id: newImpayeFromApi.reception_id || impayeData.reception_id || 0,
      date_paiement: newImpayeFromApi.date_paiement || impayeData.date_paiement || new Date().toISOString().slice(0, 10),
      numero_facture: newImpayeFromApi.numero_facture || impayeData.numero_facture || '',
      designation: newImpayeFromApi.designation || impayeData.designation || '',
      encaissement: newImpayeFromApi.encaissement || impayeData.encaissement || '',
      prix_unitaire: newImpayeFromApi.prix_unitaire !== undefined ? newImpayeFromApi.prix_unitaire : impayeData.prix_unitaire || 0,
      quantite: newImpayeFromApi.quantite !== undefined ? newImpayeFromApi.quantite : impayeData.quantite || 0,
      montant_paye: newImpayeFromApi.montant_paye !== undefined ? newImpayeFromApi.montant_paye : impayeData.montant_paye || 0,
      created_at: newImpayeFromApi.created_at || new Date().toISOString(),
      updated_at: newImpayeFromApi.updated_at || new Date().toISOString(),
      calculs: response.calculs || newImpayeFromApi.calculs
    };

    dispatch({ type: ACTION_TYPES.ADD_IMPAYE, payload: newImpaye });
    
    // Mettre à jour le statut de la réception
    if (response.statut_reception) {
      dispatch({ 
        type: ACTION_TYPES.UPDATE_RECEPTION_STATUS, 
        payload: { 
          receptionId: newImpaye.reception_id, 
          statut: response.statut_reception 
        }
      });
    }
    
    return newImpaye;
  } catch (err: any) {
    console.error('❌ Erreur création impayé:', err);
    
    // Gestion améliorée des erreurs de validation
    let errorMessage = (err as Error).message;
    if (err.response?.data?.errors) {
      errorMessage = Object.values(err.response.data.errors).flat().join(', ');
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

const updateImpaye = async (id: number, data: any): Promise<Impaye> => {
  dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
  try {
    const response = await apiService.updateImpaye(id, data);
    const updatedImpayeFromApi = response.data || response;
    
    const updatedImpaye: Impaye = {
      ...updatedImpayeFromApi,
      calculs: response.calculs || updatedImpayeFromApi.calculs
    };

    dispatch({ type: ACTION_TYPES.UPDATE_IMPAYE, payload: updatedImpaye });
    
    // Mettre à jour le statut de la réception
    if (response.statut_reception) {
      dispatch({ 
        type: ACTION_TYPES.UPDATE_RECEPTION_STATUS, 
        payload: { 
          receptionId: updatedImpaye.reception_id, 
          statut: response.statut_reception 
        }
      });
    }
    
    return updatedImpaye;
  } catch (err: any) {
    let errorMessage = (err as Error).message;
    if (err.response?.data?.errors) {
      errorMessage = Object.values(err.response.data.errors).flat().join(', ');
    }
    
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
    throw new Error(errorMessage);
  }
};
const getReceptionTransitions = async (id: number): Promise<any> => {
  try {
    const response = await apiService.getReceptionTransitions(id);
    return response.data || response;
  } catch (err) {
    console.error("Erreur lors de la récupération des transitions:", err);
    throw err;
  }
};
const checkImpayeReception = async (receptionId: number): Promise<any> => {
  try {
    const response = await apiService.checkImpayeReception(receptionId);
    return response;
  } catch (err) {
    console.error("Erreur lors de la vérification de l'impayé:", err);
    // Retourner un objet par défaut si l'endpoint n'existe pas
    return { exists: false, data: null, calculs: null };
  }
};
  const deleteImpaye = async (id: number): Promise<void> => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      await apiService.deleteImpaye(id);
      dispatch({ type: ACTION_TYPES.DELETE_IMPAYE, payload: id });
      await fetchData();
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
      throw err;
    }
  };
  const getReceptionSolde = async (id: number): Promise<any> => {
  try {
    const response = await apiService.getReceptionSolde(id);
    return response.data;
  } catch (err) {
    console.error("Erreur lors de la récupération du solde:", err);
    throw err;
  }
};

const createFicheLivraison = async (data: any): Promise<any> => {
  dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
  try {
    const response = await apiService.createFicheLivraison(data);
    
    // Rafraîchir les données pour récupérer le nouveau statut
    await fetchData();
    
    return response;
  } catch (err) {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
    throw err;
  }
};

const updateFicheLivraison = async (id: number, data: any): Promise<any> => {
  dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
  try {
    const response = await apiService.updateFicheLivraison(id, data);
    
    // Rafraîchir les données
    await fetchData();
    
    return response;
  } catch (err) {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
    throw err;
  }
};

const deleteFicheLivraison = async (id: number): Promise<void> => {
  dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
  try {
    await apiService.deleteFicheLivraison(id);
    
    // Rafraîchir les données
    await fetchData();
  } catch (err) {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
    throw err;
  }
};

const marquerCommeLivre = async (id: number): Promise<void> => {
  dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
  try {
    await apiService.marquerCommeLivre(id);
    dispatch({ 
      type: ACTION_TYPES.UPDATE_RECEPTION_STATUS, 
      payload: { receptionId: id, statut: 'Livré' }
    });
  } catch (err) {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: (err as Error).message });
    throw err;
  }
};

  const value: ReceptionsContextType = {
    ...state,
    refetch: fetchData,
    createReception,
    updateReception,
    deleteReception,
    createFacturation,
    updateFacturation,
    deleteFacturation,
    createImpaye,
    updateImpaye,
    deleteImpaye,
    getReceptionSolde,
    getReceptionTransitions,
    checkImpayeReception,
    createFicheLivraison, // AJOUTER
  updateFicheLivraison, 
  deleteFicheLivraison,
  marquerCommeLivre,
  };

  return (
    <ReceptionsContext.Provider value={value}>
      {children}
    </ReceptionsContext.Provider>
  );
};

export const useReceptions = (): ReceptionsContextType => {
  const context = useContext(ReceptionsContext);
  if (!context) {
    throw new Error('useReceptions must be used within a ReceptionsProvider');
  }
  return context;
};
