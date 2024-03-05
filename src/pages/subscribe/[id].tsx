import { NextPage } from "next";
import { useRouter } from "next/router";
import { AppLayout } from "~/components/layout";
import { FirstSubscriptionPage } from "~/components/subscriptions/FirstSubscriptionPage";

const SubscribePage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <AppLayout>
      {id === undefined ? null : (
        <FirstSubscriptionPage planName={id as string} />
      )}
    </AppLayout>
  );
};

export default SubscribePage;
