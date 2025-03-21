import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('@/components/shared/layout'), { ssr: false });
const ModuleObatDetail = dynamic(() => import('@/modules/drug-detail/module-obat-detail'), { ssr: false });

const Page = () => {

  return (
      <Layout>
      <ModuleObatDetail />
    </Layout>
  );
};

export default Page;
