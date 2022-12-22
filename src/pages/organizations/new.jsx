import Layout from "../../routes/layouts/application/index";
import { CreateOrganizationPageContainer } from "gComponents/organizations/new/index";

const CreateOrganizationPage = () => {
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <CreateOrganizationPageContainer />
    </Layout>
  );
};

export default CreateOrganizationPage;
