import React from "react";
import Image from "next/image";
import clsx from "clsx";

import LogoWord from "../../../public/assets/logo-word-no-beta.png";
import { Button } from "../utility/buttons/button";

const Benefit: React.FC<{
  iconClass: string;
  title: string;
  children: React.ReactNode;
}> = ({ iconClass, title, children }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={clsx(iconClass, "opacity-20 text-6xl")} />
      <header className="font-normal text-3xl text-grey-444 mt-6 mb-4">
        {title}
      </header>
      <p className="text-center text-grey-2 text-lg leading-normal">
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
        <header className="text-3xl md:text-5xl text-center font-normal text-grey-333 leading-tight">
          A spreadsheet for things
          <br />
          that aren&rsquo;t certain
        </header>
      </div>
      <div className="px-4 mt-20">
        <a href="/models">
          <Button size="huge" color="blue" onClick={() => {}}>
            Browse Public Models
          </Button>
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
