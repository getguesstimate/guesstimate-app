import clsx from "clsx";
import _ from "lodash";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import { Card } from "~/components/utility/Card";

type Props = {
  headerText?: string;
  onOpen?(): void;
  onClose?(): void;
  position?: "right" | "left";
  width?: "wide";
  openLink?: React.ReactNode;
  hasPadding?: boolean;
  children?: React.ReactNode;
};

export type DropDownHandle = {
  close(): void;
};

export const DropDown = React.forwardRef<DropDownHandle, Props>(
  (props, ref) => {
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

    const open = () => {
      setIsOpen(true);
    };

    const close = () => {
      setIsOpen(false);
      props.onClose?.();
    };

    const toggle = () => {
      isOpen ? close() : open();
    };

    return (
      <div className="dropDown-relative" ref={containerRef}>
        <div className="cursor-pointer" onClick={toggle}>
          {props.openLink}
        </div>
        {isOpen && (
          <div
            className={clsx(
              "dropDown",
              props.position === "right" ? "position-right" : "position-left"
            )}
          >
            <Card
              headerText={props.headerText}
              onClose={close}
              width={width}
              hasPadding={props.hasPadding}
              shadow={true}
            >
              {_.isArray(props.children) ? (
                <ul>
                  {props.children.map((child, i) => (
                    <div
                      key={i}
                      onMouseDown={
                        child?.props.closeOnClick ? close : undefined
                      }
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
