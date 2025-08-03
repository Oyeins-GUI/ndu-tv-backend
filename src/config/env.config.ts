import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import {
  validateSync,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

const envPath = path.resolve(process.cwd(), '.env');
const envDevPath = path.resolve(process.cwd(), '.env.development');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, debug: true });
}

if (process.env.NODE_ENV === 'development') {
  if (fs.existsSync(envDevPath)) {
    dotenv.config({ path: envDevPath, override: true });
  }
}

class EnvConfig {
  @IsEnum(['development', 'production', 'test', 'staging'])
  NODE_ENV: string;

  @IsNumber()
  PORT: number;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsUrl({ require_tld: false })
  REDIS_URL: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  APP_NAME: string;

  @IsString()
  GF_SECURITY_ADMIN_USER: string;

  @IsString()
  GF_SECURITY_ADMIN_PASSWORD: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRY: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRY: string;

  @IsString()
  API_VERSION: string;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  MAIL_MAILER: string;

  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_USERNAME: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  MAIL_ENCRYPTION: string;

  @IsString()
  MAIL_FROM_ADDRESS: string;

  @IsString()
  MAIL_FROM_NAME: string;
}

const env = plainToInstance(EnvConfig, process.env, {
  enableImplicitConversion: true,
});

const errors = validateSync(env, { skipMissingProperties: false });
if (errors.length > 0) {
  console.error(
    '❌ Invalid environment variables:',
    errors.flatMap((err) => Object.values(err.constraints || {})),
  );
  process.exit(1);
}

export default env;
