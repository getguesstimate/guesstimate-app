import React from "react";
import { Button } from "~/components/utility/buttons/button";

const Cost: React.FC<{ cost: string; unit: string }> = ({ cost, unit }) => (
  <div className="flex h-32 flex-col items-center">
    <div>
      <sup className="-top-4 text-2xl font-extrabold text-grey-main">$</sup>
      <span className="text-5xl font-extrabold text-grey-main">{cost}</span>
    </div>
    <div className="mt-4 text-center text-xl font-medium leading-tight text-grey-888">
      {unit === "per_user" && (
        <>
          per user <br />
        </>
      )}
      per month
    </div>
  </div>
);

type PlanCardProps = {
  name: string;
  promotion_copy?: string;
  price: string;
  unit: string;
  private_model_count: string;
  upgrade: {
    show: boolean;
    onClick: () => void;
    text: string;
  };
};

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  promotion_copy,
  price,
  unit,
  private_model_count,
  upgrade,
}) => {
  return (
    <div className="flex w-80 flex-col items-center rounded-lg border border-[#d8d8d8] bg-white px-12 py-8">
      <header className="mb-8 text-3xl font-medium text-grey-main">
        {name}
      </header>
      <div className="mb-6">
        <Cost cost={price} unit={unit} />
      </div>
      <ul className="mb-12">
        <li className="text-xl font-light text-grey-888">
          <strong className="font-bold text-blue-1">
            {private_model_count}
          </strong>{" "}
          private models
        </li>
      </ul>
      {promotion_copy && (
        <div className="mb-4 text-xl font-medium text-[#1bb732]">
          {promotion_copy}
        </div>
      )}
      {upgrade.show && (
        <Button color="green" size="large" onClick={upgrade.onClick}>
          {upgrade.text}
        </Button>
      )}
    </div>
  );
};

type Props = {
  showPersonalUpgradeButton: boolean;
  onChoose: (planId: string) => void;
  isLoggedIn: boolean;
  onNewOrganizationNavigation: () => void;
};

export const Plans: React.FC<Props> = ({
  showPersonalUpgradeButton,
  onChoose,
  isLoggedIn,
  onNewOrganizationNavigation,
}) => {
  return (
    <div className="flex items-start justify-center space-x-16">
      <PlanCard
        name="Individuals"
        price="5"
        unit="per_month"
        private_model_count="20"
        upgrade={{
          show: showPersonalUpgradeButton,
          onClick: () => {
            onChoose("personal_lite");
          },
          text: "Upgrade",
        }}
      />
      <PlanCard
        name="Organizations"
        price="12"
        unit="per_user"
        private_model_count="200"
        promotion_copy="30-day free trial"
        upgrade={{
          show: isLoggedIn,
          onClick: () => {
            onNewOrganizationNavigation();
          },
          text: "Begin Free Trial",
        }}
      />
    </div>
  );
};
