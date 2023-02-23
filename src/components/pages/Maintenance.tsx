import React from "react";

export const Maintenance: React.FC = () => {
  return (
    <div className="mx-auto mt-16 max-w-3xl rounded border border-grey-ccc bg-grey-6 p-4">
      <header className="mb-4 text-3xl font-bold">Maintenance Mode</header>
      <p>
        Guesstimate has gone down for maintenance. We'll be back in 10 to 30
        minutes with 90% confidence.
      </p>
    </div>
  );
};
