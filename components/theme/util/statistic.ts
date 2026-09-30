declare const CSSINJS_STATISTIC: any;

const enableStatistic =
  process.env.NODE_ENV !== 'production' || typeof CSSINJS_STATISTIC !== 'undefined';
let recording = true;

export interface MergeTokenOptions {
  preserveExisting?: boolean;
}

/**
 * This function will do as `Object.assign` in production. But will use Object.defineProperty:get to
 * pass all value access in development. To support statistic field usage with alias token.
 */
export function merge<T extends object>(
  ...args: [...objs: Partial<T>[], options: MergeTokenOptions]
): T;
export function merge<T extends object>(...objs: Partial<T>[]): T;
export function merge<T extends object>(...args: Array<Partial<T> | MergeTokenOptions>): T {
  const lastArg = args[args.length - 1];
  const hasOptions = lastArg && typeof lastArg === 'object' && 'preserveExisting' in lastArg;
  const options = hasOptions ? (lastArg as MergeTokenOptions) : undefined;
  const objs = (hasOptions ? args.slice(0, -1) : args) as Partial<T>[];

  /* istanbul ignore next */
  if (!enableStatistic) {
    if (!options?.preserveExisting) {
      return Object.assign({}, ...objs);
    }

    return objs.reduce<T>((result, obj) => {
      Object.keys(obj).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(result, key)) {
          (result as any)[key] = (obj as any)[key];
        }
      });
      return result;
    }, {} as T);
  }

  recording = false;

  const ret = {} as T;

  objs.forEach(obj => {
    const keys = Object.keys(obj);

    keys.forEach(key => {
      if (options?.preserveExisting && Object.prototype.hasOwnProperty.call(ret, key)) {
        return;
      }

      Object.defineProperty(ret, key, {
        configurable: true,
        enumerable: true,
        get: () => (obj as any)[key],
      });
    });
  });

  recording = true;
  return ret;
}

/** @private Internal Usage. Not use in your production. */
export const statistic: Record<
  string,
  { global: string[]; component: Record<string, string | number> }
> = {};

/** @private Internal Usage. Not use in your production. */
// eslint-disable-next-line camelcase
export const _statistic_build_: typeof statistic = {};

/* istanbul ignore next */
function noop() {}

/** Statistic token usage case. Should use `merge` function if you do not want spread record. */
export default function statisticToken<T extends object>(token: T) {
  let tokenKeys: Set<string> | undefined;
  let proxy = token;
  let flush: (componentName: string, componentToken: Record<string, string | number>) => void =
    noop;

  if (enableStatistic) {
    tokenKeys = new Set<string>();

    proxy = new Proxy(token, {
      get(obj: any, prop: any) {
        if (recording) {
          tokenKeys!.add(prop);
        }
        return obj[prop];
      },
    });

    flush = (componentName, componentToken) => {
      statistic[componentName] = { global: Array.from(tokenKeys!), component: componentToken };
    };
  }

  return { token: proxy, keys: tokenKeys, flush };
}
