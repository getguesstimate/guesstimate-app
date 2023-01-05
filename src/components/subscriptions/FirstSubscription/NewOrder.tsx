import { useEffect, useRef } from "react";

const newStyle = (height: number, hidden: boolean) => {
  let style = `
    width: 400px;
    border: none;
    border-radius: 5px;
    overflow: hidden;
  `;
  style += "height:" + (height + 10) + "px;";
  hidden && (style += "display:none;");
  return style;
};

export const NewOrder: React.FC<{
  page: string;
  name: string;
  onSuccess(): void;
  onCancel(): void;
}> = ({ page, name, onSuccess, onCancel }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const fn = () => {
      // wait for ChargeBee to load
      if (!window.ChargeBee) {
        timer = window.setTimeout(fn, 300);
        return;
      }
      window.ChargeBee.embed(page, name).load({
        addIframe(iframe) {
          ref.current?.append(iframe);
        },
        onLoad(iframe, _width: number, height: number) {
          iframe.setAttribute("style", newStyle(height, false));
        },
        onResize(iframe, _width: number, height: number) {
          iframe.setAttribute("style", newStyle(height, false));
        },
        onSuccess,
        onCancel,
      });
    };
    fn();
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return <div className="NewOrder" ref={ref} />;
};
