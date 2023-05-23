// Facilities seeder

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  await prisma.facility.createMany({
    data: [
      {
        name: "WiFi",
        description:
          "Koneksi internet nirkabel yang cepat dan stabil untuk kebutuhan penyewa",
      },
      {
        name: "AC",
        description:
          "Sistem pendingin udara yang membuat lingkungan kerja tetap nyaman dan sejuk",
      },
      {
        name: "Proyektor",
        description:
          "Alat untuk memproyeksikan presentasi atau konten multimedia di layar besar",
      },
      {
        name: "Stop Kontak",
        description:
          "Sumber daya listrik yang mudah diakses untuk mengisi daya perangkat elektronik",
      },
      {
        name: "TV LED",
        description:
          "Televisi layar datar yang dapat digunakan untuk presentasi",
      },
      {
        name: "Air Mineral",
        description:
          "Air minum yang disediakan secara gratis untuk para penyewa",
      },
      {
        name: "Kursi Tambahan",
        description: "Kursi ekstra yang tersedia jika diperlukan",
      },
      {
        name: "Flipchart",
        description:
          "Papan tulis dengan kertas yang bisa digunakan untuk membuat catatan",
      },
      {
        name: "Sound System",
        description:
          "Sistem audio yang lengkap untuk mendukung kegiatan presentasi",
      },
      {
        name: "Ruang Tunggu",
        description: "Area yang nyaman untuk menunggu",
      },
      {
        name: "Parkir Mobil",
        description: "Tempat parkir yang tersedia untuk mobil",
      },
      {
        name: "Parkir Motor",
        description: "Tempat parkir yang tersedia untuk motor",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
