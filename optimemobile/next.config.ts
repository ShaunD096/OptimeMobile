import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // NOTE deliberately NO turbopack.root pin. Next infers the root and
  // warns about a stray parent lockfile — annoying but harmless. Every
  // pin variant is a trap in a TS config: process.cwd() is wrong under
  // npm --prefix (16-minute compiles watching a parent tree), and
  // __dirname / import.meta.dirname is undefined in one of the two
  // module formats the config may compile to (an undefined root sent
  // Turbopack scanning from the drive root — requests hung forever).
  // Native/database modules must be required at runtime, not bundled:
  // better-sqlite3 ships a compiled .node binding (local-dev database),
  // and the Prisma driver adapters resolve it lazily.
  serverExternalPackages: [
    "@prisma/client",
    "better-sqlite3",
    "@prisma/adapter-better-sqlite3",
    "@prisma/adapter-pg",
  ],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Mobile-Platform, X-Device-Id",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
