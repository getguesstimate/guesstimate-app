import clsx from "clsx";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";
import { Button, ButtonWithIcon } from "~/components/utility/buttons/button";

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
        className="max-w-[40em] rounded bg-[#f0f0f0] px-8 pt-8 pb-4"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        {PAGES[page]}
        <div className="flex justify-center gap-1">
          <ButtonWithIcon
            size="padded"
            disabled={page === 0}
            onClick={previousPage}
            icon={<Icon name="arrow-left" />}
            text="Previous"
          />
          <ButtonWithIcon
            size="padded"
            disabled={page === PAGES.length - 1}
            onClick={nextPage}
            icon={<Icon name="arrow-right" />}
            text="Next"
          />
          <Button size="padded" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </GeneralModal>
  );
};
