import clsx from "clsx";
import Image from "next/image";
import React from "react";

import LogoWord from "../../../public/assets/logo-word-no-beta.png";

const Benefit: React.FC<{
  iconClass: string;
  title: string;
  children: React.ReactNode;
}> = ({ iconClass, title, children }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={clsx(iconClass, "opacity-20 text-7xl")} />
      <h2 className="font-normal text-4xl text-grey-444">{title}</h2>
      <p className="text-center text-grey-2 text-xl leading-normal font-lato">
        {children}
      </p>
    </div>
  );
};

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-24">
      <Image
        className="px-8"
        src={LogoWord}
        alt="Guesstimate logo"
        width={540}
      />
      <div className="px-4 mt-12">
        <h2 className="text-5xl text-center font-lato font-normal text-grey-333 leading-tight">
          A spreadsheet for things
          <br />
          that aren&rsquo;t certain
        </h2>
      </div>
      <div className="px-4 mt-20">
        <a href="/models" className="ui button huge primary">
          Browse Public Models
        </a>
      </div>
      <div className="px-4">
        <span className="wistia_embed wistia_async_ua8kd9n06a popover=true popoverAnimateThumbnail=true videoFoam=true">
          &nbsp;
        </span>
      </div>
      <div className="mt-12 py-12 bg-grey-1 w-full px-8">
        <div className="max-w-1200 mx-auto space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
          <Benefit iconClass="ion-ios-egg" title="Simple">
            Make a great estimate in seconds.
            <br />
            If you think a number is between <strong>5</strong> and{" "}
            <strong>9</strong>, <br />
            simply write <strong>"5 to 9"</strong>.
          </Benefit>
          <Benefit iconClass="ion-md-flame" title="Powerful">
            Guesstimate uses Monte Carlo sampling to correctly estimate
            uncertain results.
          </Benefit>
          <Benefit iconClass="ion-ios-rose" title="Free">
            Create unlimited public models for free.
            <br />
            Our code base is{" "}
            <a href="https://github.com/getguesstimate/guesstimate-app">
              open source
            </a>
            .
          </Benefit>
        </div>
      </div>
    </div>
  );
};
