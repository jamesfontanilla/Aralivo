# Keyboard audit

The browser harness was able to inspect focusable controls and the dangerous-action dialog, but its synthetic `Tab` event did not move focus from `BODY`. The result is recorded as partial/not executable rather than a pass. A separate browser/manual keyboard pass is required before release.

The dialog-specific observation is reproducible in `settings-audit.json`: after opening Delete account, `document.activeElement` remained the triggering `Delete account` button and `activeWithinDialog` was false.
