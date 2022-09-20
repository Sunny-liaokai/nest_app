import {
  DynamicModule,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import IORedis, { Redis, Cluster } from 'ioredis';
import { isEmpty } from 'lodash';
import {
  REDIS_CLIENT,
  REDIS_DEFAULT_CLIENT_KEY,
  REDIS_MODULE_OPTIONS,
} from './redis.constants';

@Module({})
export class RedisModule implements OnModuleDestroy {
  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    const clientProvider = this.createAsyncProvider();
    return {
      module: RedisModule,
      providers: [
        clientProvider,
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [],
    };
  }

  static registerAsync(options: RedisModuleAsyncOptions) {
    const clientProvider = this.createAsyncProvider();
    return {
      module: RedisModule,
      imports: options.imports ?? [],
      providers: [clientProvider, this.createAsyncClientOptions(options)],
      exports: [clientProvider],
    };
  }
  /**
   * create provider
   */
  private static createAsyncProvider(): Provider {
    return {
      provide: REDIS_CLIENT,
      useFactory: (options: RedisModuleOptions | RedisModuleOptions[]) => {
        const clients = new Map();
        if (Array.isArray(options)) {
          options.forEach((op) => {
            const name = op.name ?? REDIS_DEFAULT_CLIENT_KEY; // 双问号？？ op.name  === null 的话就会执行 default
            if (clients.has(name)) {
              throw new Error('Redis Init Error: name must unique');
            }
            clients.set(name, this.createClient(op));
          });
        } else {
          clients.set(REDIS_DEFAULT_CLIENT_KEY, this.createClient(options));
        }
        return clients;
      },
      inject: [REDIS_MODULE_OPTIONS],
    };
  }

  /**
   * createClient 创建IORedis实例
   * @param options
   * @private
   */
  private static createClient(options: RedisModuleOptions): Redis | Cluster {
    const { onClientReady, url, cluster, clusterOptions, nodes, ...opts } =
      options;
    let client;
    if (!isEmpty(url)) {
      client = new IORedis(url);
    } else if (cluster) {
      client = new IORedis.Cluster(nodes, clusterOptions);
    } else {
      client = new IORedis(opts);
    }
    if (onClientReady) {
      onClientReady(client);
    }
    return client;
  }
  private static createAsyncClientOptions(options: RedisModuleAsyncOptions) {
    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  onModuleDestroy(): any {
    // on destroy
  }
}
