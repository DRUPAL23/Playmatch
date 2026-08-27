import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const venues = [
    { name: 'Nairobi Pool Arena', latitude: -1.2864, longitude: 36.8172, tables: ['T01','T02','T03','T04'] },
    { name: 'Westlands Cue Club', latitude: -1.2676, longitude: 36.8108, tables: ['T01','T02','T03'] },
  ];
  for (const v of venues) {
    const venue = await prisma.venue.create({ data: { name: v.name, latitude: v.latitude, longitude: v.longitude } });
    await prisma.gameTable.createMany({ data: v.tables.map(label => ({ venueId: venue.id, label, gameType: 'POOL_8_BALL' })) });
  }
}
main().finally(() => prisma.$disconnect());
