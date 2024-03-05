import React, {
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import clsx from "clsx";
import _ from "lodash";
import { Card } from "~/components/utility/Card";

type Props = PropsWithChildren<{
  headerText?: string;
  onOpen?(): void;
  position?: "right" | "left";
  width?: "wide";
  openLink?: React.ReactNode;
  hasPadding?: boolean;
}>;

export type DropDownHandle = {
  close(): void;
};

export const DropDown = React.forwardRef<DropDownHandle, Props>(
  function DropDown(props, ref) {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({ close }));

    const width = props.width === "wide" ? "normal" : "narrow";

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      props.onOpen?.();
      const handleDocumentClick = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as any)) {
          close();
        }
      };
      document.addEventListener("click", handleDocumentClick, false);
      return () => {
        document.removeEventListener("click", handleDocumentClick, false);
      };
    }, [isOpen]);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => (isOpen ? close() : open());

    return (
      <div className="relative" ref={containerRef}>
        <div className="cursor-pointer" onClick={toggle}>
          {props.openLink}
        </div>
        {isOpen && (
          <div
            className={clsx(
              "absolute z-10 mt-1",
              props.position === "right" ? "left-0" : "right-0"
            )}
          >
            <Card
              headerText={props.headerText}
              onClose={close}
              width={width}
              hasPadding={props.hasPadding}
            >
              {_.isArray(props.children) ? (
                <ul>
                  {props.children.map((child, i) => (
                    <div
                      key={i}
                      onClick={child?.props?.closeOnClick ? close : undefined}
                    >
                      {child}
                    </div>
                  ))}
                </ul>
              ) : (
                props.children
              )}
            </Card>
          </div>
        )}
      </div>
    );
  }
);
