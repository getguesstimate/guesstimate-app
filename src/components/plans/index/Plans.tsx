import React from "react";

const Cost: React.FC<{ cost: string; unit: string }> = ({ cost, unit }) => (
  <div className="flex flex-col items-center h-32">
    <div>
      <sup className="-top-4 text-2xl font-extrabold text-grey-main">$</sup>
      <span className="text-5xl font-extrabold text-grey-main">{cost}</span>
    </div>
    <div className="font-medium mt-4 text-center text-grey-888 text-xl leading-tight">
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
    <div className="bg-white rounded-lg border border-[#d8d8d8] flex flex-col items-center px-12 py-8 w-80">
      <h2 className="mb-6 text-grey-main font-medium text-3xl">{name}</h2>
      <div className="mb-8">
        <Cost cost={price} unit={unit} />
      </div>
      <ul className="mb-12">
        <li className="font-light text-xl text-grey-888">
          <strong className="text-blue-1">{private_model_count}</strong> private
          models
        </li>
      </ul>
      {promotion_copy && (
        <div className="text-[#1bb732] font-medium text-xl mb-4">
          {promotion_copy}
        </div>
      )}
      {upgrade.show && (
        <a className="ui button green" onMouseDown={upgrade.onClick}>
          {upgrade.text}
        </a>
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
    <div className="flex justify-center space-x-16 items-start">
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
