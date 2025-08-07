/**
 * Type helper utilities for extracting function parameters
 */

// Type alias to satisfy TypeScript constraints for function types
type AnyFunction = (...args: never[]) => unknown;

/**
 * Extracts parameters from a function type, excluding the first parameter of a given type.
 * This is useful for methods that need to pass through parameters to functions that expect
 * a configuration object as the first parameter.
 *
 * @example
 * ```typescript
 * function myFunc(config: Config, name: string, age: number) { ... }
 *
 * // ExcludeFirstParam<typeof myFunc, Config> = [name: string, age: number]
 * type RestParams = ExcludeFirstParam<typeof myFunc, Config>;
 * ```
 */
export type ExcludeFirstParam<
	TFunc extends AnyFunction,
	TFirstParamType,
> = Parameters<TFunc> extends [TFirstParamType, ...infer Rest] ? Rest : never;

/**
 * Alternative name for the same type helper - might be more descriptive in some contexts
 */
export type OmitFirstParameter<
	TFunc extends AnyFunction,
	TFirstParamType,
> = ExcludeFirstParam<TFunc, TFirstParamType>;

/**
 * Extracts the return type from a Promise-returning function
 */
export type AsyncReturnType<T extends (...args: never[]) => Promise<unknown>> =
	Awaited<ReturnType<T>>;

/**
 * Makes all properties of a type optional recursively
 */
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Creates a type with specific keys made required from an optional type
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
