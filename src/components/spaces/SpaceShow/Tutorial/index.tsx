import clsx from "clsx";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import { GeneralModal } from "~/components/utility/GeneralModal";
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
        className="pt-8 pb-4 px-8 rounded bg-[#f0f0f0] max-w-[42em]"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        {PAGES[page]}
        <div className="flex justify-center">
          <span
            className={clsx("ui button", page === 0 && "disabled")}
            onClick={previousPage}
          >
            <Icon name="arrow-left" /> Previous
          </span>
          <span
            className={clsx(
              "ui button",
              page === PAGES.length - 1 && "disabled"
            )}
            onClick={nextPage}
          >
            <Icon name="arrow-right" /> Next
          </span>
          <span className="ui button" onClick={onClose}>
            Done
          </span>
        </div>
      </div>
    </GeneralModal>
  );
};
