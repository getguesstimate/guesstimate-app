import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import { GeneralModal } from "~/components/utility/modal/index";
import {
  TutorialFunctionPage,
  TutorialMetricActionsPage,
  TutorialMetricPage,
  TutorialMoreFeaturesPage,
} from "./pages";

type Props = {
  onClose(): void;
};

const PAGES = [
  <TutorialMetricPage />,
  <TutorialFunctionPage />,
  <TutorialMetricActionsPage />,
  <TutorialMoreFeaturesPage />,
];

export const Tutorial: React.FC<Props> = ({ onClose }) => {
  const [page, setPage] = useState(0);

  const previousPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  const nextPage = () => {
    setPage(Math.min(page + 1, PAGES.length - 1));
  };

  return (
    <GeneralModal onRequestClose={onClose}>
      <div
        className="Tutorial"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        {PAGES[page]}
        <div className="row">
          <div className="col-md-12 actions">
            <span
              className={`ui button ${page === 0 ? "disabled" : ""}`}
              onClick={previousPage}
            >
              <Icon name="arrow-left" /> Previous
            </span>
            <span
              className={`ui button ${
                page === PAGES.length - 1 ? "disabled" : ""
              }`}
              onClick={nextPage}
            >
              <Icon name="arrow-right" /> Next
            </span>
            <span className="ui button" onClick={onClose}>
              Done
            </span>
          </div>
        </div>
      </div>
    </GeneralModal>
  );
};
