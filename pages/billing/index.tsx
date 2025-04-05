import Head from 'next/head';
import ModuleBilling from '@/modules/billing/module-billing';

export default function BillingPage() {
  return (
    <>
      <Head>
        <title>Billing Management | FARMAX</title>
        <meta name="description" content="Kelola subscription dan pembayaran untuk FARMAX POS system" />
      </Head>
      <ModuleBilling />
    </>
  );
}
