# Changelog

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
