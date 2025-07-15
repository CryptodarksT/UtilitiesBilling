import crypto from 'crypto';
import { db } from './db';
import { userAccounts } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class AuthService {
  // Tạo API key mới
  static generateApiKey(): string {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return `pk_${timestamp}_${randomBytes}`;
  }

  // Tạo tài khoản mới với API key
  static async createAccount(accountData: {
    email: string;
    name: string;
    businessName?: string;
    phone?: string;
  }) {
    const apiKey = this.generateApiKey();
    const keyExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 năm

    const [newAccount] = await db
      .insert(userAccounts)
      .values({
        apiKey,
        email: accountData.email,
        name: accountData.name,
        businessName: accountData.businessName,
        phone: accountData.phone,
        keyExpiresAt,
        isActive: true,
        isVerified: false,
      })
      .returning();

    return {
      ...newAccount,
      apiKey, // Trả về API key để user có thể sử dụng
    };
  }

  // Xác thực API key
  static async verifyApiKey(apiKey: string) {
    if (!apiKey || !apiKey.startsWith('pk_')) {
      throw new Error('Invalid API key format');
    }

    const [account] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.apiKey, apiKey));

    if (!account) {
      throw new Error('Invalid API key');
    }

    if (!account.isActive) {
      throw new Error('Account is disabled');
    }

    if (account.keyExpiresAt && new Date() > account.keyExpiresAt) {
      throw new Error('API key has expired');
    }

    // Cập nhật last login
    await db
      .update(userAccounts)
      .set({ lastLoginAt: new Date() })
      .where(eq(userAccounts.id, account.id));

    return account;
  }

  // Tái tạo API key
  static async regenerateApiKey(userId: number) {
    const newApiKey = this.generateApiKey();
    const keyExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 năm

    const [updatedAccount] = await db
      .update(userAccounts)
      .set({ 
        apiKey: newApiKey,
        keyExpiresAt,
        updatedAt: new Date()
      })
      .where(eq(userAccounts.id, userId))
      .returning();

    return {
      ...updatedAccount,
      apiKey: newApiKey,
    };
  }

  // Tạo danh sách API keys cho admin
  static async listAccounts(isActive?: boolean) {
    const conditions = isActive !== undefined ? eq(userAccounts.isActive, isActive) : undefined;
    
    const accounts = await db
      .select({
        id: userAccounts.id,
        email: userAccounts.email,
        name: userAccounts.name,
        businessName: userAccounts.businessName,
        phone: userAccounts.phone,
        isActive: userAccounts.isActive,
        isVerified: userAccounts.isVerified,
        keyExpiresAt: userAccounts.keyExpiresAt,
        lastLoginAt: userAccounts.lastLoginAt,
        createdAt: userAccounts.createdAt,
      })
      .from(userAccounts)
      .where(conditions);

    return accounts;
  }

  // Kích hoạt/vô hiệu hóa tài khoản
  static async toggleAccountStatus(userId: number, isActive: boolean) {
    const [updatedAccount] = await db
      .update(userAccounts)
      .set({ 
        isActive,
        updatedAt: new Date()
      })
      .where(eq(userAccounts.id, userId))
      .returning();

    return updatedAccount;
  }

  // Xác minh tài khoản
  static async verifyAccount(userId: number) {
    const [verifiedAccount] = await db
      .update(userAccounts)
      .set({ 
        isVerified: true,
        updatedAt: new Date()
      })
      .where(eq(userAccounts.id, userId))
      .returning();

    return verifiedAccount;
  }
}