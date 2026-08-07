# Web surface

The current Vite entrypoint is kept at the workspace root (`src/`) so the single-package scaffold can run with one command. This directory is reserved as the deployable web boundary described in the architecture and can be split into an independent workspace without changing product routes or API contracts.
