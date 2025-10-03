import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisCacheService } from './redis.service';
import { env } from '../../config';
import { REDIS_CLIENT_PROVIDER } from '../../config/constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT_PROVIDER,
      useFactory: async () => {
        console.log(`Connecting to Redis at: ${env.REDIS_URL}`);

        const client = createClient({ url: env.REDIS_URL });

        client.on('error', (err) => {
          console.error('Redis Client Error', err);
        });

        try {
          await client.connect();
          console.log('✅ Connected to Redis successfully');
        } catch (err: any) {
          console.error('❌ Failed to connect to Redis:', err);
          throw new Error(`Redis connection failed: ${err.message}`);
        }

        return client;
      },
    },
    RedisCacheService,
    { provide: 'IRedisCacheService', useExisting: RedisCacheService },
  ],
  exports: [
    REDIS_CLIENT_PROVIDER,
    { provide: 'IRedisCacheService', useExisting: RedisCacheService },
  ],
})
export class RedisModule {}
