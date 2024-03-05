import { PropagationError } from "~/lib/propagation/errors";

export type FormatterInput = {
  text?: string;
  guesstimateType?: string | null;
  data?: any;
};

export type Formatter = {
  formatterName: string;
  guesstimateType?: string;
  inputType?: "NONE";
  matches(input: FormatterInput): boolean;
  error(input: FormatterInput): PropagationError | undefined;
  format(input: FormatterInput): any;
};
