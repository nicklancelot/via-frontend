// types/reception.ts
export interface Reception {
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

export interface Facturation {
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

export interface Impaye {
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
}

export interface FicheLivraison {
  id: number;
  reception_id: number;
  date_livraison: string;
  lieu_depart: string;
  destination: string;
  livreur_nom: string;
  livreur_prenom: string;
  livreur_telephone: string;
  livreur_vehicule: string;
  destinateur_nom: string;
  destinateur_prenom: string;
  destinateur_fonction: string;
  destinateur_contact: string;
  type_produit: string;
  poids_net: number;
  ristourne_regionale: number;
  ristourne_communale: number;
  prix_unitaire: number;
  quantite_a_livrer: number;
  created_at?: string;
  updated_at?: string;
}
