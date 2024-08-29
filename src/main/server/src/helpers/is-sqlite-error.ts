export function isSqliteUniqueConstraintError(err: unknown): err is { code: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === 'SQLITE_CONSTRAINT_UNIQUE'
  )
}
