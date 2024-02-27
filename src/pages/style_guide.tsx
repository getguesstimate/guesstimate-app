import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { ComponentIndex } from "~/components/style_guide/ComponentIndex";

const StyleGuidePage: NextPage = () => {
  return (
    <AppLayout>
      <ComponentIndex />
    </AppLayout>
  );
};

export default StyleGuidePage;
