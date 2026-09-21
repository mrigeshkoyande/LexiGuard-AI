import { AIProvider } from './AIProvider';
import { MockAIProvider } from './MockAIProvider';
import { RealAIProvider } from './RealAIProvider';

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const providerType = (process.env.AI_PROVIDER || 'mock').toLowerCase();

  if (providerType === 'real' && process.env.OPENAI_API_KEY) {
    providerInstance = new RealAIProvider();
  } else {
    providerInstance = new MockAIProvider();
  }

  return providerInstance;
}

export * from './AIProvider';
export * from './MockAIProvider';
export * from './RealAIProvider';
