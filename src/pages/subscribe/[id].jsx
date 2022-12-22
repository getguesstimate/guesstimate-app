import Layout from "../../routes/layouts/application/index";
import FirstSubscriptionPage from "gComponents/subscriptions/FirstSubscriptionPage/container";
import { useRouter } from "next/router";

const SubscribePage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout options={{}}>
      <FirstSubscriptionPage planName={id} />
    </Layout>
  );
};

export default SubscribePage;
