import clsx from "clsx";
import React from "react";
import { iubendaHref } from "~/components/lib/IubendaPrivacyPolicy";

const LinkGithubStar: React.FC = () => (
  <iframe
    src="https://ghbtns.com/github-btn.html?user=getguesstimate&repo=guesstimate-app&type=star&count=true"
    className="overflow-hidden border-0"
    width={160}
    height={30}
  ></iframe>
);

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="mb-4 text-grey-2">
    <strong>{children}</strong>
  </li>
);

const LinkItem: React.FC<{
  href: string;
  iubenda?: boolean;
  children: React.ReactNode;
}> = ({ href, children, iubenda }) => (
  <li className="mb-3">
    <a
      href={href}
      className={clsx(
        "font-light text-grey-2",
        iubenda && "iubenda-nostyle no-brand iubenda-embed"
      )}
    >
      {children}
    </a>
  </li>
);

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col justify-center space-y-8 bg-grey-5 p-12 sm:flex-row sm:space-x-24 sm:space-y-0">
      <ul>
        <Header>Guesstimate</Header>
        <LinkItem href="/pricing">Pricing</LinkItem>
        <LinkItem href="/faq">FAQ</LinkItem>
        <LinkItem href="http://docs.getguesstimate.com/">
          Documentation
        </LinkItem>
        <LinkItem href="https://medium.com/guesstimate-blog">Blog</LinkItem>
      </ul>
      <ul>
        <Header>Legal</Header>
        <LinkItem href="/terms">Terms of Service</LinkItem>
        <LinkItem href={iubendaHref} iubenda>
          Privacy Policy
        </LinkItem>
      </ul>
      <div>
        <LinkGithubStar />
      </div>
    </footer>
  );
};
