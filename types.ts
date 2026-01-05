
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isVerified: boolean;
  joinedDate: Date;
  phoneNumber?: string;
  country?: string;
  dob?: string;
  idType?: string;
  idNumber?: string;
  verificationTier: 1 | 2 | 3;
  transactionLimit: number;
  walletAddress?: string;
  cryptoBalances?: {
    BTC: number;
    ETH: number;
    USDT: number;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  seller: string;
  rating: number;
  sellerAvatar?: string;
  isSellerVerified?: boolean;
  // Crypto P2P specific fields
  isCryptoListing?: boolean;
  cryptoAmount?: number;
  cryptoSymbol?: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  fee: number;
  date: Date;
  status: 'completed' | 'pending';
  paymentMethod: 'card' | 'crypto';
  cryptoCurrency?: string;
  txHash?: string;
  isP2PTransfer?: boolean;
  escrowStatus?: 'none' | 'locked' | 'paid' | 'verified' | 'released';
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'seller';
  text?: string;
  image?: string;
  timestamp: Date;
  isEncrypted?: boolean;
  encryptionHash?: string;
}

export interface ChatSession {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  productId?: string;
  messages: Message[];
  encryptionKey?: string;
}

export enum AppTab {
  MARKETPLACE = 'MARKETPLACE',
  MESSAGES = 'MESSAGES',
  SELL = 'SELL',
  DASHBOARD = 'DASHBOARD'
}
