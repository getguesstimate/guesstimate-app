import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { guesstimateMeReload } from "~/modules/me/actions";
import { Plan } from "~/lib/config/plan";
import { AccountAccess } from "./AccountSettings";
import { Icon } from "~/components/workspace/Icon";
import styles from "./account.module.css";
import billing from "./billing.module.css";

export function Billing() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.me.profile);
  const portalUrl = profile?.account?._links?.payment_portal?.href;
  const current = Plan.find(profile?.plan?.id);
  useEffect(() => {
    const refresh = () => dispatch(guesstimateMeReload());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [dispatch]);
  const individual = Plan.find("personal_lite");
  const organization = Plan.find("organization_basic_30");
  const firstPlan =
    current && !["personal_free", "personal_lite"].includes(current.id)
      ? current
      : Plan.find("personal_free");
  const billingControl = () =>
    portalUrl ? (
      <a
        className={billing.cta}
        href={portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          window.setTimeout(() => dispatch(guesstimateMeReload()), 0)
        }
      >
        Manage plan & payments
      </a>
    ) : current?.id !== "personal_free" &&
      current?.id !== "personal_infinite" ? (
      <p role="status" className={billing.caption}>
        Payment management is unavailable.{" "}
        <button
          className={styles.textButton}
          onClick={() => dispatch(guesstimateMeReload())}
        >
          Refresh account
        </button>{" "}
        or{" "}
        <a href="mailto:support@quantifieduncertainty.org">contact support</a>.
      </p>
    ) : null;
  return (
    <AccountAccess>
      <div className={styles.stack}>
        <section aria-labelledby="choose-plan" className={billing.offers}>
          <div className={billing.intro}>
            <h2 id="choose-plan">Plans</h2>
            <p>
              Personal and organization plans with public and private models.
            </p>
          </div>
          <div className={billing.grid}>
            <section
              className={`${billing.plan} ${billing.freePlan}`}
              aria-labelledby="free-plan"
            >
              <div className={billing.planTop}>
                <span className={billing.symbol}>
                  <Icon name="globe" />
                </span>
                {current?.id === firstPlan.id && (
                  <span className={billing.currentLabel}>Current plan</span>
                )}
              </div>
              <h3 id="free-plan">{firstPlan.name}</h3>
              <p className={billing.tagline}>
                {firstPlan.id === "personal_free"
                  ? "Public models for individual use."
                  : "Your personal subscription."}
              </p>
              <div className={billing.price}>
                <span className={billing.currency}>$</span>
                <strong>{firstPlan.formattedCost()}</strong>
                <span className={billing.unit}>per month</span>
              </div>
              <ul className={billing.features}>
                <li>
                  <Icon name="check" />
                  <span>Unlimited public models</span>
                </li>
                <li>
                  <Icon name="check" />
                  <span>
                    {firstPlan.id === "personal_free"
                      ? "Models are publicly visible"
                      : `${firstPlan.number()} private models`}
                  </span>
                </li>
              </ul>
              <div className={billing.planAction}>
                {current?.id === firstPlan.id ? (
                  billingControl()
                ) : (
                  <p className={billing.caption}>
                    Public models are included in all plans.
                  </p>
                )}
              </div>
            </section>
            <section className={billing.plan} aria-labelledby="individual-plan">
              <div className={billing.planTop}>
                <span className={billing.symbol}>
                  <Icon name="user" />
                </span>
                {current?.id === individual.id ? (
                  <span className={billing.currentLabel}>Current plan</span>
                ) : (
                  <span className={billing.audience}>Individual</span>
                )}
              </div>
              <h3 id="individual-plan">Lite</h3>
              <p className={billing.tagline}>
                Private models for individual use.
              </p>
              <div className={billing.price}>
                <span className={billing.currency}>$</span>
                <strong>{individual.formattedCost()}</strong>
                <span className={billing.unit}>per month</span>
              </div>
              <ul className={billing.features}>
                <li>
                  <Icon name="check" />
                  <span>
                    <strong>{individual.number()} private models</strong>
                  </span>
                </li>
                <li>
                  <Icon name="check" />
                  <span>Unlimited public models</span>
                </li>
                <li>
                  <Icon name="check" />
                  <span>Private unless you enable a shareable link</span>
                </li>
              </ul>
              <div className={billing.planAction}>
                {current?.id === "personal_free" ? (
                  <a className={billing.cta} href="/subscribe/lite">
                    Upgrade to Lite
                    <Icon name="arrow" />
                  </a>
                ) : current?.id === individual.id ? (
                  billingControl()
                ) : (
                  <span className={billing.included}>
                    Your plan includes private models
                  </span>
                )}
              </div>
            </section>
            <section
              className={`${billing.plan} ${billing.teamPlan}`}
              aria-labelledby="organization-plan"
            >
              <div className={billing.planTop}>
                <span className={billing.symbol}>
                  <Icon name="model" />
                </span>
                <span className={billing.trial}>30-day trial</span>
              </div>
              <h3 id="organization-plan">Organizations</h3>
              <p className={billing.tagline}>
                Private models shared with your organization.
              </p>
              <div className={billing.price}>
                <span className={billing.currency}>$</span>
                <strong>{organization.formattedCost()}</strong>
                <span className={billing.unit}>
                  per member
                  <br />
                  per month
                </span>
              </div>
              <ul className={billing.features}>
                <li>
                  <Icon name="check" />
                  <span>
                    <strong>{organization.number()} private models</strong>
                  </span>
                </li>
                <li>
                  <Icon name="check" />
                  <span>Shared editing of private models</span>
                </li>
              </ul>
              <div className={billing.planAction}>
                <p className={`${billing.caption} ${billing.trialCaption}`}>No credit card needed.</p>
                <a href="/organizations/new" className={billing.cta}>
                  Start 30-day trial
                  <Icon name="arrow" />
                </a>
              </div>
            </section>
          </div>
        </section>
        <div className={styles.helpLinks}>
          <a href="/pricing">Compare plans</a>
          <a href="mailto:support@quantifieduncertainty.org">Billing support</a>
        </div>
      </div>
    </AccountAccess>
  );
}
