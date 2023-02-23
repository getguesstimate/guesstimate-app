import React from "react";

export const Maintenance: React.FC = () => {
  return (
    <div className="border border-grey-ccc bg-grey-6 p-4 rounded max-w-3xl mt-16 mx-auto">
      <header className="text-3xl font-bold mb-4">Maintenance Mode</header>
      <p>
        Guesstimate has gone down for maintenance. We'll be back in 10 to 30
        minutes with 90% confidence.
      </p>
    </div>
  );
};
