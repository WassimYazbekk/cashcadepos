export function queryParamToBool(value: string): boolean | null {
  return value === 'true' ? true : value === 'false' ? false : null
}
