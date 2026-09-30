# Changelog

## [Unreleased]

### Added
- **Localization.** All UI strings (dock bar, menus, dialogs, confirmations, settings tab) now go through a small built-in i18n layer. Shipped languages: English, 简体中文 (Simplified Chinese), Magyar (Hungarian).
- **Language setting** (Settings → Quick Commands → Language, config key `qc.language`):
  - `auto` (default) — follow Tabby's own language setting; when Tabby is on "Automatic", follow the system language. Languages the plugin doesn't ship fall back to English.
  - `en` / `zh-CN` / `hu` — force a language for this plugin, independent of Tabby's and the system's language.
- Changing the language applies immediately, no restart needed.

### Changed
- The default UI language is no longer hard-coded Chinese. Users whose Tabby / system language is Chinese see no change; everyone else gets English (or Hungarian) instead of Chinese.

## [1.1.4] - 2026-09-30

### Fixed
- Pasting into the "命令内容" textarea of the add/edit command dialog also pasted the clipboard into the terminal behind it. Tabby's global paste hotkey only guards against focused `<input>` elements, not `<textarea>`, and the terminal tab keeps `hasFocus` while a modal is open. Both dialogs now disable Tabby's global hotkeys while open (same approach as Tabby's own hotkey-input modal) and re-enable them on close.

## [1.1.3] - 2026-08-17

### Changed
- Set package author to `zhangnan666` (was `minyoad`, leftover from the original fork).

## [1.1.2] - 2026-08-17

### Fixed
- The dock bar shrank the terminal's usable height, which left the alternate buffer (full-screen apps such as vim, less, `kubectl edit`) with a stale render layout. The first full-screen app in a terminal then ghosted its bottom status line into the content on scroll. Fixed by forcing one genuine terminal resize the first time a terminal switches into the alternate buffer — once per terminal, with no churn on later full-screen apps.

## [1.1.1] - 2026-08-14

### Fixed
- Removed a leftover global `keydown` listener (registered in the capture phase) that intercepted every keystroke to match now-removed per-command shortcuts. It could swallow characters and break typing in terminal apps such as **vim's insert/edit mode**.

### Removed
- Obsolete `ButtonProvider` (per-command keyboard shortcut handling and toolbar button) — shortcuts were already dropped from the UI in the 1.0.0 relaunch.
- Dead `Alt-Q` hotkey default in config.

## [1.0.0] - 2026-07-29

Relaunched as **tabby-quick-cmd-dock** — a quick-command dock at the bottom of Tabby terminals. Based on tabby-quick-cmds.

### Added
- Bottom command dock in every terminal tab with grouped, one-click command buttons
- Group dropdown selector to switch the active group
- In-place management from the dock: add/edit/delete groups and commands via dialogs
- "Default group" flag per group
- Per-command color (preset palette), note (custom hover tooltip), and run-confirmation
- Auto-refocus terminal after running a command
- Single enable/disable toggle in the settings page

### Removed
- Alt+Q quick-command popup (replaced by the always-visible dock)
- SSH profile scoping
- Special syntax: `\xNN` control chars, `\sNN` delays, `${param}` prompts
- Toolbar button / keyboard icon

## [1.2.0] - 2026-05-10

### Changed
- Migrated from deprecated `terminus-*` to `tabby-*` core packages
- Updated Angular dependencies from 13.x to 15.2.6 to match Tabby v1.0.156
- Updated TypeScript, Webpack, and build tools to latest compatible versions
- Removed deprecated `entryComponents` array (Angular 15+ with Ivy doesn't require this)

### Fixed
- **Security:** Added `.npmrc` with `legacy-peer-deps=true` for compatibility with Tabby's Angular peer dependencies
- Improved module declarations to follow Angular 15+ best practices

### Added
- SECURITY.md with vulnerability disclosure policy
- CHANGELOG.md for version tracking
- Node.js version constraint updated to support future versions (< 26.0.0)

### Dependencies
- `@angular/common`: ^15.2.6 (was ^13.3.2)
- `@angular/core`: ^15.2.6 (was ^13.3.2)
- `@angular/forms`: ^15.2.6 (was ^13.3.2)
- `@ng-bootstrap/ng-bootstrap`: ^14.1.0 (was ^12.0.2)
- `tabby-core`: ^1.0.156 (was terminus-core ^1.0.140)
- `tabby-settings`: ^1.0.156 (was terminus-settings ^1.0.140)
- `tabby-terminal`: ^1.0.156 (was terminus-terminal ^1.0.140)
- `ts-loader`: ^9.5.4 (was ^9.2.8)

## [1.1.6] - Previous releases
- (See upstream repository for earlier versions)
