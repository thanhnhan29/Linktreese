// src/infrastructure/repositories/customDomainRepository.ts
// Custom Domain data access layer

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { CustomDomain, DomainStatus } from "@/shared/types/customDomain";

class CustomDomainRepository {
  private collectionName = "custom_domains";

  /**
   * Create a new custom domain record
   */
  async createDomain(data: {
    userId: string;
    bioPageId: string;
    domain: string;
    verificationToken: string;
    verificationMethod: "txt" | "cname";
  }): Promise<string> {
    const payload = {
      userId: data.userId,
      bioPageId: data.bioPageId,
      domain: data.domain.toLowerCase().trim(),
      status: "pending" as DomainStatus,
      verificationToken: data.verificationToken,
      verificationMethod: data.verificationMethod,
      sslEnabled: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, this.collectionName), payload);
    return docRef.id;
  }

  /**
   * Get domain by ID
   */
  async getDomainById(domainId: string): Promise<CustomDomain | null> {
    const docRef = doc(db, this.collectionName, domainId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return this.mapToModel(snapshot);
  }

  /**
   * Get domain by domain name
   */
  async getDomainByName(domain: string): Promise<CustomDomain | null> {
    const q = query(
      collection(db, this.collectionName),
      where("domain", "==", domain.toLowerCase().trim())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return this.mapToModel(snapshot.docs[0]);
  }

  /**
   * Get domains by user ID
   */
  async getDomainsByUserId(userId: string): Promise<CustomDomain[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapToModel(doc));
  }

  /**
   * Get domain by bio page ID (active only)
   */
  async getDomainByBioPageId(bioPageId: string): Promise<CustomDomain | null> {
    const q = query(
      collection(db, this.collectionName),
      where("bioPageId", "==", bioPageId),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return this.mapToModel(snapshot.docs[0]);
  }

  /**
   * Get ALL domains by bio page ID (all statuses)
   */
  async getDomainsByBioPageId(bioPageId: string): Promise<CustomDomain[]> {
    const q = query(
      collection(db, this.collectionName),
      where("bioPageId", "==", bioPageId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapToModel(doc));
  }

  /**
   * Update domain status
   */
  async updateDomainStatus(
    domainId: string,
    status: DomainStatus,
    error?: string
  ): Promise<void> {
    const docRef = doc(db, this.collectionName, domainId);
    const updates: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === "verified") {
      updates.verifiedAt = serverTimestamp();
    }

    if (error) {
      updates.lastError = error;
    }

    await updateDoc(docRef, updates);
  }

  /**
   * Update SSL status
   */
  async updateSSLStatus(domainId: string, enabled: boolean): Promise<void> {
    const docRef = doc(db, this.collectionName, domainId);
    const updates: any = {
      sslEnabled: enabled,
      updatedAt: serverTimestamp(),
    };

    if (enabled) {
      updates.sslIssuedAt = serverTimestamp();
    }

    await updateDoc(docRef, updates);
  }

  /**
   * Delete domain
   */
  async deleteDomain(domainId: string): Promise<void> {
    const docRef = doc(db, this.collectionName, domainId);
    await deleteDoc(docRef);
  }

  /**
   * Map Firestore document to CustomDomain model
   */
  private mapToModel(snapshot: any): CustomDomain {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      userId: data.userId,
      bioPageId: data.bioPageId,
      domain: data.domain,
      status: data.status,
      verificationToken: data.verificationToken,
      verificationMethod: data.verificationMethod,
      verifiedAt: data.verifiedAt?.toDate(),
      sslEnabled: data.sslEnabled || false,
      sslIssuedAt: data.sslIssuedAt?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastError: data.lastError,
    };
  }
}

export const customDomainRepository = new CustomDomainRepository();
