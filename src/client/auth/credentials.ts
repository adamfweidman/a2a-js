import { ClientCallContext } from './client';
import { AgentCard } from '../types';

export interface CredentialService {
  getCredentials(
    securitySchemeName: string,
    context?: ClientCallContext,
  ): Promise<string | undefined>;
}

export class InMemoryContextCredentialStore implements CredentialService {
  private store: Record<string, Record<string, string>> = {};

  async getCredentials(
    securitySchemeName: string,
    context?: ClientCallContext,
  ): Promise<string | undefined> {
    if (!context || !context.state['sessionId']) {
      return undefined;
    }
    const sessionId = context.state['sessionId'];
    return this.store[sessionId]?.[securitySchemeName];
  }

  async setCredentials(
    sessionId: string,
    securitySchemeName: string,
    credential: string,
  ): Promise<void> {
    if (!this.store[sessionId]) {
      this.store[sessionId] = {};
    }
    this.store[sessionId][securitySchemeName] = credential;
  }
}
