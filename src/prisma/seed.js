// SEED IS NOT WORKING SOMEHOW IDK

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt();

  await prisma.user.createMany({
    data: [
      {
        email: "megumi@gmail.com",
        password_hash: await bcrypt.hash("coba12345", salt),
        first_name: "Megumi",
        last_name: "Kato",
        phone_number: "081234567890",
        user_type: "TENANT",
        tenant: {
          create: {
            avatar_url:
              "https://api.spotscoworking.live/uploads/avatar/default-avatar.png",
          },
        },
      },
      {
        email: "marin@protonmail.com",
        password_hash: await bcrypt.hash("coba12345", salt),
        first_name: "Marin",
        last_name: "Kitagawa",
        phone_number: "081234567891",
        user_type: "TENANT",
        tenant: {
          create: {
            avatar_url:
              "https://api.spotscoworking.live/uploads/avatar/default-avatar.png",
          },
        },
      },
      {
        email: "chisato@gmail.com",
        password_hash: await bcrypt.hash("coba12345", salt),
        first_name: "Chisato",
        last_name: "Nishikigi",
        phone_number: "081234567892",
        user_type: "OWNER",
        owner: {
          create: {
            nik: "3272032408010021",
            bank_name: "bca",
            card_number: "0011223344",
            status: "APPROVED",
          },
        },
      },
      {
        email: "hitori@protonmail.com",
        password_hash: await bcrypt.hash("coba12345", salt),
        first_name: "Hitori",
        last_name: "Gotou",
        phone_number: "081234567893",
        user_type: "OWNER",
        owner: {
          create: {
            nik: "3272032408010022",
            bank_name: "bni",
            card_number: "00010000",
            status: "APPROVED",
          },
        },
      },
    ],
  });

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
