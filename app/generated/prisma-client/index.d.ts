
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Canvas
 * 
 */
export type Canvas = $Result.DefaultSelection<Prisma.$CanvasPayload>
/**
 * Model CanvasBlock
 * 
 */
export type CanvasBlock = $Result.DefaultSelection<Prisma.$CanvasBlockPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Projects
 * const projects = await prisma.project.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Projects
   * const projects = await prisma.project.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.canvas`: Exposes CRUD operations for the **Canvas** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Canvas
    * const canvas = await prisma.canvas.findMany()
    * ```
    */
  get canvas(): Prisma.CanvasDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.canvasBlock`: Exposes CRUD operations for the **CanvasBlock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CanvasBlocks
    * const canvasBlocks = await prisma.canvasBlock.findMany()
    * ```
    */
  get canvasBlock(): Prisma.CanvasBlockDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.11.1
   * Query Engine version: f40f79ec31188888a2e33acda0ecc8fd10a853a9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Project: 'Project',
    Canvas: 'Canvas',
    CanvasBlock: 'CanvasBlock'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "project" | "canvas" | "canvasBlock"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Canvas: {
        payload: Prisma.$CanvasPayload<ExtArgs>
        fields: Prisma.CanvasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CanvasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CanvasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          findFirst: {
            args: Prisma.CanvasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CanvasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          findMany: {
            args: Prisma.CanvasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>[]
          }
          create: {
            args: Prisma.CanvasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          createMany: {
            args: Prisma.CanvasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CanvasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>[]
          }
          delete: {
            args: Prisma.CanvasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          update: {
            args: Prisma.CanvasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          deleteMany: {
            args: Prisma.CanvasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CanvasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CanvasUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>[]
          }
          upsert: {
            args: Prisma.CanvasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          aggregate: {
            args: Prisma.CanvasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCanvas>
          }
          groupBy: {
            args: Prisma.CanvasGroupByArgs<ExtArgs>
            result: $Utils.Optional<CanvasGroupByOutputType>[]
          }
          count: {
            args: Prisma.CanvasCountArgs<ExtArgs>
            result: $Utils.Optional<CanvasCountAggregateOutputType> | number
          }
        }
      }
      CanvasBlock: {
        payload: Prisma.$CanvasBlockPayload<ExtArgs>
        fields: Prisma.CanvasBlockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CanvasBlockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CanvasBlockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>
          }
          findFirst: {
            args: Prisma.CanvasBlockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CanvasBlockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>
          }
          findMany: {
            args: Prisma.CanvasBlockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>[]
          }
          create: {
            args: Prisma.CanvasBlockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>
          }
          createMany: {
            args: Prisma.CanvasBlockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CanvasBlockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>[]
          }
          delete: {
            args: Prisma.CanvasBlockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>
          }
          update: {
            args: Prisma.CanvasBlockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>
          }
          deleteMany: {
            args: Prisma.CanvasBlockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CanvasBlockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CanvasBlockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>[]
          }
          upsert: {
            args: Prisma.CanvasBlockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasBlockPayload>
          }
          aggregate: {
            args: Prisma.CanvasBlockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCanvasBlock>
          }
          groupBy: {
            args: Prisma.CanvasBlockGroupByArgs<ExtArgs>
            result: $Utils.Optional<CanvasBlockGroupByOutputType>[]
          }
          count: {
            args: Prisma.CanvasBlockCountArgs<ExtArgs>
            result: $Utils.Optional<CanvasBlockCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    project?: ProjectOmit
    canvas?: CanvasOmit
    canvasBlock?: CanvasBlockOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    canvases: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvases?: boolean | ProjectCountOutputTypeCountCanvasesArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountCanvasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasWhereInput
  }


  /**
   * Count Type CanvasCountOutputType
   */

  export type CanvasCountOutputType = {
    canvasBlocks: number
  }

  export type CanvasCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvasBlocks?: boolean | CanvasCountOutputTypeCountCanvasBlocksArgs
  }

  // Custom InputTypes
  /**
   * CanvasCountOutputType without action
   */
  export type CanvasCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasCountOutputType
     */
    select?: CanvasCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CanvasCountOutputType without action
   */
  export type CanvasCountOutputTypeCountCanvasBlocksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasBlockWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    description: string | null
    icon: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    description: string | null
    icon: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    description: number
    icon: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    icon?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    icon?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    icon?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    userId: string
    name: string
    description: string | null
    icon: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    canvases?: boolean | Project$canvasesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "description" | "icon" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvases?: boolean | Project$canvasesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      canvases: Prisma.$CanvasPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      description: string | null
      icon: string | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    canvases<T extends Project$canvasesArgs<ExtArgs> = {}>(args?: Subset<T, Project$canvasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly userId: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly icon: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.canvases
   */
  export type Project$canvasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    where?: CanvasWhereInput
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    cursor?: CanvasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Canvas
   */

  export type AggregateCanvas = {
    _count: CanvasCountAggregateOutputType | null
    _avg: CanvasAvgAggregateOutputType | null
    _sum: CanvasSumAggregateOutputType | null
    _min: CanvasMinAggregateOutputType | null
    _max: CanvasMaxAggregateOutputType | null
  }

  export type CanvasAvgAggregateOutputType = {
    order: number | null
  }

  export type CanvasSumAggregateOutputType = {
    order: number | null
  }

  export type CanvasMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CanvasMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CanvasCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    order: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CanvasAvgAggregateInputType = {
    order?: true
  }

  export type CanvasSumAggregateInputType = {
    order?: true
  }

  export type CanvasMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CanvasMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CanvasCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CanvasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Canvas to aggregate.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Canvas
    **/
    _count?: true | CanvasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CanvasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CanvasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CanvasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CanvasMaxAggregateInputType
  }

  export type GetCanvasAggregateType<T extends CanvasAggregateArgs> = {
        [P in keyof T & keyof AggregateCanvas]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCanvas[P]>
      : GetScalarType<T[P], AggregateCanvas[P]>
  }




  export type CanvasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasWhereInput
    orderBy?: CanvasOrderByWithAggregationInput | CanvasOrderByWithAggregationInput[]
    by: CanvasScalarFieldEnum[] | CanvasScalarFieldEnum
    having?: CanvasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CanvasCountAggregateInputType | true
    _avg?: CanvasAvgAggregateInputType
    _sum?: CanvasSumAggregateInputType
    _min?: CanvasMinAggregateInputType
    _max?: CanvasMaxAggregateInputType
  }

  export type CanvasGroupByOutputType = {
    id: string
    projectId: string
    name: string
    order: number
    createdAt: Date
    updatedAt: Date
    _count: CanvasCountAggregateOutputType | null
    _avg: CanvasAvgAggregateOutputType | null
    _sum: CanvasSumAggregateOutputType | null
    _min: CanvasMinAggregateOutputType | null
    _max: CanvasMaxAggregateOutputType | null
  }

  type GetCanvasGroupByPayload<T extends CanvasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CanvasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CanvasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CanvasGroupByOutputType[P]>
            : GetScalarType<T[P], CanvasGroupByOutputType[P]>
        }
      >
    >


  export type CanvasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    canvasBlocks?: boolean | Canvas$canvasBlocksArgs<ExtArgs>
    _count?: boolean | CanvasCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvas"]>

  export type CanvasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvas"]>

  export type CanvasSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvas"]>

  export type CanvasSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CanvasOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "name" | "order" | "createdAt" | "updatedAt", ExtArgs["result"]["canvas"]>
  export type CanvasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    canvasBlocks?: boolean | Canvas$canvasBlocksArgs<ExtArgs>
    _count?: boolean | CanvasCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CanvasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type CanvasIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $CanvasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Canvas"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      canvasBlocks: Prisma.$CanvasBlockPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      name: string
      order: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["canvas"]>
    composites: {}
  }

  type CanvasGetPayload<S extends boolean | null | undefined | CanvasDefaultArgs> = $Result.GetResult<Prisma.$CanvasPayload, S>

  type CanvasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CanvasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CanvasCountAggregateInputType | true
    }

  export interface CanvasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Canvas'], meta: { name: 'Canvas' } }
    /**
     * Find zero or one Canvas that matches the filter.
     * @param {CanvasFindUniqueArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CanvasFindUniqueArgs>(args: SelectSubset<T, CanvasFindUniqueArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Canvas that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CanvasFindUniqueOrThrowArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CanvasFindUniqueOrThrowArgs>(args: SelectSubset<T, CanvasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Canvas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasFindFirstArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CanvasFindFirstArgs>(args?: SelectSubset<T, CanvasFindFirstArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Canvas that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasFindFirstOrThrowArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CanvasFindFirstOrThrowArgs>(args?: SelectSubset<T, CanvasFindFirstOrThrowArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Canvas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Canvas
     * const canvas = await prisma.canvas.findMany()
     * 
     * // Get first 10 Canvas
     * const canvas = await prisma.canvas.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const canvasWithIdOnly = await prisma.canvas.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CanvasFindManyArgs>(args?: SelectSubset<T, CanvasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Canvas.
     * @param {CanvasCreateArgs} args - Arguments to create a Canvas.
     * @example
     * // Create one Canvas
     * const Canvas = await prisma.canvas.create({
     *   data: {
     *     // ... data to create a Canvas
     *   }
     * })
     * 
     */
    create<T extends CanvasCreateArgs>(args: SelectSubset<T, CanvasCreateArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Canvas.
     * @param {CanvasCreateManyArgs} args - Arguments to create many Canvas.
     * @example
     * // Create many Canvas
     * const canvas = await prisma.canvas.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CanvasCreateManyArgs>(args?: SelectSubset<T, CanvasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Canvas and returns the data saved in the database.
     * @param {CanvasCreateManyAndReturnArgs} args - Arguments to create many Canvas.
     * @example
     * // Create many Canvas
     * const canvas = await prisma.canvas.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Canvas and only return the `id`
     * const canvasWithIdOnly = await prisma.canvas.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CanvasCreateManyAndReturnArgs>(args?: SelectSubset<T, CanvasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Canvas.
     * @param {CanvasDeleteArgs} args - Arguments to delete one Canvas.
     * @example
     * // Delete one Canvas
     * const Canvas = await prisma.canvas.delete({
     *   where: {
     *     // ... filter to delete one Canvas
     *   }
     * })
     * 
     */
    delete<T extends CanvasDeleteArgs>(args: SelectSubset<T, CanvasDeleteArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Canvas.
     * @param {CanvasUpdateArgs} args - Arguments to update one Canvas.
     * @example
     * // Update one Canvas
     * const canvas = await prisma.canvas.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CanvasUpdateArgs>(args: SelectSubset<T, CanvasUpdateArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Canvas.
     * @param {CanvasDeleteManyArgs} args - Arguments to filter Canvas to delete.
     * @example
     * // Delete a few Canvas
     * const { count } = await prisma.canvas.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CanvasDeleteManyArgs>(args?: SelectSubset<T, CanvasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Canvas
     * const canvas = await prisma.canvas.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CanvasUpdateManyArgs>(args: SelectSubset<T, CanvasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Canvas and returns the data updated in the database.
     * @param {CanvasUpdateManyAndReturnArgs} args - Arguments to update many Canvas.
     * @example
     * // Update many Canvas
     * const canvas = await prisma.canvas.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Canvas and only return the `id`
     * const canvasWithIdOnly = await prisma.canvas.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CanvasUpdateManyAndReturnArgs>(args: SelectSubset<T, CanvasUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Canvas.
     * @param {CanvasUpsertArgs} args - Arguments to update or create a Canvas.
     * @example
     * // Update or create a Canvas
     * const canvas = await prisma.canvas.upsert({
     *   create: {
     *     // ... data to create a Canvas
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Canvas we want to update
     *   }
     * })
     */
    upsert<T extends CanvasUpsertArgs>(args: SelectSubset<T, CanvasUpsertArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasCountArgs} args - Arguments to filter Canvas to count.
     * @example
     * // Count the number of Canvas
     * const count = await prisma.canvas.count({
     *   where: {
     *     // ... the filter for the Canvas we want to count
     *   }
     * })
    **/
    count<T extends CanvasCountArgs>(
      args?: Subset<T, CanvasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CanvasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CanvasAggregateArgs>(args: Subset<T, CanvasAggregateArgs>): Prisma.PrismaPromise<GetCanvasAggregateType<T>>

    /**
     * Group by Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CanvasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CanvasGroupByArgs['orderBy'] }
        : { orderBy?: CanvasGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CanvasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCanvasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Canvas model
   */
  readonly fields: CanvasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Canvas.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CanvasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    canvasBlocks<T extends Canvas$canvasBlocksArgs<ExtArgs> = {}>(args?: Subset<T, Canvas$canvasBlocksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Canvas model
   */
  interface CanvasFieldRefs {
    readonly id: FieldRef<"Canvas", 'String'>
    readonly projectId: FieldRef<"Canvas", 'String'>
    readonly name: FieldRef<"Canvas", 'String'>
    readonly order: FieldRef<"Canvas", 'Int'>
    readonly createdAt: FieldRef<"Canvas", 'DateTime'>
    readonly updatedAt: FieldRef<"Canvas", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Canvas findUnique
   */
  export type CanvasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas findUniqueOrThrow
   */
  export type CanvasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas findFirst
   */
  export type CanvasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Canvas.
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Canvas.
     */
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * Canvas findFirstOrThrow
   */
  export type CanvasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Canvas.
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Canvas.
     */
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * Canvas findMany
   */
  export type CanvasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Canvas.
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * Canvas create
   */
  export type CanvasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * The data needed to create a Canvas.
     */
    data: XOR<CanvasCreateInput, CanvasUncheckedCreateInput>
  }

  /**
   * Canvas createMany
   */
  export type CanvasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Canvas.
     */
    data: CanvasCreateManyInput | CanvasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Canvas createManyAndReturn
   */
  export type CanvasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * The data used to create many Canvas.
     */
    data: CanvasCreateManyInput | CanvasCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Canvas update
   */
  export type CanvasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * The data needed to update a Canvas.
     */
    data: XOR<CanvasUpdateInput, CanvasUncheckedUpdateInput>
    /**
     * Choose, which Canvas to update.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas updateMany
   */
  export type CanvasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Canvas.
     */
    data: XOR<CanvasUpdateManyMutationInput, CanvasUncheckedUpdateManyInput>
    /**
     * Filter which Canvas to update
     */
    where?: CanvasWhereInput
    /**
     * Limit how many Canvas to update.
     */
    limit?: number
  }

  /**
   * Canvas updateManyAndReturn
   */
  export type CanvasUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * The data used to update Canvas.
     */
    data: XOR<CanvasUpdateManyMutationInput, CanvasUncheckedUpdateManyInput>
    /**
     * Filter which Canvas to update
     */
    where?: CanvasWhereInput
    /**
     * Limit how many Canvas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Canvas upsert
   */
  export type CanvasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * The filter to search for the Canvas to update in case it exists.
     */
    where: CanvasWhereUniqueInput
    /**
     * In case the Canvas found by the `where` argument doesn't exist, create a new Canvas with this data.
     */
    create: XOR<CanvasCreateInput, CanvasUncheckedCreateInput>
    /**
     * In case the Canvas was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CanvasUpdateInput, CanvasUncheckedUpdateInput>
  }

  /**
   * Canvas delete
   */
  export type CanvasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter which Canvas to delete.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas deleteMany
   */
  export type CanvasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Canvas to delete
     */
    where?: CanvasWhereInput
    /**
     * Limit how many Canvas to delete.
     */
    limit?: number
  }

  /**
   * Canvas.canvasBlocks
   */
  export type Canvas$canvasBlocksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    where?: CanvasBlockWhereInput
    orderBy?: CanvasBlockOrderByWithRelationInput | CanvasBlockOrderByWithRelationInput[]
    cursor?: CanvasBlockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasBlockScalarFieldEnum | CanvasBlockScalarFieldEnum[]
  }

  /**
   * Canvas without action
   */
  export type CanvasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Canvas
     */
    omit?: CanvasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
  }


  /**
   * Model CanvasBlock
   */

  export type AggregateCanvasBlock = {
    _count: CanvasBlockCountAggregateOutputType | null
    _avg: CanvasBlockAvgAggregateOutputType | null
    _sum: CanvasBlockSumAggregateOutputType | null
    _min: CanvasBlockMinAggregateOutputType | null
    _max: CanvasBlockMaxAggregateOutputType | null
  }

  export type CanvasBlockAvgAggregateOutputType = {
    order: number | null
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  }

  export type CanvasBlockSumAggregateOutputType = {
    order: number | null
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  }

  export type CanvasBlockMinAggregateOutputType = {
    id: string | null
    canvasId: string | null
    order: number | null
    type: string | null
    x: number | null
    y: number | null
    width: number | null
    height: number | null
    color: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CanvasBlockMaxAggregateOutputType = {
    id: string | null
    canvasId: string | null
    order: number | null
    type: string | null
    x: number | null
    y: number | null
    width: number | null
    height: number | null
    color: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CanvasBlockCountAggregateOutputType = {
    id: number
    canvasId: number
    order: number
    type: number
    x: number
    y: number
    width: number
    height: number
    content: number
    color: number
    title: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CanvasBlockAvgAggregateInputType = {
    order?: true
    x?: true
    y?: true
    width?: true
    height?: true
  }

  export type CanvasBlockSumAggregateInputType = {
    order?: true
    x?: true
    y?: true
    width?: true
    height?: true
  }

  export type CanvasBlockMinAggregateInputType = {
    id?: true
    canvasId?: true
    order?: true
    type?: true
    x?: true
    y?: true
    width?: true
    height?: true
    color?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CanvasBlockMaxAggregateInputType = {
    id?: true
    canvasId?: true
    order?: true
    type?: true
    x?: true
    y?: true
    width?: true
    height?: true
    color?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CanvasBlockCountAggregateInputType = {
    id?: true
    canvasId?: true
    order?: true
    type?: true
    x?: true
    y?: true
    width?: true
    height?: true
    content?: true
    color?: true
    title?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CanvasBlockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanvasBlock to aggregate.
     */
    where?: CanvasBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasBlocks to fetch.
     */
    orderBy?: CanvasBlockOrderByWithRelationInput | CanvasBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CanvasBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CanvasBlocks
    **/
    _count?: true | CanvasBlockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CanvasBlockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CanvasBlockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CanvasBlockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CanvasBlockMaxAggregateInputType
  }

  export type GetCanvasBlockAggregateType<T extends CanvasBlockAggregateArgs> = {
        [P in keyof T & keyof AggregateCanvasBlock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCanvasBlock[P]>
      : GetScalarType<T[P], AggregateCanvasBlock[P]>
  }




  export type CanvasBlockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasBlockWhereInput
    orderBy?: CanvasBlockOrderByWithAggregationInput | CanvasBlockOrderByWithAggregationInput[]
    by: CanvasBlockScalarFieldEnum[] | CanvasBlockScalarFieldEnum
    having?: CanvasBlockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CanvasBlockCountAggregateInputType | true
    _avg?: CanvasBlockAvgAggregateInputType
    _sum?: CanvasBlockSumAggregateInputType
    _min?: CanvasBlockMinAggregateInputType
    _max?: CanvasBlockMaxAggregateInputType
  }

  export type CanvasBlockGroupByOutputType = {
    id: string
    canvasId: string
    order: number
    type: string
    x: number
    y: number
    width: number
    height: number
    content: JsonValue
    color: string | null
    title: string | null
    createdAt: Date
    updatedAt: Date
    _count: CanvasBlockCountAggregateOutputType | null
    _avg: CanvasBlockAvgAggregateOutputType | null
    _sum: CanvasBlockSumAggregateOutputType | null
    _min: CanvasBlockMinAggregateOutputType | null
    _max: CanvasBlockMaxAggregateOutputType | null
  }

  type GetCanvasBlockGroupByPayload<T extends CanvasBlockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CanvasBlockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CanvasBlockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CanvasBlockGroupByOutputType[P]>
            : GetScalarType<T[P], CanvasBlockGroupByOutputType[P]>
        }
      >
    >


  export type CanvasBlockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canvasId?: boolean
    order?: boolean
    type?: boolean
    x?: boolean
    y?: boolean
    width?: boolean
    height?: boolean
    content?: boolean
    color?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvasBlock"]>

  export type CanvasBlockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canvasId?: boolean
    order?: boolean
    type?: boolean
    x?: boolean
    y?: boolean
    width?: boolean
    height?: boolean
    content?: boolean
    color?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvasBlock"]>

  export type CanvasBlockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canvasId?: boolean
    order?: boolean
    type?: boolean
    x?: boolean
    y?: boolean
    width?: boolean
    height?: boolean
    content?: boolean
    color?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvasBlock"]>

  export type CanvasBlockSelectScalar = {
    id?: boolean
    canvasId?: boolean
    order?: boolean
    type?: boolean
    x?: boolean
    y?: boolean
    width?: boolean
    height?: boolean
    content?: boolean
    color?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CanvasBlockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "canvasId" | "order" | "type" | "x" | "y" | "width" | "height" | "content" | "color" | "title" | "createdAt" | "updatedAt", ExtArgs["result"]["canvasBlock"]>
  export type CanvasBlockInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
  }
  export type CanvasBlockIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
  }
  export type CanvasBlockIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
  }

  export type $CanvasBlockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CanvasBlock"
    objects: {
      canvas: Prisma.$CanvasPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      canvasId: string
      order: number
      type: string
      x: number
      y: number
      width: number
      height: number
      content: Prisma.JsonValue
      color: string | null
      title: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["canvasBlock"]>
    composites: {}
  }

  type CanvasBlockGetPayload<S extends boolean | null | undefined | CanvasBlockDefaultArgs> = $Result.GetResult<Prisma.$CanvasBlockPayload, S>

  type CanvasBlockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CanvasBlockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CanvasBlockCountAggregateInputType | true
    }

  export interface CanvasBlockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CanvasBlock'], meta: { name: 'CanvasBlock' } }
    /**
     * Find zero or one CanvasBlock that matches the filter.
     * @param {CanvasBlockFindUniqueArgs} args - Arguments to find a CanvasBlock
     * @example
     * // Get one CanvasBlock
     * const canvasBlock = await prisma.canvasBlock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CanvasBlockFindUniqueArgs>(args: SelectSubset<T, CanvasBlockFindUniqueArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CanvasBlock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CanvasBlockFindUniqueOrThrowArgs} args - Arguments to find a CanvasBlock
     * @example
     * // Get one CanvasBlock
     * const canvasBlock = await prisma.canvasBlock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CanvasBlockFindUniqueOrThrowArgs>(args: SelectSubset<T, CanvasBlockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CanvasBlock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasBlockFindFirstArgs} args - Arguments to find a CanvasBlock
     * @example
     * // Get one CanvasBlock
     * const canvasBlock = await prisma.canvasBlock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CanvasBlockFindFirstArgs>(args?: SelectSubset<T, CanvasBlockFindFirstArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CanvasBlock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasBlockFindFirstOrThrowArgs} args - Arguments to find a CanvasBlock
     * @example
     * // Get one CanvasBlock
     * const canvasBlock = await prisma.canvasBlock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CanvasBlockFindFirstOrThrowArgs>(args?: SelectSubset<T, CanvasBlockFindFirstOrThrowArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CanvasBlocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasBlockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CanvasBlocks
     * const canvasBlocks = await prisma.canvasBlock.findMany()
     * 
     * // Get first 10 CanvasBlocks
     * const canvasBlocks = await prisma.canvasBlock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const canvasBlockWithIdOnly = await prisma.canvasBlock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CanvasBlockFindManyArgs>(args?: SelectSubset<T, CanvasBlockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CanvasBlock.
     * @param {CanvasBlockCreateArgs} args - Arguments to create a CanvasBlock.
     * @example
     * // Create one CanvasBlock
     * const CanvasBlock = await prisma.canvasBlock.create({
     *   data: {
     *     // ... data to create a CanvasBlock
     *   }
     * })
     * 
     */
    create<T extends CanvasBlockCreateArgs>(args: SelectSubset<T, CanvasBlockCreateArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CanvasBlocks.
     * @param {CanvasBlockCreateManyArgs} args - Arguments to create many CanvasBlocks.
     * @example
     * // Create many CanvasBlocks
     * const canvasBlock = await prisma.canvasBlock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CanvasBlockCreateManyArgs>(args?: SelectSubset<T, CanvasBlockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CanvasBlocks and returns the data saved in the database.
     * @param {CanvasBlockCreateManyAndReturnArgs} args - Arguments to create many CanvasBlocks.
     * @example
     * // Create many CanvasBlocks
     * const canvasBlock = await prisma.canvasBlock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CanvasBlocks and only return the `id`
     * const canvasBlockWithIdOnly = await prisma.canvasBlock.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CanvasBlockCreateManyAndReturnArgs>(args?: SelectSubset<T, CanvasBlockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CanvasBlock.
     * @param {CanvasBlockDeleteArgs} args - Arguments to delete one CanvasBlock.
     * @example
     * // Delete one CanvasBlock
     * const CanvasBlock = await prisma.canvasBlock.delete({
     *   where: {
     *     // ... filter to delete one CanvasBlock
     *   }
     * })
     * 
     */
    delete<T extends CanvasBlockDeleteArgs>(args: SelectSubset<T, CanvasBlockDeleteArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CanvasBlock.
     * @param {CanvasBlockUpdateArgs} args - Arguments to update one CanvasBlock.
     * @example
     * // Update one CanvasBlock
     * const canvasBlock = await prisma.canvasBlock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CanvasBlockUpdateArgs>(args: SelectSubset<T, CanvasBlockUpdateArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CanvasBlocks.
     * @param {CanvasBlockDeleteManyArgs} args - Arguments to filter CanvasBlocks to delete.
     * @example
     * // Delete a few CanvasBlocks
     * const { count } = await prisma.canvasBlock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CanvasBlockDeleteManyArgs>(args?: SelectSubset<T, CanvasBlockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CanvasBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasBlockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CanvasBlocks
     * const canvasBlock = await prisma.canvasBlock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CanvasBlockUpdateManyArgs>(args: SelectSubset<T, CanvasBlockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CanvasBlocks and returns the data updated in the database.
     * @param {CanvasBlockUpdateManyAndReturnArgs} args - Arguments to update many CanvasBlocks.
     * @example
     * // Update many CanvasBlocks
     * const canvasBlock = await prisma.canvasBlock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CanvasBlocks and only return the `id`
     * const canvasBlockWithIdOnly = await prisma.canvasBlock.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CanvasBlockUpdateManyAndReturnArgs>(args: SelectSubset<T, CanvasBlockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CanvasBlock.
     * @param {CanvasBlockUpsertArgs} args - Arguments to update or create a CanvasBlock.
     * @example
     * // Update or create a CanvasBlock
     * const canvasBlock = await prisma.canvasBlock.upsert({
     *   create: {
     *     // ... data to create a CanvasBlock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CanvasBlock we want to update
     *   }
     * })
     */
    upsert<T extends CanvasBlockUpsertArgs>(args: SelectSubset<T, CanvasBlockUpsertArgs<ExtArgs>>): Prisma__CanvasBlockClient<$Result.GetResult<Prisma.$CanvasBlockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CanvasBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasBlockCountArgs} args - Arguments to filter CanvasBlocks to count.
     * @example
     * // Count the number of CanvasBlocks
     * const count = await prisma.canvasBlock.count({
     *   where: {
     *     // ... the filter for the CanvasBlocks we want to count
     *   }
     * })
    **/
    count<T extends CanvasBlockCountArgs>(
      args?: Subset<T, CanvasBlockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CanvasBlockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CanvasBlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasBlockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CanvasBlockAggregateArgs>(args: Subset<T, CanvasBlockAggregateArgs>): Prisma.PrismaPromise<GetCanvasBlockAggregateType<T>>

    /**
     * Group by CanvasBlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasBlockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CanvasBlockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CanvasBlockGroupByArgs['orderBy'] }
        : { orderBy?: CanvasBlockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CanvasBlockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCanvasBlockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CanvasBlock model
   */
  readonly fields: CanvasBlockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CanvasBlock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CanvasBlockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    canvas<T extends CanvasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CanvasDefaultArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CanvasBlock model
   */
  interface CanvasBlockFieldRefs {
    readonly id: FieldRef<"CanvasBlock", 'String'>
    readonly canvasId: FieldRef<"CanvasBlock", 'String'>
    readonly order: FieldRef<"CanvasBlock", 'Int'>
    readonly type: FieldRef<"CanvasBlock", 'String'>
    readonly x: FieldRef<"CanvasBlock", 'Float'>
    readonly y: FieldRef<"CanvasBlock", 'Float'>
    readonly width: FieldRef<"CanvasBlock", 'Float'>
    readonly height: FieldRef<"CanvasBlock", 'Float'>
    readonly content: FieldRef<"CanvasBlock", 'Json'>
    readonly color: FieldRef<"CanvasBlock", 'String'>
    readonly title: FieldRef<"CanvasBlock", 'String'>
    readonly createdAt: FieldRef<"CanvasBlock", 'DateTime'>
    readonly updatedAt: FieldRef<"CanvasBlock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CanvasBlock findUnique
   */
  export type CanvasBlockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * Filter, which CanvasBlock to fetch.
     */
    where: CanvasBlockWhereUniqueInput
  }

  /**
   * CanvasBlock findUniqueOrThrow
   */
  export type CanvasBlockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * Filter, which CanvasBlock to fetch.
     */
    where: CanvasBlockWhereUniqueInput
  }

  /**
   * CanvasBlock findFirst
   */
  export type CanvasBlockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * Filter, which CanvasBlock to fetch.
     */
    where?: CanvasBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasBlocks to fetch.
     */
    orderBy?: CanvasBlockOrderByWithRelationInput | CanvasBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanvasBlocks.
     */
    cursor?: CanvasBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanvasBlocks.
     */
    distinct?: CanvasBlockScalarFieldEnum | CanvasBlockScalarFieldEnum[]
  }

  /**
   * CanvasBlock findFirstOrThrow
   */
  export type CanvasBlockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * Filter, which CanvasBlock to fetch.
     */
    where?: CanvasBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasBlocks to fetch.
     */
    orderBy?: CanvasBlockOrderByWithRelationInput | CanvasBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanvasBlocks.
     */
    cursor?: CanvasBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanvasBlocks.
     */
    distinct?: CanvasBlockScalarFieldEnum | CanvasBlockScalarFieldEnum[]
  }

  /**
   * CanvasBlock findMany
   */
  export type CanvasBlockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * Filter, which CanvasBlocks to fetch.
     */
    where?: CanvasBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasBlocks to fetch.
     */
    orderBy?: CanvasBlockOrderByWithRelationInput | CanvasBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CanvasBlocks.
     */
    cursor?: CanvasBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasBlocks.
     */
    skip?: number
    distinct?: CanvasBlockScalarFieldEnum | CanvasBlockScalarFieldEnum[]
  }

  /**
   * CanvasBlock create
   */
  export type CanvasBlockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * The data needed to create a CanvasBlock.
     */
    data: XOR<CanvasBlockCreateInput, CanvasBlockUncheckedCreateInput>
  }

  /**
   * CanvasBlock createMany
   */
  export type CanvasBlockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CanvasBlocks.
     */
    data: CanvasBlockCreateManyInput | CanvasBlockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CanvasBlock createManyAndReturn
   */
  export type CanvasBlockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * The data used to create many CanvasBlocks.
     */
    data: CanvasBlockCreateManyInput | CanvasBlockCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CanvasBlock update
   */
  export type CanvasBlockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * The data needed to update a CanvasBlock.
     */
    data: XOR<CanvasBlockUpdateInput, CanvasBlockUncheckedUpdateInput>
    /**
     * Choose, which CanvasBlock to update.
     */
    where: CanvasBlockWhereUniqueInput
  }

  /**
   * CanvasBlock updateMany
   */
  export type CanvasBlockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CanvasBlocks.
     */
    data: XOR<CanvasBlockUpdateManyMutationInput, CanvasBlockUncheckedUpdateManyInput>
    /**
     * Filter which CanvasBlocks to update
     */
    where?: CanvasBlockWhereInput
    /**
     * Limit how many CanvasBlocks to update.
     */
    limit?: number
  }

  /**
   * CanvasBlock updateManyAndReturn
   */
  export type CanvasBlockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * The data used to update CanvasBlocks.
     */
    data: XOR<CanvasBlockUpdateManyMutationInput, CanvasBlockUncheckedUpdateManyInput>
    /**
     * Filter which CanvasBlocks to update
     */
    where?: CanvasBlockWhereInput
    /**
     * Limit how many CanvasBlocks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CanvasBlock upsert
   */
  export type CanvasBlockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * The filter to search for the CanvasBlock to update in case it exists.
     */
    where: CanvasBlockWhereUniqueInput
    /**
     * In case the CanvasBlock found by the `where` argument doesn't exist, create a new CanvasBlock with this data.
     */
    create: XOR<CanvasBlockCreateInput, CanvasBlockUncheckedCreateInput>
    /**
     * In case the CanvasBlock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CanvasBlockUpdateInput, CanvasBlockUncheckedUpdateInput>
  }

  /**
   * CanvasBlock delete
   */
  export type CanvasBlockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
    /**
     * Filter which CanvasBlock to delete.
     */
    where: CanvasBlockWhereUniqueInput
  }

  /**
   * CanvasBlock deleteMany
   */
  export type CanvasBlockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanvasBlocks to delete
     */
    where?: CanvasBlockWhereInput
    /**
     * Limit how many CanvasBlocks to delete.
     */
    limit?: number
  }

  /**
   * CanvasBlock without action
   */
  export type CanvasBlockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasBlock
     */
    select?: CanvasBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanvasBlock
     */
    omit?: CanvasBlockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasBlockInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    description: 'description',
    icon: 'icon',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const CanvasScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CanvasScalarFieldEnum = (typeof CanvasScalarFieldEnum)[keyof typeof CanvasScalarFieldEnum]


  export const CanvasBlockScalarFieldEnum: {
    id: 'id',
    canvasId: 'canvasId',
    order: 'order',
    type: 'type',
    x: 'x',
    y: 'y',
    width: 'width',
    height: 'height',
    content: 'content',
    color: 'color',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CanvasBlockScalarFieldEnum = (typeof CanvasBlockScalarFieldEnum)[keyof typeof CanvasBlockScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    userId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    icon?: StringNullableFilter<"Project"> | string | null
    status?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    canvases?: CanvasListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    canvases?: CanvasOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    userId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    icon?: StringNullableFilter<"Project"> | string | null
    status?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    canvases?: CanvasListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    userId?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    icon?: StringNullableWithAggregatesFilter<"Project"> | string | null
    status?: StringWithAggregatesFilter<"Project"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type CanvasWhereInput = {
    AND?: CanvasWhereInput | CanvasWhereInput[]
    OR?: CanvasWhereInput[]
    NOT?: CanvasWhereInput | CanvasWhereInput[]
    id?: StringFilter<"Canvas"> | string
    projectId?: StringFilter<"Canvas"> | string
    name?: StringFilter<"Canvas"> | string
    order?: IntFilter<"Canvas"> | number
    createdAt?: DateTimeFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeFilter<"Canvas"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    canvasBlocks?: CanvasBlockListRelationFilter
  }

  export type CanvasOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    canvasBlocks?: CanvasBlockOrderByRelationAggregateInput
  }

  export type CanvasWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CanvasWhereInput | CanvasWhereInput[]
    OR?: CanvasWhereInput[]
    NOT?: CanvasWhereInput | CanvasWhereInput[]
    projectId?: StringFilter<"Canvas"> | string
    name?: StringFilter<"Canvas"> | string
    order?: IntFilter<"Canvas"> | number
    createdAt?: DateTimeFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeFilter<"Canvas"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    canvasBlocks?: CanvasBlockListRelationFilter
  }, "id">

  export type CanvasOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CanvasCountOrderByAggregateInput
    _avg?: CanvasAvgOrderByAggregateInput
    _max?: CanvasMaxOrderByAggregateInput
    _min?: CanvasMinOrderByAggregateInput
    _sum?: CanvasSumOrderByAggregateInput
  }

  export type CanvasScalarWhereWithAggregatesInput = {
    AND?: CanvasScalarWhereWithAggregatesInput | CanvasScalarWhereWithAggregatesInput[]
    OR?: CanvasScalarWhereWithAggregatesInput[]
    NOT?: CanvasScalarWhereWithAggregatesInput | CanvasScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Canvas"> | string
    projectId?: StringWithAggregatesFilter<"Canvas"> | string
    name?: StringWithAggregatesFilter<"Canvas"> | string
    order?: IntWithAggregatesFilter<"Canvas"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Canvas"> | Date | string
  }

  export type CanvasBlockWhereInput = {
    AND?: CanvasBlockWhereInput | CanvasBlockWhereInput[]
    OR?: CanvasBlockWhereInput[]
    NOT?: CanvasBlockWhereInput | CanvasBlockWhereInput[]
    id?: StringFilter<"CanvasBlock"> | string
    canvasId?: StringFilter<"CanvasBlock"> | string
    order?: IntFilter<"CanvasBlock"> | number
    type?: StringFilter<"CanvasBlock"> | string
    x?: FloatFilter<"CanvasBlock"> | number
    y?: FloatFilter<"CanvasBlock"> | number
    width?: FloatFilter<"CanvasBlock"> | number
    height?: FloatFilter<"CanvasBlock"> | number
    content?: JsonFilter<"CanvasBlock">
    color?: StringNullableFilter<"CanvasBlock"> | string | null
    title?: StringNullableFilter<"CanvasBlock"> | string | null
    createdAt?: DateTimeFilter<"CanvasBlock"> | Date | string
    updatedAt?: DateTimeFilter<"CanvasBlock"> | Date | string
    canvas?: XOR<CanvasScalarRelationFilter, CanvasWhereInput>
  }

  export type CanvasBlockOrderByWithRelationInput = {
    id?: SortOrder
    canvasId?: SortOrder
    order?: SortOrder
    type?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrder
    color?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    canvas?: CanvasOrderByWithRelationInput
  }

  export type CanvasBlockWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CanvasBlockWhereInput | CanvasBlockWhereInput[]
    OR?: CanvasBlockWhereInput[]
    NOT?: CanvasBlockWhereInput | CanvasBlockWhereInput[]
    canvasId?: StringFilter<"CanvasBlock"> | string
    order?: IntFilter<"CanvasBlock"> | number
    type?: StringFilter<"CanvasBlock"> | string
    x?: FloatFilter<"CanvasBlock"> | number
    y?: FloatFilter<"CanvasBlock"> | number
    width?: FloatFilter<"CanvasBlock"> | number
    height?: FloatFilter<"CanvasBlock"> | number
    content?: JsonFilter<"CanvasBlock">
    color?: StringNullableFilter<"CanvasBlock"> | string | null
    title?: StringNullableFilter<"CanvasBlock"> | string | null
    createdAt?: DateTimeFilter<"CanvasBlock"> | Date | string
    updatedAt?: DateTimeFilter<"CanvasBlock"> | Date | string
    canvas?: XOR<CanvasScalarRelationFilter, CanvasWhereInput>
  }, "id">

  export type CanvasBlockOrderByWithAggregationInput = {
    id?: SortOrder
    canvasId?: SortOrder
    order?: SortOrder
    type?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrder
    color?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CanvasBlockCountOrderByAggregateInput
    _avg?: CanvasBlockAvgOrderByAggregateInput
    _max?: CanvasBlockMaxOrderByAggregateInput
    _min?: CanvasBlockMinOrderByAggregateInput
    _sum?: CanvasBlockSumOrderByAggregateInput
  }

  export type CanvasBlockScalarWhereWithAggregatesInput = {
    AND?: CanvasBlockScalarWhereWithAggregatesInput | CanvasBlockScalarWhereWithAggregatesInput[]
    OR?: CanvasBlockScalarWhereWithAggregatesInput[]
    NOT?: CanvasBlockScalarWhereWithAggregatesInput | CanvasBlockScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CanvasBlock"> | string
    canvasId?: StringWithAggregatesFilter<"CanvasBlock"> | string
    order?: IntWithAggregatesFilter<"CanvasBlock"> | number
    type?: StringWithAggregatesFilter<"CanvasBlock"> | string
    x?: FloatWithAggregatesFilter<"CanvasBlock"> | number
    y?: FloatWithAggregatesFilter<"CanvasBlock"> | number
    width?: FloatWithAggregatesFilter<"CanvasBlock"> | number
    height?: FloatWithAggregatesFilter<"CanvasBlock"> | number
    content?: JsonWithAggregatesFilter<"CanvasBlock">
    color?: StringNullableWithAggregatesFilter<"CanvasBlock"> | string | null
    title?: StringNullableWithAggregatesFilter<"CanvasBlock"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CanvasBlock"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CanvasBlock"> | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    icon?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    canvases?: CanvasCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    icon?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    canvases?: CanvasUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    canvases?: CanvasUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    canvases?: CanvasUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    icon?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasCreateInput = {
    id?: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutCanvasesInput
    canvasBlocks?: CanvasBlockCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUncheckedCreateInput = {
    id?: string
    projectId: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    canvasBlocks?: CanvasBlockUncheckedCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutCanvasesNestedInput
    canvasBlocks?: CanvasBlockUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    canvasBlocks?: CanvasBlockUncheckedUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasCreateManyInput = {
    id?: string
    projectId: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasBlockCreateInput = {
    id?: string
    order: number
    type: string
    x: number
    y: number
    width: number
    height: number
    content: JsonNullValueInput | InputJsonValue
    color?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    canvas: CanvasCreateNestedOneWithoutCanvasBlocksInput
  }

  export type CanvasBlockUncheckedCreateInput = {
    id?: string
    canvasId: string
    order: number
    type: string
    x: number
    y: number
    width: number
    height: number
    content: JsonNullValueInput | InputJsonValue
    color?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasBlockUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    color?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    canvas?: CanvasUpdateOneRequiredWithoutCanvasBlocksNestedInput
  }

  export type CanvasBlockUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    color?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasBlockCreateManyInput = {
    id?: string
    canvasId: string
    order: number
    type: string
    x: number
    y: number
    width: number
    height: number
    content: JsonNullValueInput | InputJsonValue
    color?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasBlockUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    color?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasBlockUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    color?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CanvasListRelationFilter = {
    every?: CanvasWhereInput
    some?: CanvasWhereInput
    none?: CanvasWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CanvasOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type CanvasBlockListRelationFilter = {
    every?: CanvasBlockWhereInput
    some?: CanvasBlockWhereInput
    none?: CanvasBlockWhereInput
  }

  export type CanvasBlockOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CanvasCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CanvasAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type CanvasMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CanvasMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CanvasSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CanvasScalarRelationFilter = {
    is?: CanvasWhereInput
    isNot?: CanvasWhereInput
  }

  export type CanvasBlockCountOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    order?: SortOrder
    type?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrder
    color?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CanvasBlockAvgOrderByAggregateInput = {
    order?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type CanvasBlockMaxOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    order?: SortOrder
    type?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    color?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CanvasBlockMinOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    order?: SortOrder
    type?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    color?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CanvasBlockSumOrderByAggregateInput = {
    order?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type CanvasCreateNestedManyWithoutProjectInput = {
    create?: XOR<CanvasCreateWithoutProjectInput, CanvasUncheckedCreateWithoutProjectInput> | CanvasCreateWithoutProjectInput[] | CanvasUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutProjectInput | CanvasCreateOrConnectWithoutProjectInput[]
    createMany?: CanvasCreateManyProjectInputEnvelope
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
  }

  export type CanvasUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<CanvasCreateWithoutProjectInput, CanvasUncheckedCreateWithoutProjectInput> | CanvasCreateWithoutProjectInput[] | CanvasUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutProjectInput | CanvasCreateOrConnectWithoutProjectInput[]
    createMany?: CanvasCreateManyProjectInputEnvelope
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CanvasUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CanvasCreateWithoutProjectInput, CanvasUncheckedCreateWithoutProjectInput> | CanvasCreateWithoutProjectInput[] | CanvasUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutProjectInput | CanvasCreateOrConnectWithoutProjectInput[]
    upsert?: CanvasUpsertWithWhereUniqueWithoutProjectInput | CanvasUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CanvasCreateManyProjectInputEnvelope
    set?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    disconnect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    delete?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    update?: CanvasUpdateWithWhereUniqueWithoutProjectInput | CanvasUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CanvasUpdateManyWithWhereWithoutProjectInput | CanvasUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
  }

  export type CanvasUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CanvasCreateWithoutProjectInput, CanvasUncheckedCreateWithoutProjectInput> | CanvasCreateWithoutProjectInput[] | CanvasUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutProjectInput | CanvasCreateOrConnectWithoutProjectInput[]
    upsert?: CanvasUpsertWithWhereUniqueWithoutProjectInput | CanvasUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CanvasCreateManyProjectInputEnvelope
    set?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    disconnect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    delete?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    update?: CanvasUpdateWithWhereUniqueWithoutProjectInput | CanvasUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CanvasUpdateManyWithWhereWithoutProjectInput | CanvasUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutCanvasesInput = {
    create?: XOR<ProjectCreateWithoutCanvasesInput, ProjectUncheckedCreateWithoutCanvasesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCanvasesInput
    connect?: ProjectWhereUniqueInput
  }

  export type CanvasBlockCreateNestedManyWithoutCanvasInput = {
    create?: XOR<CanvasBlockCreateWithoutCanvasInput, CanvasBlockUncheckedCreateWithoutCanvasInput> | CanvasBlockCreateWithoutCanvasInput[] | CanvasBlockUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasBlockCreateOrConnectWithoutCanvasInput | CanvasBlockCreateOrConnectWithoutCanvasInput[]
    createMany?: CanvasBlockCreateManyCanvasInputEnvelope
    connect?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
  }

  export type CanvasBlockUncheckedCreateNestedManyWithoutCanvasInput = {
    create?: XOR<CanvasBlockCreateWithoutCanvasInput, CanvasBlockUncheckedCreateWithoutCanvasInput> | CanvasBlockCreateWithoutCanvasInput[] | CanvasBlockUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasBlockCreateOrConnectWithoutCanvasInput | CanvasBlockCreateOrConnectWithoutCanvasInput[]
    createMany?: CanvasBlockCreateManyCanvasInputEnvelope
    connect?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutCanvasesNestedInput = {
    create?: XOR<ProjectCreateWithoutCanvasesInput, ProjectUncheckedCreateWithoutCanvasesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCanvasesInput
    upsert?: ProjectUpsertWithoutCanvasesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutCanvasesInput, ProjectUpdateWithoutCanvasesInput>, ProjectUncheckedUpdateWithoutCanvasesInput>
  }

  export type CanvasBlockUpdateManyWithoutCanvasNestedInput = {
    create?: XOR<CanvasBlockCreateWithoutCanvasInput, CanvasBlockUncheckedCreateWithoutCanvasInput> | CanvasBlockCreateWithoutCanvasInput[] | CanvasBlockUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasBlockCreateOrConnectWithoutCanvasInput | CanvasBlockCreateOrConnectWithoutCanvasInput[]
    upsert?: CanvasBlockUpsertWithWhereUniqueWithoutCanvasInput | CanvasBlockUpsertWithWhereUniqueWithoutCanvasInput[]
    createMany?: CanvasBlockCreateManyCanvasInputEnvelope
    set?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    disconnect?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    delete?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    connect?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    update?: CanvasBlockUpdateWithWhereUniqueWithoutCanvasInput | CanvasBlockUpdateWithWhereUniqueWithoutCanvasInput[]
    updateMany?: CanvasBlockUpdateManyWithWhereWithoutCanvasInput | CanvasBlockUpdateManyWithWhereWithoutCanvasInput[]
    deleteMany?: CanvasBlockScalarWhereInput | CanvasBlockScalarWhereInput[]
  }

  export type CanvasBlockUncheckedUpdateManyWithoutCanvasNestedInput = {
    create?: XOR<CanvasBlockCreateWithoutCanvasInput, CanvasBlockUncheckedCreateWithoutCanvasInput> | CanvasBlockCreateWithoutCanvasInput[] | CanvasBlockUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasBlockCreateOrConnectWithoutCanvasInput | CanvasBlockCreateOrConnectWithoutCanvasInput[]
    upsert?: CanvasBlockUpsertWithWhereUniqueWithoutCanvasInput | CanvasBlockUpsertWithWhereUniqueWithoutCanvasInput[]
    createMany?: CanvasBlockCreateManyCanvasInputEnvelope
    set?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    disconnect?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    delete?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    connect?: CanvasBlockWhereUniqueInput | CanvasBlockWhereUniqueInput[]
    update?: CanvasBlockUpdateWithWhereUniqueWithoutCanvasInput | CanvasBlockUpdateWithWhereUniqueWithoutCanvasInput[]
    updateMany?: CanvasBlockUpdateManyWithWhereWithoutCanvasInput | CanvasBlockUpdateManyWithWhereWithoutCanvasInput[]
    deleteMany?: CanvasBlockScalarWhereInput | CanvasBlockScalarWhereInput[]
  }

  export type CanvasCreateNestedOneWithoutCanvasBlocksInput = {
    create?: XOR<CanvasCreateWithoutCanvasBlocksInput, CanvasUncheckedCreateWithoutCanvasBlocksInput>
    connectOrCreate?: CanvasCreateOrConnectWithoutCanvasBlocksInput
    connect?: CanvasWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CanvasUpdateOneRequiredWithoutCanvasBlocksNestedInput = {
    create?: XOR<CanvasCreateWithoutCanvasBlocksInput, CanvasUncheckedCreateWithoutCanvasBlocksInput>
    connectOrCreate?: CanvasCreateOrConnectWithoutCanvasBlocksInput
    upsert?: CanvasUpsertWithoutCanvasBlocksInput
    connect?: CanvasWhereUniqueInput
    update?: XOR<XOR<CanvasUpdateToOneWithWhereWithoutCanvasBlocksInput, CanvasUpdateWithoutCanvasBlocksInput>, CanvasUncheckedUpdateWithoutCanvasBlocksInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CanvasCreateWithoutProjectInput = {
    id?: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    canvasBlocks?: CanvasBlockCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUncheckedCreateWithoutProjectInput = {
    id?: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    canvasBlocks?: CanvasBlockUncheckedCreateNestedManyWithoutCanvasInput
  }

  export type CanvasCreateOrConnectWithoutProjectInput = {
    where: CanvasWhereUniqueInput
    create: XOR<CanvasCreateWithoutProjectInput, CanvasUncheckedCreateWithoutProjectInput>
  }

  export type CanvasCreateManyProjectInputEnvelope = {
    data: CanvasCreateManyProjectInput | CanvasCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type CanvasUpsertWithWhereUniqueWithoutProjectInput = {
    where: CanvasWhereUniqueInput
    update: XOR<CanvasUpdateWithoutProjectInput, CanvasUncheckedUpdateWithoutProjectInput>
    create: XOR<CanvasCreateWithoutProjectInput, CanvasUncheckedCreateWithoutProjectInput>
  }

  export type CanvasUpdateWithWhereUniqueWithoutProjectInput = {
    where: CanvasWhereUniqueInput
    data: XOR<CanvasUpdateWithoutProjectInput, CanvasUncheckedUpdateWithoutProjectInput>
  }

  export type CanvasUpdateManyWithWhereWithoutProjectInput = {
    where: CanvasScalarWhereInput
    data: XOR<CanvasUpdateManyMutationInput, CanvasUncheckedUpdateManyWithoutProjectInput>
  }

  export type CanvasScalarWhereInput = {
    AND?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
    OR?: CanvasScalarWhereInput[]
    NOT?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
    id?: StringFilter<"Canvas"> | string
    projectId?: StringFilter<"Canvas"> | string
    name?: StringFilter<"Canvas"> | string
    order?: IntFilter<"Canvas"> | number
    createdAt?: DateTimeFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeFilter<"Canvas"> | Date | string
  }

  export type ProjectCreateWithoutCanvasesInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    icon?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUncheckedCreateWithoutCanvasesInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    icon?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectCreateOrConnectWithoutCanvasesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCanvasesInput, ProjectUncheckedCreateWithoutCanvasesInput>
  }

  export type CanvasBlockCreateWithoutCanvasInput = {
    id?: string
    order: number
    type: string
    x: number
    y: number
    width: number
    height: number
    content: JsonNullValueInput | InputJsonValue
    color?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasBlockUncheckedCreateWithoutCanvasInput = {
    id?: string
    order: number
    type: string
    x: number
    y: number
    width: number
    height: number
    content: JsonNullValueInput | InputJsonValue
    color?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasBlockCreateOrConnectWithoutCanvasInput = {
    where: CanvasBlockWhereUniqueInput
    create: XOR<CanvasBlockCreateWithoutCanvasInput, CanvasBlockUncheckedCreateWithoutCanvasInput>
  }

  export type CanvasBlockCreateManyCanvasInputEnvelope = {
    data: CanvasBlockCreateManyCanvasInput | CanvasBlockCreateManyCanvasInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutCanvasesInput = {
    update: XOR<ProjectUpdateWithoutCanvasesInput, ProjectUncheckedUpdateWithoutCanvasesInput>
    create: XOR<ProjectCreateWithoutCanvasesInput, ProjectUncheckedCreateWithoutCanvasesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutCanvasesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutCanvasesInput, ProjectUncheckedUpdateWithoutCanvasesInput>
  }

  export type ProjectUpdateWithoutCanvasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateWithoutCanvasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasBlockUpsertWithWhereUniqueWithoutCanvasInput = {
    where: CanvasBlockWhereUniqueInput
    update: XOR<CanvasBlockUpdateWithoutCanvasInput, CanvasBlockUncheckedUpdateWithoutCanvasInput>
    create: XOR<CanvasBlockCreateWithoutCanvasInput, CanvasBlockUncheckedCreateWithoutCanvasInput>
  }

  export type CanvasBlockUpdateWithWhereUniqueWithoutCanvasInput = {
    where: CanvasBlockWhereUniqueInput
    data: XOR<CanvasBlockUpdateWithoutCanvasInput, CanvasBlockUncheckedUpdateWithoutCanvasInput>
  }

  export type CanvasBlockUpdateManyWithWhereWithoutCanvasInput = {
    where: CanvasBlockScalarWhereInput
    data: XOR<CanvasBlockUpdateManyMutationInput, CanvasBlockUncheckedUpdateManyWithoutCanvasInput>
  }

  export type CanvasBlockScalarWhereInput = {
    AND?: CanvasBlockScalarWhereInput | CanvasBlockScalarWhereInput[]
    OR?: CanvasBlockScalarWhereInput[]
    NOT?: CanvasBlockScalarWhereInput | CanvasBlockScalarWhereInput[]
    id?: StringFilter<"CanvasBlock"> | string
    canvasId?: StringFilter<"CanvasBlock"> | string
    order?: IntFilter<"CanvasBlock"> | number
    type?: StringFilter<"CanvasBlock"> | string
    x?: FloatFilter<"CanvasBlock"> | number
    y?: FloatFilter<"CanvasBlock"> | number
    width?: FloatFilter<"CanvasBlock"> | number
    height?: FloatFilter<"CanvasBlock"> | number
    content?: JsonFilter<"CanvasBlock">
    color?: StringNullableFilter<"CanvasBlock"> | string | null
    title?: StringNullableFilter<"CanvasBlock"> | string | null
    createdAt?: DateTimeFilter<"CanvasBlock"> | Date | string
    updatedAt?: DateTimeFilter<"CanvasBlock"> | Date | string
  }

  export type CanvasCreateWithoutCanvasBlocksInput = {
    id?: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutCanvasesInput
  }

  export type CanvasUncheckedCreateWithoutCanvasBlocksInput = {
    id?: string
    projectId: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasCreateOrConnectWithoutCanvasBlocksInput = {
    where: CanvasWhereUniqueInput
    create: XOR<CanvasCreateWithoutCanvasBlocksInput, CanvasUncheckedCreateWithoutCanvasBlocksInput>
  }

  export type CanvasUpsertWithoutCanvasBlocksInput = {
    update: XOR<CanvasUpdateWithoutCanvasBlocksInput, CanvasUncheckedUpdateWithoutCanvasBlocksInput>
    create: XOR<CanvasCreateWithoutCanvasBlocksInput, CanvasUncheckedCreateWithoutCanvasBlocksInput>
    where?: CanvasWhereInput
  }

  export type CanvasUpdateToOneWithWhereWithoutCanvasBlocksInput = {
    where?: CanvasWhereInput
    data: XOR<CanvasUpdateWithoutCanvasBlocksInput, CanvasUncheckedUpdateWithoutCanvasBlocksInput>
  }

  export type CanvasUpdateWithoutCanvasBlocksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutCanvasesNestedInput
  }

  export type CanvasUncheckedUpdateWithoutCanvasBlocksInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasCreateManyProjectInput = {
    id?: string
    name?: string
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    canvasBlocks?: CanvasBlockUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    canvasBlocks?: CanvasBlockUncheckedUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasBlockCreateManyCanvasInput = {
    id?: string
    order: number
    type: string
    x: number
    y: number
    width: number
    height: number
    content: JsonNullValueInput | InputJsonValue
    color?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CanvasBlockUpdateWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    color?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasBlockUncheckedUpdateWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    color?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CanvasBlockUncheckedUpdateManyWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: JsonNullValueInput | InputJsonValue
    color?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}