import { getApi, putApi } from './axios.service';

export interface UserSettings {
  userId: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  twoFactorAuth: boolean;
  language: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
  theme: 'light' | 'dark';
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  twoFactorAuth?: boolean;
  language?: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
  theme?: 'light' | 'dark';
  currency?: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getUserSettings = async (): Promise<UserSettings> => {
  const response: ApiResponse<UserSettings> = await getApi('/api/v1/users/settings');
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.message || 'Failed to fetch user settings');
};

export const updateUserSettings = async (settings: UpdateSettingsRequest): Promise<UserSettings> => {
  const response: ApiResponse<UserSettings> = await putApi('/api/v1/users/settings', settings);
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.message || 'Failed to update user settings');
};

