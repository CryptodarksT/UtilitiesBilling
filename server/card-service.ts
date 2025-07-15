import { db } from './db';
import { linkedCards, userAccounts, customerTokens } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.CARD_ENCRYPTION_KEY || 'fallback-key-change-in-production';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret';

export class CardService {
  private encryptCardNumber(cardNumber: string): string {
    return CryptoJS.AES.encrypt(cardNumber, ENCRYPTION_KEY).toString();
  }

  private decryptCardNumber(encryptedCardNumber: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedCardNumber, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private encryptCardData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  }

  private decryptCardData(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  async linkCard(data: {
    userId: number;
    customerId: string;
    cardType: string;
    cardNumber: string;
    cardHolderName: string;
    expiryMonth?: string;
    expiryYear?: string;
    bankName?: string;
    isDefault?: boolean;
  }) {
    // Check if user has reached card limit (max 5 cards)
    const existingCards = await db
      .select()
      .from(linkedCards)
      .where(
        and(
          eq(linkedCards.userId, data.userId),
          eq(linkedCards.isActive, true)
        )
      );

    if (existingCards.length >= 5) {
      throw new Error('Maximum 5 cards allowed per user');
    }

    // If this is the first card or explicitly set as default, make it default
    if (data.isDefault || existingCards.length === 0) {
      // Set all other cards as non-default
      await db
        .update(linkedCards)
        .set({ isDefault: false })
        .where(eq(linkedCards.userId, data.userId));
    }

    // Encrypt card number
    const encryptedCardNumber = this.encryptCardNumber(data.cardNumber);

    // Insert new card
    const [newCard] = await db
      .insert(linkedCards)
      .values({
        userId: data.userId,
        customerId: data.customerId,
        cardType: data.cardType,
        cardNumber: encryptedCardNumber,
        cardHolderName: data.cardHolderName,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        bankName: data.bankName,
        isDefault: data.isDefault || existingCards.length === 0,
      })
      .returning();

    return newCard;
  }

  async getUserCards(userId: number) {
    const cards = await db
      .select({
        id: linkedCards.id,
        customerId: linkedCards.customerId,
        cardType: linkedCards.cardType,
        cardNumber: linkedCards.cardNumber,
        cardHolderName: linkedCards.cardHolderName,
        expiryMonth: linkedCards.expiryMonth,
        expiryYear: linkedCards.expiryYear,
        bankName: linkedCards.bankName,
        isDefault: linkedCards.isDefault,
        isActive: linkedCards.isActive,
        createdAt: linkedCards.createdAt,
      })
      .from(linkedCards)
      .where(
        and(
          eq(linkedCards.userId, userId),
          eq(linkedCards.isActive, true)
        )
      );

    // Decrypt card numbers for display (mask except last 4 digits)
    return cards.map(card => {
      const decryptedNumber = this.decryptCardNumber(card.cardNumber);
      const maskedNumber = `**** **** **** ${decryptedNumber.slice(-4)}`;
      
      return {
        ...card,
        cardNumber: maskedNumber,
        lastFourDigits: decryptedNumber.slice(-4),
      };
    });
  }

  async getCardForPayment(cardId: number, userId: number) {
    const [card] = await db
      .select()
      .from(linkedCards)
      .where(
        and(
          eq(linkedCards.id, cardId),
          eq(linkedCards.userId, userId),
          eq(linkedCards.isActive, true)
        )
      );

    if (!card) {
      throw new Error('Card not found');
    }

    return {
      ...card,
      cardNumber: this.decryptCardNumber(card.cardNumber),
    };
  }

  async generateCustomerToken(userId: number, customerId: string) {
    // Generate unique token
    const token = jwt.sign(
      { userId, customerId, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '1y' }
    );

    // Save to database
    await db
      .insert(customerTokens)
      .values({
        userId,
        customerId,
        token,
      });

    return token;
  }

  async validateCustomerToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check if token exists in database
      const [tokenRecord] = await db
        .select()
        .from(customerTokens)
        .where(
          and(
            eq(customerTokens.token, token),
            eq(customerTokens.isActive, true)
          )
        );

      if (!tokenRecord) {
        throw new Error('Token not found');
      }

      // Update last used
      await db
        .update(customerTokens)
        .set({ lastUsed: new Date() })
        .where(eq(customerTokens.id, tokenRecord.id));

      return {
        userId: decoded.userId,
        customerId: decoded.customerId,
        tokenRecord,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async deactivateCard(cardId: number, userId: number) {
    const [updatedCard] = await db
      .update(linkedCards)
      .set({ isActive: false })
      .where(
        and(
          eq(linkedCards.id, cardId),
          eq(linkedCards.userId, userId)
        )
      )
      .returning();

    if (!updatedCard) {
      throw new Error('Card not found');
    }

    // If this was the default card, make another card default
    if (updatedCard.isDefault) {
      const [firstActiveCard] = await db
        .select()
        .from(linkedCards)
        .where(
          and(
            eq(linkedCards.userId, userId),
            eq(linkedCards.isActive, true)
          )
        )
        .limit(1);

      if (firstActiveCard) {
        await db
          .update(linkedCards)
          .set({ isDefault: true })
          .where(eq(linkedCards.id, firstActiveCard.id));
      }
    }

    return updatedCard;
  }

  async setDefaultCard(cardId: number, userId: number) {
    // Set all cards as non-default
    await db
      .update(linkedCards)
      .set({ isDefault: false })
      .where(eq(linkedCards.userId, userId));

    // Set selected card as default
    const [updatedCard] = await db
      .update(linkedCards)
      .set({ isDefault: true })
      .where(
        and(
          eq(linkedCards.id, cardId),
          eq(linkedCards.userId, userId),
          eq(linkedCards.isActive, true)
        )
      )
      .returning();

    if (!updatedCard) {
      throw new Error('Card not found');
    }

    return updatedCard;
  }
}