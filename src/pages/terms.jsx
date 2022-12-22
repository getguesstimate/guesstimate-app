import Layout from "../routes/layouts/application/index";

import TermsAndConditions from "gComponents/pages/terms_and_conditions/index";

const TermsPage = () => {
  return (
    <Layout options={{}}>
      <TermsAndConditions />
    </Layout>
  );
};

export default TermsPage;
