/**
 * Newer versions of `pg` treat sslmode=require/prefer/verify-ca in a
 * connection string as an alias for verify-full, which overrides any `ssl`
 * option passed programmatically and breaks against Supabase's pooler
 * certificate. Stripping sslmode here lets our explicit `ssl` config (see
 * src/lib/prisma.ts) be the only thing in effect.
 */
export function stripSslMode(connectionString: string | undefined): string | undefined {
  if (!connectionString) return connectionString;
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return connectionString;
  }
}
