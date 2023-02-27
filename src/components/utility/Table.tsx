import clsx from "clsx";
import { createContext, PropsWithChildren, useContext } from "react";

type TableContext = {
  size: "normal" | "small";
};

const TableContext = createContext({
  size: "normal",
});

export const THead: React.FC<PropsWithChildren> = ({ children }) => (
  <thead>{children}</thead>
);

export const TBody: React.FC<PropsWithChildren> = ({ children }) => (
  <tbody>{children}</tbody>
);

export const TH: React.FC<PropsWithChildren> = ({ children }) => {
  const { size } = useContext(TableContext);
  return (
    <th
      className={clsx(
        "border-t border-b border-[#ddd] bg-[#f8f8f8] px-4 py-4",
        size === "small" && "leading-tight"
      )}
    >
      {children}
    </th>
  );
};

export const TD: React.FC<PropsWithChildren> = ({ children }) => {
  const { size } = useContext(TableContext);
  return (
    <td
      className={clsx(
        "border-t border-b border-[#ddd] px-4 py-3",
        size === "small" && "leading-tight"
      )}
    >
      {children}
    </td>
  );
};

export const TR: React.FC<PropsWithChildren> = ({ children }) => {
  // no styling for now
  return <tr>{children}</tr>;
};

export const Table: React.FC<
  PropsWithChildren<{ size?: "normal" | "small" }>
> = ({ children, size = "normal" }) => {
  return (
    <TableContext.Provider value={{ size }}>
      <table
        className={clsx(
          "w-full rounded border border-[#ddd] bg-white text-left",
          size === "small" && "text-sm"
        )}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
};
