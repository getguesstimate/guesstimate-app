import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../routes/layouts/application/index";
import FirstSubscriptionPage from "gComponents/subscriptions/FirstSubscriptionPage/container";

const SubscribePage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout options={{}}>
      {id === undefined ? null : (
        <FirstSubscriptionPage planName={id as string} />
      )}
    </Layout>
  );
};

export default SubscribePage;
