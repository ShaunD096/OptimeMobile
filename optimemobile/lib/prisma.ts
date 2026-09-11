// MOCKED Prisma client — in-memory fallback when PostgreSQL / SQLite is offline

export interface MockPrismaClient {
  [key: string]: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    findFirst: (args?: unknown) => Promise<unknown | null>;
    findUnique: (args?: unknown) => Promise<unknown | null>;
    create: (args?: unknown) => Promise<unknown>;
    update: (args?: unknown) => Promise<unknown>;
    delete: (args?: unknown) => Promise<unknown>;
    count: (args?: unknown) => Promise<number>;
    aggregate: (args?: unknown) => Promise<unknown>;
  };
}

const noOp = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  create: async (d: { data?: unknown }) => d?.data ?? {},
  update: async (d: { data?: unknown }) => d?.data ?? {},
  delete: async () => ({}),
  count: async () => 0,
  aggregate: async () => ({ _sum: {}, _avg: {}, _count: 0 }),
};

export const prisma: MockPrismaClient = new Proxy({}, {
  get: () => noOp,
}) as unknown as MockPrismaClient;

export default prisma;
