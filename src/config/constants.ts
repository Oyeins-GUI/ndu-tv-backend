import { CreatePlatformConfigInput } from '../modules/admin/repositories/interfaces/platform-config-repository.interface';
import env from './env.config';

export const API_PREFIX = env.API_VERSION || 'v1';

export const DEFAULT_RATE_LIMIT_TTL = 1000 * 60 * 15; //15 MINS, throtller TTL is in milliseconds

export const DEFAULT_RATE_LIMIT_REQUESTS = 100; //15 MINS, throtller TTL is in milliseconds

export const APP_SETTINGS_REDIS_KEY = 'app-settings';

export const APP_SETTINGS_REDIS_TTL = 60 * 60 * 24 * 30; //30 days in seconds;

export const DEFAULT_PLATFORM_CONFIG: Omit<
  CreatePlatformConfigInput,
  'current_session_id'
> = {
  is_ad_enabled: false,
  is_publishing_enabled: true,
  is_app_enabled: true,
  platform_name: 'NDU-TV',
  platform_tagline: 'Your Source for Campus News and Updates',
};

export const REDIS_CLIENT_PROVIDER = 'REDIS_CLIENT_PROVIDER';
