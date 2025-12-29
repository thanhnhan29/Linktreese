// src/lib/firestoreSchemas.ts
// Minimal Firestore helpers to create the collections/documents you described.
// Keep it simple: each function writes a document and returns the created id (or void for set).

import { db } from '../firebase';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
  increment,
} from 'firebase/firestore';

// -- Types (simple, optional fields as requested) --
export interface UserDoc {
  email: string;
  fullName?: string;
  avatarUrl?: string; // local path string
  proPurchase?: boolean;
  createdAt?: any;
}

export interface ThemeConfig {
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundValue?: string;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  fontFamily?: string;
  textColor?: string;
  buttonColor?: string;
}

export interface BioPageDoc {
  userId: string;
  username: string;
  bioDescription?: string;
  avatarUrl?: string;
  isLogoHidden?: boolean;
  viewCount?: number;
  published?: boolean;
  themeConfig?: ThemeConfig;
  createdAt?: any;
}

export interface BlockDoc {
  type: string; // 'social' | 'donate' | 'product' | 'contact' | 'zalo'
  title?: string;
  isVisible?: boolean;
  sortOrder?: number;
  clickCount?: number;
  // type-specific optional fields
  url?: string;
  zaloPhoneNumber?: string;
  paymentMethod?: string;
  paymentIdentifier?: string;
  qrImageUrl?: string;
  productUrl?: string;
  cachedName?: string;
  cachedImage?: string;
  receiveEmail?: string;
  createdAt?: any;
}

export interface CustomDomainDoc {
  pageId: string;
  userId: string;
  status: 'pending' | 'active' | 'failed';
  cnameTarget?: string;
  createdAt?: any;
}

// -- Helpers --
export async function createUser(uid: string, data: Partial<UserDoc>) {
  const docRef = doc(db, 'users', uid);
  const payload: UserDoc = {
    email: data.email || '',
    fullName: data.fullName || '',
    avatarUrl: data.avatarUrl || '',
    proPurchase: data.proPurchase || false,
    createdAt: serverTimestamp(),
  };
  await setDoc(docRef, payload);
  return uid;
}

export async function createBioPage(data: Partial<BioPageDoc>, pageId?: string) {
  const payload: BioPageDoc = {
    userId: data.userId || '',
    username: data.username || '',
    bioDescription: data.bioDescription || '',
    avatarUrl: data.avatarUrl || '',
    isLogoHidden: data.isLogoHidden || false,
    viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
    published: data.published || false,
    themeConfig: data.themeConfig || {
      backgroundType: 'solid',
      backgroundValue: '#ffffff',
      buttonStyle: 'rounded',
      fontFamily: 'Inter, sans-serif',
      textColor: '#000000',
      buttonColor: '#8129d9',
    },
    createdAt: serverTimestamp(),
  };

  if (pageId) {
    const docRef = doc(db, 'bio_pages', pageId);
    await setDoc(docRef, payload);
    return pageId;
  }

  const colRef = collection(db, 'bio_pages');
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
}

export async function createBlock(pageId: string, data: Partial<BlockDoc>, blockId?: string) {
  if (!pageId) throw new Error('pageId is required');

  const payload: BlockDoc = {
    type: data.type || 'social',
    title: data.title || '',
    isVisible: typeof data.isVisible === 'boolean' ? data.isVisible : true,
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    clickCount: typeof data.clickCount === 'number' ? data.clickCount : 0,
    url: data.url || '',
    zaloPhoneNumber: data.zaloPhoneNumber || '',
    paymentMethod: data.paymentMethod || '',
    paymentIdentifier: data.paymentIdentifier || '',
    qrImageUrl: data.qrImageUrl || '',
    productUrl: data.productUrl || '',
    cachedName: data.cachedName || '',
    cachedImage: data.cachedImage || '',
    receiveEmail: data.receiveEmail || '',
    createdAt: serverTimestamp(),
  };

  if (blockId) {
    const blockRef = doc(db, 'bio_pages', pageId, 'blocks', blockId);
    await setDoc(blockRef, payload);
    return blockId;
  }

  const blocksCol = collection(db, 'bio_pages', pageId, 'blocks');
  const blockRef = await addDoc(blocksCol, payload);
  return blockRef.id;
}

export async function createCustomDomain(domainName: string, data: Partial<CustomDomainDoc>) {
  if (!domainName) throw new Error('domainName is required');
  const docRef = doc(db, 'custom_domains', domainName);
  const payload: CustomDomainDoc = {
    pageId: data.pageId || '',
    userId: data.userId || '',
    status: data.status || 'pending',
    cnameTarget: data.cnameTarget || '',
    createdAt: serverTimestamp(),
  };
  await setDoc(docRef, payload);
  return domainName;
}

// Small helper to increment view or click counters
export async function incrementField(refPath: string, field: string, by = 1) {
  // refPath example: 'bio_pages/{pageId}' or 'bio_pages/{pageId}/blocks/{blockId}'
  const parts = refPath.split('/').filter(Boolean);
  if (parts.length % 2 !== 0) throw new Error('invalid document path');
  // `parts` is string[]; cast to any to satisfy the doc overload typing.
  const docRef = doc(db as any, ...(parts as any));
  await updateDoc(docRef, { [field]: increment(by) });
}

/* Usage examples (very simple):

import { createUser, createBioPage, createBlock, createCustomDomain } from './lib/firestoreSchemas';

// create user doc (use Firebase Auth uid)
await createUser(uid, { email: 'a@b.com', fullName: 'A B' });

// create bio page with generated id
const pageId = await createBioPage({ userId: uid, username: 'my-handle' });

// add a social block
const blockId = await createBlock(pageId, { type: 'social', title: 'Twitter', url: 'https://twitter.com/me' });

// set a custom domain
await createCustomDomain('mybrand.com', { pageId, userId: uid, status: 'pending', cnameTarget: 'ghs.example.com' });

*/
