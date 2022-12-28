export type FormatterInput = {
  text?: string;
  guesstimateType: string | null;
  data?: any;
};

export type FormatterError = {
  type: string;
  subType: string;
};

export type Formatter = {
  formatterName: string;
  guesstimateType?: string;
  inputType?: "NONE";
  matches(input: FormatterInput): boolean;
  error(input: FormatterInput): FormatterError | {} | undefined;
  format(input: FormatterInput): any;
};
