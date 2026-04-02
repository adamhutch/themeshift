# ThemeShift Monorepo

ThemeShift is now managed as a single monorepo so the Vite plugin, UI library, and docs app can evolve together without publishing intermediate npm versions.

## Workspace layout

- `packages/vite-plugin-themeshift`: publishes `@themeshift/vite-plugin-themeshift`
- `packages/ui`: publishes `@themeshift/ui`
- `apps/ui-app`: private docs/tooling app deployed through Netlify

## Local development

```bash
pnpm install
pnpm dev:ui-app
```

Useful workspace commands:

```bash
pnpm build
pnpm build:ui
pnpm test:packages
pnpm lint
pnpm typecheck
```

## Releases and deploys

- Public packages in `packages/*` are versioned with Changesets and published from the repo root.
- `@themeshift/ui` and `@themeshift/ui-app` stay in lock-step for versioning, but only `@themeshift/ui` is published to npm.
- `apps/*` stay private and are deployed through Netlify.
- `apps/ui-app` is configured to build from the monorepo root with `pnpm turbo run build --filter=@themeshift/ui-app...`.
- `@themeshift/ui` publishes fonts separately via `@themeshift/ui/css/fonts.css` so consumers can opt into the default Noto Sans assets or provide their own fonts.

## README strategy

- Keep this root README focused on repository structure and contributor workflows.
- Keep package READMEs focused on installation and usage.
- Keep long-form guides and interactive examples in `apps/ui-app`.
