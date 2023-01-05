import { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout } from "~/components/layouts";
import { FirstSubscriptionPage } from "~/components/subscriptions/FirstSubscriptionPage";

const SubscribePage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout>
      {id === undefined ? null : (
        <FirstSubscriptionPage planName={id as string} />
      )}
    </Layout>
  );
};

export default SubscribePage;
