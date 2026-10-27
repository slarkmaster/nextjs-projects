// Normalize the Postgres connection string to `sslmode=verify-full`.
// `prefer`, `require`, and `verify-ca` will adopt weaker libpq semantics in
// pg-connection-string v3 / pg v9 and emit a deprecation warning today.
// We always want full TLS verification, so rewrite (or append) the param
// before passing the URL to any client/adapter/CLI codepath.
//
// Exception: an explicit `sslmode=disable` is left as-is, so a local or CI
// Postgres without TLS (e.g. the service container in .github/workflows/e2e.yml)
// can connect. Remote URLs like Neon never set `disable`, so they still get
// upgraded to `verify-full`.
export function normalizeDatabaseUrl(url: string): string {
  const u = new URL(url);
  if (u.searchParams.get('sslmode') !== 'disable') {
    u.searchParams.set('sslmode', 'verify-full');
  }
  return u.toString();
}
