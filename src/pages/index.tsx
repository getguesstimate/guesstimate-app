import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { Home } from "~/components/pages/Home";

const IndexPage: NextPage = () => {
  return (
    <AppLayout isFluid simpleHeader>
      <Home />
    </AppLayout>
  );
};

export default IndexPage;
