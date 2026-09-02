export type ModelManagerConstants<T> = {
  templates?: Record<string, T>;
  inits?: Record<string, (...args: any[]) => T>;
};

export type ModelManager<T> = {
  to?: { [key: string]: (data: T, ...args: any[]) => any };

  parse?: {
    [key: string]: {
      from: (...args: any[]) => T | null;
      to: ((model: T) => any) | ((...args: any[]) => any);

      [key: `from${string}`]: (...args: any[]) => T | null;
      [key: `to${string}`]: ((model: T) => any) | ((...args: any[]) => any);
    };
  };

  sort?: { [key: string]: (a: T, b: T) => number };
  validate?: { [key: string]: (model: T) => boolean };
  sanitize?: { [key: string]: (model: T) => T };
  migrate?: { [key: string]: (...args: any[]) => any };
  can?: { [key: string]: (model: T, ...args: any[]) => boolean };
};

type ModelFactory<T> = {
  <C extends ModelManagerConstants<T>>(constants: C): C;
  <C extends ModelManagerConstants<T>, M extends ModelManager<T>>(
    constants: C,
    builder: M | ((constants: C) => M),
  ): C & M;
};

export const manageModel = <T>() => {
  const factory: ModelFactory<T> = <
    C extends ModelManagerConstants<T>,
    M extends ModelManager<T>,
  >(
    constants: C,
    builder?: M | ((constants: C) => M),
  ) => {
    if (!builder) {
      return constants;
    }

    const manager =
      typeof builder === "function" ? builder(constants) : builder;
    return {
      ...constants,
      ...manager,
    };
  };

  return factory;
};
