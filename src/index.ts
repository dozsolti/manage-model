type CreatorFunction<T> = (data: T, ...args: any[]) => any;

export type ModelManagerConstants<T> = {
  templates?: Record<string, T>;
  inits?: Record<string, (data: any, ...args: any[]) => T>;
};

export type ModelManager<T> = {
  to?: { [key: string]: CreatorFunction<T> };

  parsers?: {
    [key: string]: {
      from: (...args: any[]) => T | null;
      to: ((model: T) => any) | ((...args: any[]) => any);
      [key: string]: (...args: any[]) => any; // fromXYZ, toXYZ
    };
  };

  sorters?: { [key: string]: (a: T, b: T) => number };
  validators?: { [key: string]: (model: T) => boolean };
  sanitizers?: { [key: string]: (model: T) => T };

  hooks?: {
    beforeCreate?: (data: any) => any;
    afterCreate?: (data: T) => void;
  };
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
