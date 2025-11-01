import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Corp',
    },
  });

  console.log('✅ Created organization:', org.name);

  // Create user
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const user = await prisma.user.create({
    data: {
      orgId: org.id,
      email: 'demo@democorp.com',
      name: 'Demo User',
      passwordHash,
    },
  });

  console.log('✅ Created user:', user.email);

  // Create financing application
  const application = await prisma.financingApplication.create({
    data: {
      orgId: org.id,
      userId: user.id,
      companyName: 'Acme Industries',
      cardBrand: 'Visa',
      cardLast4: '4242',
      cardTokenStub: 'tok_demo_****',
      invoiceAmount: 50000,
      durationDays: 90,
    },
  });

  console.log('✅ Created financing application for:', application.companyName);

  // Create sample invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      orgId: org.id,
      userId: user.id,
      filename: 'invoice-001.pdf',
      filepath: '/uploads/demo-invoice-001.pdf',
      mimeType: 'application/pdf',
      amount: 25000,
      status: 'UPLOADED',
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      orgId: org.id,
      userId: user.id,
      filename: 'invoice-002.pdf',
      filepath: '/uploads/demo-invoice-002.pdf',
      mimeType: 'application/pdf',
      amount: 15000,
      status: 'CONTRACTED',
    },
  });

  console.log('✅ Created sample invoices');

  // Create contract for invoice2
  const contract = await prisma.contract.create({
    data: {
      orgId: org.id,
      invoiceId: invoice2.id,
      contractId: `EG-${invoice2.id.slice(0, 6)}`,
      contractHash: `cid_${Math.random().toString(36).substring(2, 15)}`,
    },
  });

  console.log('✅ Created sample contract:', contract.contractId);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: demo@democorp.com');
  console.log('   Password: demo1234');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
