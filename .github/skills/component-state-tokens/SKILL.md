---
name: component-state-tokens
description: Add granular, per-variant/per-state component design tokens (Color/Bg/BorderColor/Shadow) to an ant-design-vue component style so each state can be themed independently, while keeping the default CSS identical. Use when a component style reuses one shared/alias token (e.g. colorPrimaryHover, radioCheckedColor) across several variants or states and the user wants finer theme overrides via theme.components.<Component> or theme.token.
---

# Component state tokens

Goal: replace "one shared token drives many states" with dedicated component tokens (one per variant × state × property), **defaulting to the exact values used today**, so theming becomes precise and existing output does not change.

Reference implementations in this repo:

- `components/button/style/index.ts` (+ `group.ts`): full variant/state token set, `genButtonDefaultToken`, merge with `preserveExisting`.
- `components/radio/style/index.tsx`: radio button checked/hover/active/solid/disabled tokens.
- `components/button/__tests__/token.test.js`: CSS-extraction tests for overrides.

Work only from local source. Do not fetch upstream antd for this task.

## Workflow

### 1. Audit the current style

Open `components/<comp>/style/index.ts(x)` and list every place where a token (alias or component) is used for color, background, border color, shadow or outline. Record in a table: selector (variant + state) → CSS property → token/expression used today. Shared tokens are those that appear in more than one row. Include pseudo elements (`::before` separators), group/compact styles, and helper files in the same folder.

### 2. Design token names

Pattern: `<comp><Variant><Modifier><State><Property>`

- Variant: `Default`, `Primary`, `Dashed`, `Text`, `Link`, `Solid`, `Button`...
- Modifier (optional, in this order): `Danger`, `Ghost` (e.g. `DangerGhost`)
- State (optional): `Hover`, `Active`, `Checked`, `CheckedHover`, `Disabled`...
- Property: `Color`, `Bg`, `BorderColor`, `Shadow`

Examples: `buttonPrimaryHoverBg`, `buttonDefaultDangerActiveBorderColor`, `radioButtonCheckedHoverBorderColor`, `radioButtonHoverColor`.

Only create a token for a property that the state actually sets (or that is needed to make it independently overridable). Keep the list in the audit table.

### 3. Type the tokens

Add members to the exported `ComponentToken` interface in the style file (it is already registered in `components/theme/interface/components.ts`). For repetitive shapes use `Record` mapped types over template-literal keys (an index signature cannot use a generic template literal), e.g.:

```ts
type StateToken<P extends string> = Record<`${P}Color` | `${P}Bg` | `${P}BorderColor`, string>;
export interface ComponentToken extends StateToken<'buttonPrimaryHover'> { ... }
```

Remove internal-only tokens that the new public tokens replace (and their usages).

### 4. Provide defaults equal to today's values

Write `gen<Comp>DefaultToken(token)` returning every new token, each set to the exact expression from the audit table (e.g. `buttonPrimaryHoverBg: token.colorPrimaryHover`, `buttonPrimaryShadow: \`0 ${token.controlOutlineWidth}px 0 ${token.controlOutline}\``).

Merge inside the style function, **not** as the 3rd argument of `genComponentStyleHook`:

```ts
export default genComponentStyleHook('Comp', token => {
  const compToken = mergeToken<CompToken>(
    token,
    { /* internal derived tokens */ },
    genCompDefaultToken(token),
    { preserveExisting: true },
  );
  ...
});
```

Why:

- The hook's `getDefaultToken` receives the _global_ token only, so component-level alias overrides (`theme.components.Comp.colorTextLightSolid`, `controlOutline`, ...) would no longer reach the new tokens. Computing defaults from the merged `token` keeps them working.
- `preserveExisting: true` makes defaults fill only missing keys, so a value supplied via `theme.components.Comp` **or** `theme.token` always wins.

### 5. Route styles through the new tokens

Replace each shared-token usage with its dedicated token. Keep selector structure and rule order unchanged (specificity/order matters, e.g. generic `-disabled` rules emitted after variant rules). Refactor helpers to accept `{ color, bg, borderColor }` objects rather than a shared token. Update related files (group, compact, separators).

### 6. Verify defaults are unchanged

1. `npm run tsc -- --pretty false`
2. Compare full component CSS before/after (stash changes for the baseline). Temporary script/test using:

   ```js
   import { renderToString } from 'vue/server-renderer';
   import { createCache, extractStyle, StyleProvider } from '../../_util/cssinjs';
   const cache = createCache();
   await renderToString(
     <StyleProvider cache={cache}>
       <Comp />
     </StyleProvider>,
   );
   const css = extractStyle(cache, true);
   ```

   Accept only: identical values, redundant declarations equal to what already applied, and the cache hash. Investigate any real value/order change. Delete temp files after.

3. Add `components/<comp>/__tests__/token.test.js` (copy the button one) covering:
   - one state token override appears only in its own selector;
   - two states that shared a default can be set independently;
   - component-level alias overrides still propagate (e.g. `colorTextLightSolid`);
   - explicit state token beats alias override;
   - state token via `theme.token` is respected.
4. Run tests: `npm test -- components/<comp> --runInBand --no-watchman` (use `npm test`, not `npx`; `--no-watchman` avoids a watchman hang on this machine). Compare failures against a stashed baseline; only fix/update snapshots caused by the change.
5. `npx prettier --write` on changed files.

### 7. Report

Summarize: naming scheme, token groups added, removed internal tokens, verification results (CSS diff, tests), and deferred items (e.g. loading tokens, docs, rule reordering).
