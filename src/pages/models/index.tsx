import { NextPage } from "next";
import { NavHelper } from "~/components/utility/NavHelper";
import { SpacesIndex } from "~/components/spaces/SpacesIndex";

const ModelsPage: NextPage = () => (
  <NavHelper>
    <SpacesIndex />
  </NavHelper>
);

export default ModelsPage;
