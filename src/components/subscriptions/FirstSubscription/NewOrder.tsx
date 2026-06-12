import { useEffect } from "react";

export const NewOrder: React.FC<{
  hostedPage: any;
  name: string;
  onSuccess(): void;
  onCancel(): void;
}> = ({ hostedPage, name, onSuccess, onCancel }) => {
  useEffect(() => {
    let timer: number | undefined;
    let opened = false;
    const fn = () => {
      // wait for Chargebee.js (v2) to load
      if (!window.Chargebee) {
        timer = window.setTimeout(fn, 300);
        return;
      }
      let cbInstance: any;
      try {
        cbInstance = window.Chargebee.getInstance();
      } catch {
        cbInstance = window.Chargebee.init({ site: name });
      }
      opened = true;
      // Pass the full hosted page object (not just its url) so the checkout
      // runs in-context and fires `success` here, instead of redirecting away
      // and losing the post-payment account sync.
      cbInstance.openCheckout({
        hostedPage: () => Promise.resolve(hostedPage),
        success: onSuccess,
        close: onCancel,
      });
    };
    fn();
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      if (opened) {
        try {
          window.Chargebee?.getInstance()?.closeAll();
        } catch {
          // instance not ready / already closed
        }
      }
    };
  }, []);

  // v2 renders the checkout in its own modal overlay, so nothing inline here.
  return null;
};
