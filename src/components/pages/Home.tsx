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
      <i className={clsx(iconClass, "text-6xl opacity-20")} />
      <header className="mt-6 mb-4 text-3xl font-normal text-grey-444">
        {title}
      </header>
      <p className="text-center text-lg leading-normal text-grey-2">
        {children}
      </p>
    </div>
  );
};

export const Home: React.FC = () => {
  return (
    <div className="mt-24 flex flex-col items-center">
      <Image
        className="px-8"
        src={LogoWord}
        alt="Guesstimate logo"
        width={540}
      />
      <div className="mt-12 px-4">
        <header className="text-center text-3xl font-normal leading-tight text-grey-333 md:text-5xl">
          A spreadsheet for things
          <br />
          that aren&rsquo;t certain
        </header>
      </div>
      <div className="mt-20 px-4">
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
      <div className="mt-12 w-full bg-grey-1 py-12 px-8">
        <div className="mx-auto max-w-1200 space-y-12 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
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
