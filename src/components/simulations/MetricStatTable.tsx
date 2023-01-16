import React from "react";

// unused?
export const MetricStatTable: React.FC<{ stats: any }> = ({ stats }) => (
  <table className="MetricStatTable">
    <tbody>
      <tr>
        <td> mean </td>
        <td> {stats.mean.toFixed(2)} </td>
      </tr>
      <tr>
        <td> median </td>
        <td> {stats.percentiles[50].toFixed(2)} </td>
      </tr>
      <tr>
        <td> 5th / 95th </td>
        <td>
          {" "}
          {`${stats.percentiles[5].toFixed(
            2
          )} / ${stats.percentiles[95].toFixed(2)}`}{" "}
        </td>
      </tr>
      <tr>
        <td> stdev </td>
        <td> {stats.stdev.toFixed(2)} </td>
      </tr>
      <tr>
        <td> sample count </td>
        <td> {stats.length} </td>
      </tr>
    </tbody>
  </table>
);
