require('dotenv').config({ quiet: true });

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  'Listrik',
  'Jaringan',
  'Furniture',
  'Kebersihan',
  'Ruang Kelas',
  'Laboratorium',
  'Fasilitas Umum',
];

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@pedulikampus.test',
    },
    update: {
      name: 'Teknisi Admin',
      password: hashedPassword,
      role: 'teknisi_admin',
    },
    create: {
      name: 'Teknisi Admin',
      email: 'admin@pedulikampus.test',
      password: hashedPassword,
      role: 'teknisi_admin',
    },
  });

  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: {
        name: categoryName,
      },
      update: {},
      create: {
        name: categoryName,
      },
    });
  }

  console.log('Seed data peduli-kampus berhasil dibuat.');
}

main()
  .catch((error) => {
    console.error('Seed data peduli-kampus gagal dibuat.');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
