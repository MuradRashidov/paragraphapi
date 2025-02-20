import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const generateSlug = (str: string) => {
    str.toLowerCase().trim();
  };
  const users = Array.from({ length: 10 }).map((_, index) => ({
    name: `${index} ${faker.person.fullName()}`,
    email: `${index}${faker.internet.email()}`,
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
  }));
  await prisma.user.createMany({ data: users });

  const posts = Array.from({ length: 40 }).map((_, index) => ({
    title: `${index} ${faker.lorem.sentence()}`,
    slug: `${index}${generateSlug(faker.lorem.sentence())}`,
    content: faker.lorem.paragraphs(3),
    thumbnail: faker.image.urlLoremFlickr(),
    authorId: faker.number.int({ min: 1, max: 10 }),
    published: true,
  }));
 await Promise.all(
    posts.map(async (post) => {
      await prisma.post.create({
        data: {
          ...post,
          comments: {
            createMany: {
              data: Array.from({ length: 10 }).map(() => ({
                authorId: faker.number.int({ min: 1, max: 10 }),
                content: faker.lorem.sentence(),
              })),
            },
          },
        },
      });
    }),
  );
  console.log('✅ Seed işlemi başarıyla tamamlandı!');
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
