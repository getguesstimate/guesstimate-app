# UI preferences

- Keep workspace panels and compact menus concise. Use short labels such as “Input”, “Formula”, and “Data”.
- Put secondary explanations, examples, and instructions in a small question-mark help popover beside the relevant label or control. Do not add permanent explanatory paragraphs to compact panels when help can be disclosed on demand.
- Reuse the workspace `FieldHelp` component where appropriate. Help must support mouse hover, keyboard focus, and mobile tap; allow dismissal with Escape and outside interaction; and remain within the viewport.
- Keep essential labels, validation errors, and action feedback visible. Do not hide information required to identify a control or understand an immediate error in a tooltip.
- Before finishing a UI change, check for newly added instructional text that should be in the existing help popover instead.
