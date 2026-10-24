# Homepage demo video plan

Replace the homepage video showing the old UI with a reproducible recording of the new UI. Use the existing video's narration and actions as the starting point, then keep the script, audio generation settings, and browser automation together so we can regenerate the demo after UI changes.

Status: planned; implementation deferred while we continue other work.

## Extract the existing demo

1. Locate the original video and extract its audio.
2. Use speech to text to produce a transcript with timestamps, then correct transcription errors.
3. Review the video to identify the example model, input values, formulas, clicks, typing, and results shown during each narration segment.
4. Adapt the sequence and wording where the new UI behaves differently. Preserve the useful explanation rather than copying obsolete interactions.

## Define a reusable script

Split the demo into short narration segments. Each segment should specify:

- A stable identifier and narration text.
- The starting app state and browser actions to perform.
- The visible result to wait for.
- Any pauses, cursor movements, or typing pace needed to make the action readable.

Use a fixed example model and reset it before every recording. Keep the viewport, zoom, theme, and initial selection consistent. Prefer accessible control names and stable identifiers over screen coordinates.

## Generate narration and synchronize actions

Generate text to speech for each segment using the chosen voice and save the voice settings alongside the script. Measure the generated audio duration rather than relying on the original video's timestamps.

Run the matching browser actions during each audio segment, then hold the final state until the narration finishes. Wait for actual UI readiness before continuing. If an action sequence takes longer than its narration, adjust the segment timing or wording instead of cutting off the action or letting later segments drift.

Cache unchanged audio segments so small script or UI edits do not require regenerating everything. Produce captions from the final narration and segment timings.

## Record and assemble

Use browser automation, likely Playwright, to perform the actions and record the app in a headless browser. Include a visible cursor with deliberate movements and readable typing. Combine the recording and narration into the final video, keeping both on the same segment timeline.

Keep the process runnable through one documented command once setup is complete. Save the fixture, segment script, automation, audio settings, and export settings as the reproducible source; retain generated media separately as appropriate.

## Validate before replacing the homepage video

- Check that the example produces consistent results and every expected state is reached.
- Watch the full export for narration alignment, readable text, cursor movement, pauses, and clipping.
- Run the recording twice to catch timing assumptions and inconsistent initial state.
- Review the finished demo before updating the homepage video and poster image.

## Resume here

First locate and inspect the current homepage video. Extract its transcript and action sequence before choosing tools for speech recognition, voice generation, and video assembly. Choose the voice and final wording after reviewing that material. No transcription, voice selection, recording, or homepage replacement has been done yet.
