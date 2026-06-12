import { FC, useEffect, useRef } from "react";

import { useRouter } from "next/router";
import * as firstSubscriptionActions from "~/modules/first_subscription/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";

// Chargebee's hosted checkout can be configured (site-wide) to redirect back
// to the app with `?id=<hosted_page_id>&state=succeeded` instead of staying
// in the popup. In that case the popup success callback never fires, so we
// sync the account here when we land on such a URL.
export const CheckoutRedirectSync: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profileId = useAppSelector((state) => state.me.profile?.id);
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current || !router.isReady || !profileId) {
      return;
    }
    if (router.query.state !== "succeeded") {
      return;
    }
    synced.current = true;

    dispatch(
      firstSubscriptionActions.postSynchronization({ user_id: profileId })
    );

    // Drop the checkout params so a reload doesn't re-sync.
    const { id, state, ...query } = router.query;
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  }, [router.isReady, profileId]);

  return null;
};
