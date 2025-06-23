export interface Bank {
  id: string;
  name: string;
  logo: string;
  country: string;
}

export const mockBanks: Bank[] = [
  {
    id: 'bnp-paribas',
    name: 'BNP Paribas',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'societe-generale',
    name: 'Société Générale',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'credit-agricole',
    name: 'Crédit Agricole',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'la-banque-postale',
    name: 'La Banque Postale',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'boursorama',
    name: 'Boursorama',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'ing',
    name: 'ING Direct',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'hsbc',
    name: 'HSBC France',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'credit-mutuel',
    name: 'Crédit Mutuel',
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'caisse-epargne',
    name: "Caisse d'Épargne",
    logo: 'https://via.placeholder.com/40',
    country: 'FR'
  },
  {
    id: 'n26',
    name: 'N26',
    logo: 'https://via.placeholder.com/40',
    country: 'DE'
  }
];
