import { Injectable, NgZone } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TerminalDecorator } from 'tabby-terminal'
import { ConfigService } from 'tabby-core'
import { BaseTerminalTabComponent } from 'tabby-terminal'
import { QuickCmds } from './api'
import { EditCommandModalComponent } from './components/editCommandModal.component'
import { EditGroupModalComponent } from './components/editGroupModal.component'
import { I18nService } from './i18n'

interface TerminalGroup {
    name: string
    label: string
    cmds: QuickCmds[]
    defaultVisible: boolean
}

interface MenuItem {
    label: string
    danger?: boolean
    active?: boolean
    action: () => void
}

const ICON_GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
const ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>'
const ICON_CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'

const STYLE_ID = 'qc-terminal-bar-styles'
const MENU_ID = 'qc-context-menu'
const TOOLTIP_ID = 'qc-tooltip'

function injectStyles (): void {
    if (document.getElementById(STYLE_ID)) {
        return
    }
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .qc-terminal-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 12px;
        background: linear-gradient(to bottom,
          color-mix(in srgb, var(--bs-body-bg, #1e1e1e) 88%, var(--bs-body-color, #ccc) 12%),
          color-mix(in srgb, var(--bs-body-bg, #1e1e1e) 94%, var(--bs-body-color, #ccc) 6%));
        border-top: 1px solid color-mix(in srgb, var(--bs-body-color, #ccc) 12%, transparent);
        flex-shrink: 0;
        min-height: 40px;
        -webkit-app-region: no-drag;
      }
      .qc-terminal-bar .qc-group-select {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: 160px;
        height: 30px;
        padding: 0 10px 0 13px;
        font-size: 12px;
        font-weight: 600;
        font-family: var(--font-family, "Inter", "Segoe UI", system-ui, sans-serif);
        color: #fff;
        background-color: var(--bs-primary, #3b82f6);
        border: 1px solid color-mix(in srgb, var(--bs-primary, #3b82f6) 80%, #000 20%);
        border-radius: 15px;
        cursor: pointer;
        outline: none;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--bs-primary, #3b82f6) 30%, transparent);
        transition: all 160ms ease;
      }
      .qc-terminal-bar .qc-group-select .qc-group-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .qc-terminal-bar .qc-group-select .qc-caret {
        flex: 0 0 auto;
        display: inline-flex;
        width: 12px;
        height: 12px;
        opacity: 0.85;
      }
      .qc-terminal-bar .qc-group-select .qc-caret svg {
        width: 12px;
        height: 12px;
      }
      .qc-terminal-bar .qc-group-select:hover {
        background-color: color-mix(in srgb, var(--bs-primary, #3b82f6) 90%, #fff 10%);
        box-shadow: 0 4px 14px color-mix(in srgb, var(--bs-primary, #3b82f6) 40%, transparent);
        transform: translateY(-1px);
      }
      .qc-terminal-bar .qc-group-select:active {
        transform: translateY(0);
      }
      .qc-terminal-bar .qc-icon-btn {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0;
        color: color-mix(in srgb, var(--bs-body-color, #ccc) 72%, var(--bs-body-bg, #1e1e1e));
        background: color-mix(in srgb, var(--bs-body-color, #ccc) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--bs-body-color, #ccc) 15%, transparent);
        border-radius: 50%;
        cursor: pointer;
        transition: all 150ms ease;
      }
      .qc-terminal-bar .qc-icon-btn svg {
        width: 15px;
        height: 15px;
      }
      .qc-terminal-bar .qc-icon-btn:hover {
        color: var(--bs-primary, #3b82f6);
        background: color-mix(in srgb, var(--bs-primary, #3b82f6) 12%, transparent);
        border-color: color-mix(in srgb, var(--bs-primary, #3b82f6) 34%, transparent);
        transform: translateY(-1px);
      }
      .qc-terminal-bar .qc-divider {
        flex: 0 0 auto;
        width: 1px;
        height: 20px;
        background: color-mix(in srgb, var(--bs-body-color, #ccc) 14%, transparent);
      }
      .qc-terminal-bar .qc-buttons-scroll {
        display: flex;
        align-items: center;
        gap: 7px;
        overflow-x: auto;
        overflow-y: hidden;
        flex: 1;
        min-width: 0;
        padding: 3px 1px;
        scrollbar-width: thin;
        scrollbar-color: color-mix(in srgb, var(--bs-body-color, #ccc) 22%, transparent) transparent;
      }
      .qc-terminal-bar .qc-buttons-scroll::-webkit-scrollbar {
        height: 5px;
      }
      .qc-terminal-bar .qc-buttons-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .qc-terminal-bar .qc-buttons-scroll::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--bs-body-color, #ccc) 18%, transparent);
        border-radius: 4px;
      }
      .qc-terminal-bar .qc-buttons-scroll::-webkit-scrollbar-thumb:hover {
        background: color-mix(in srgb, var(--bs-primary, #3b82f6) 45%, transparent);
      }
      .qc-terminal-bar .qc-empty {
        font-size: 12px;
        color: color-mix(in srgb, var(--bs-body-color, #ccc) 50%, transparent);
        font-style: italic;
        padding-left: 2px;
      }
      .qc-terminal-btn {
        flex: 0 0 auto;
        max-width: 180px;
        height: 28px;
        padding: 0 14px;
        font-size: 12px;
        font-weight: 500;
        font-family: var(--font-family, "Inter", "Segoe UI", system-ui, sans-serif);
        color: color-mix(in srgb, var(--bs-body-color, #ccc) 85%, var(--bs-body-bg, #1e1e1e));
        background: color-mix(in srgb, var(--bs-body-color, #ccc) 9%, transparent);
        border: 1px solid color-mix(in srgb, var(--bs-body-color, #ccc) 15%, transparent);
        border-radius: 14px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.01em;
        transition: all 160ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .qc-terminal-btn:hover {
        color: #fff;
        background: var(--bs-primary, #3b82f6);
        border-color: color-mix(in srgb, var(--bs-primary, #3b82f6) 80%, #000 20%);
        box-shadow: 0 3px 12px color-mix(in srgb, var(--bs-primary, #3b82f6) 32%, transparent);
        transform: translateY(-1.5px);
      }
      .qc-terminal-btn:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px color-mix(in srgb, var(--bs-primary, #3b82f6) 24%, transparent);
        background: color-mix(in srgb, var(--bs-primary, #3b82f6) 88%, #000 12%);
      }
      .qc-terminal-btn.qc-colored {
        color: var(--qc-btn-color);
        background: color-mix(in srgb, var(--qc-btn-color) 12%, transparent);
        border-color: color-mix(in srgb, var(--qc-btn-color) 45%, transparent);
      }
      .qc-terminal-btn.qc-colored:hover {
        color: #fff;
        background: var(--qc-btn-color);
        border-color: color-mix(in srgb, var(--qc-btn-color) 80%, #000 20%);
        box-shadow: 0 3px 12px color-mix(in srgb, var(--qc-btn-color) 32%, transparent);
      }
      .qc-terminal-btn.qc-colored:active {
        background: color-mix(in srgb, var(--qc-btn-color) 88%, #000 12%);
      }
      .qc-terminal-btn.qc-add-btn {
        color: var(--bs-primary, #3b82f6);
        background: transparent;
        border-style: dashed;
        border-color: color-mix(in srgb, var(--bs-primary, #3b82f6) 40%, transparent);
        padding: 0 12px;
        gap: 3px;
        display: inline-flex;
        align-items: center;
      }
      .qc-terminal-btn.qc-add-btn svg {
        width: 13px;
        height: 13px;
      }
      .qc-terminal-btn.qc-add-btn:hover {
        color: #fff;
        background: var(--bs-primary, #3b82f6);
        border-style: solid;
      }
      #${MENU_ID} {
        position: fixed;
        z-index: 100000;
        min-width: 130px;
        padding: 5px;
        background: var(--bs-body-bg, #1e1e1e);
        border: 1px solid color-mix(in srgb, var(--bs-body-color, #ccc) 18%, transparent);
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        font-family: var(--font-family, "Inter", "Segoe UI", system-ui, sans-serif);
      }
      #${MENU_ID} .qc-menu-item {
        display: block;
        width: 100%;
        padding: 7px 12px;
        font-size: 12.5px;
        color: var(--bs-body-color, #ccc);
        text-align: left;
        background: transparent;
        border: 0;
        border-radius: 6px;
        cursor: pointer;
        transition: background 120ms ease, color 120ms ease;
      }
      #${MENU_ID} .qc-menu-item:hover {
        background: color-mix(in srgb, var(--bs-primary, #3b82f6) 16%, transparent);
        color: var(--bs-primary, #3b82f6);
      }
      #${MENU_ID} .qc-menu-item.danger:hover {
        background: color-mix(in srgb, var(--bs-danger, #e5534b) 18%, transparent);
        color: var(--bs-danger, #e5534b);
      }
      #${MENU_ID} .qc-menu-item.active {
        color: var(--bs-primary, #3b82f6);
        font-weight: 650;
        background: color-mix(in srgb, var(--bs-primary, #3b82f6) 10%, transparent);
      }
      #${MENU_ID} .qc-menu-item:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      #${TOOLTIP_ID} {
        position: fixed;
        z-index: 100001;
        max-width: 320px;
        padding: 6px 10px;
        background: color-mix(in srgb, var(--bs-body-bg, #1e1e1e) 20%, #000 80%);
        color: #f2f2f2;
        border-radius: 7px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        font-family: var(--font-family, "Inter", "Segoe UI", system-ui, sans-serif);
        font-size: 11.5px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-all;
        pointer-events: none;
        opacity: 0;
        transform: translateY(3px);
        transition: opacity 120ms ease, transform 120ms ease;
      }
      #${TOOLTIP_ID}.show {
        opacity: 1;
        transform: translateY(0);
      }
    `
    document.head.appendChild(style)
}

@Injectable()
export class TerminalButtonDecorator extends TerminalDecorator {
    private bars = new WeakMap<BaseTerminalTabComponent, HTMLElement>()
    private signatures = new WeakMap<BaseTerminalTabComponent, string>()
    private altHooked = new WeakSet<BaseTerminalTabComponent>()
    private altBufferSubs = new WeakMap<BaseTerminalTabComponent, { dispose: () => void }>()
    private tooltipTimer: any = null

    constructor (
        private config: ConfigService,
        private ngbModal: NgbModal,
        private zone: NgZone,
        private i18n: I18nService,
    ) {
        super()
        injectStyles()
    }

    attach (terminal: BaseTerminalTabComponent): void {
        const tryAttach = () => {
            if (this.bars.has(terminal)) {
                return
            }
            const bar = this.createBar(terminal)
            terminal.element.nativeElement.appendChild(bar)
            this.bars.set(terminal, bar)
        }

        tryAttach()
        this.hookAltBufferFix(terminal)

        const readySub = this.config.ready$.subscribe(() => tryAttach())
        this.subscribeUntilDetached(terminal, readySub)

        const changedSub = this.config.changed$.subscribe(() => {
            if (!this.bars.has(terminal)) {
                tryAttach()
            } else {
                this.updateBar(terminal)
            }
        })
        this.subscribeUntilDetached(terminal, changedSub)
    }

    detach (terminal: BaseTerminalTabComponent): void {
        this.removeBar(terminal)
        this.signatures.delete(terminal)
        this.altBufferSubs.get(terminal)?.dispose()
        this.altBufferSubs.delete(terminal)
        this.altHooked.delete(terminal)
        super.detach(terminal)
    }

    // The dock bar shrinks the terminal tab's usable height. Everything stays
    // size-consistent (xterm rows == PTY rows == visible rows), yet the FIRST time a
    // full-screen app (vim, less, `kubectl edit`) switches xterm to its alternate
    // buffer, its bottom status line ghosts into the content on scroll. Diagnostics
    // proved this is not a sizing mismatch and not a plain repaint bug: forcing
    // xterm.refresh() does nothing, but a genuine resize clears it permanently — the
    // alternate buffer's render layout is left stale by the bar-induced shrink at
    // startup and only a real resize re-lays it out. Crucially it stays fixed after
    // that one resize (subsequent full-screen apps in the same terminal are fine), so
    // we only need to act ONCE per terminal: on its first switch into the alternate
    // buffer, force a single genuine resize (shrink a row, then fit back — a real
    // change, not the no-op that re-fitting to the current size would be), fired twice
    // to cover paint timing. Retries until xterm exists.
    private hookAltBufferFix (terminal: BaseTerminalTabComponent, attempt = 0): void {
        if (this.altHooked.has(terminal) || attempt > 10) {
            return
        }
        const xterm: any = (terminal as any).frontend?.xterm
        const onBufferChange: any = xterm?.buffer?.onBufferChange
        if (!xterm || typeof onBufferChange !== 'function') {
            setTimeout(() => this.hookAltBufferFix(terminal, attempt + 1), 200)
            return
        }
        this.altHooked.add(terminal)
        const disposable = xterm.buffer.onBufferChange((buf: any) => {
            if (buf?.type !== 'alternate') {
                return
            }
            // Only correct the ghost when the bar is actually shown — when the plugin
            // is disabled there is no bar, no shrink, and thus nothing to fix.
            if (!this.isEnabled() || !this.bars.has(terminal)) {
                return
            }
            // One genuine resize permanently clears this terminal's stale layout, so
            // fix on the first alternate-buffer entry only and then stop listening —
            // no churn on every later vim/less/kubectl edit.
            this.altBufferSubs.get(terminal)?.dispose()
            this.altBufferSubs.delete(terminal)
            requestAnimationFrame(() => this.forceRefit(terminal))
            setTimeout(() => this.forceRefit(terminal), 120)
        })
        if (disposable?.dispose) {
            this.altBufferSubs.set(terminal, disposable)
        }
    }

    private forceRefit (terminal: BaseTerminalTabComponent): boolean {
        const frontend: any = (terminal as any).frontend
        const xterm: any = frontend?.xterm
        const fitAddon: any = frontend?.fitAddon
        if (!xterm?.element || typeof xterm.resize !== 'function' || typeof fitAddon?.fit !== 'function') {
            return false
        }
        try {
            if (xterm.rows > 1) {
                // Genuine size change so the follow-up fit is not short-circuited.
                xterm.resize(xterm.cols, xterm.rows - 1)
            }
            // Fit back to the real (bar-reduced) size; reflows both buffers + resizes PTY.
            fitAddon.fit()
            return true
        } catch {
            return false
        }
    }

    private removeBar (terminal: BaseTerminalTabComponent): void {
        const bar = this.bars.get(terminal)
        if (bar && bar.parentNode) {
            bar.parentNode.removeChild(bar)
        }
        this.bars.delete(terminal)
    }

    private createBar (terminal: BaseTerminalTabComponent): HTMLElement {
        const bar = document.createElement('div')
        bar.className = 'qc-terminal-bar'
        this.populateBar(bar, terminal)
        return bar
    }

    private isEnabled (): boolean {
        return this.config.store.qc?.enabled !== false
    }

    private updateBar (terminal: BaseTerminalTabComponent): void {
        const bar = this.bars.get(terminal)
        if (!bar) {
            return
        }

        // Only rebuild when structural data actually changed — config.changed$ fires
        // often, and rebuilding the <select> mid-interaction causes flashing.
        const groups = this.buildGroups()
        const signature = this.computeSignature(groups)
        if (this.signatures.get(terminal) === signature) {
            return
        }

        this.populateBar(bar, terminal, groups, signature)
    }

    private populateBar (
        bar: HTMLElement,
        terminal: BaseTerminalTabComponent,
        prebuiltGroups?: TerminalGroup[],
        prebuiltSignature?: string,
    ): void {
        bar.innerHTML = ''

        const allGroups = prebuiltGroups ?? this.buildGroups()
        const signature = prebuiltSignature ?? this.computeSignature(allGroups)
        this.signatures.set(terminal, signature)

        // Hide the whole bar when the plugin is disabled
        if (!this.isEnabled()) {
            bar.style.display = 'none'
            return
        }
        bar.style.display = ''

        const activeGroupName = allGroups.length ? this.resolveActiveGroup(allGroups) : null

        // Buttons scroll container (created early so the dropdown handler can reference it)
        const scroll = document.createElement('div')
        scroll.className = 'qc-buttons-scroll'

        // Group selector — custom dropdown (native <select> misbehaves inside the
        // terminal overlay), only shown when groups exist
        if (allGroups.length) {
            const groupBtn = document.createElement('button')
            groupBtn.className = 'qc-group-select'
            groupBtn.title = this.i18n.t('bar.switchGroup')
            const label = document.createElement('span')
            label.className = 'qc-group-label'
            const current = allGroups.find(g => g.name === activeGroupName) ?? allGroups[0]
            label.textContent = current.label
            const caret = document.createElement('span')
            caret.className = 'qc-caret'
            caret.innerHTML = ICON_CHEVRON
            groupBtn.appendChild(label)
            groupBtn.appendChild(caret)
            groupBtn.addEventListener('click', (event) => {
                event.stopPropagation()
                const rect = groupBtn.getBoundingClientRect()
                const activeName = this.resolveActiveGroup(allGroups)
                this.showMenu(rect.left, rect.bottom + 4, allGroups.map(g => ({
                    label: g.label,
                    active: g.name === activeName,
                    action: () => {
                        this.config.store.qc.activeGroup = g.name
                        this.config.save()
                        label.textContent = g.label
                        this.renderButtons(scroll, terminal, g)
                    },
                })))
            })
            bar.appendChild(groupBtn)
        }

        // Group-management gear button (always available)
        const gearBtn = document.createElement('button')
        gearBtn.className = 'qc-icon-btn'
        gearBtn.innerHTML = ICON_GEAR
        gearBtn.title = this.i18n.t('bar.manageGroups')
        gearBtn.addEventListener('click', (event) => {
            event.stopPropagation()
            const currentActive = this.resolveActiveGroup(allGroups)
            this.openGroupMenu(gearBtn, currentActive)
        })
        bar.appendChild(gearBtn)

        // Divider
        const divider = document.createElement('div')
        divider.className = 'qc-divider'
        bar.appendChild(divider)

        bar.appendChild(scroll)

        const activeGroup = allGroups.find(g => g.name === activeGroupName) ?? allGroups[0]
        this.renderButtons(scroll, terminal, activeGroup)
    }

    private renderButtons (scroll: HTMLElement, terminal: BaseTerminalTabComponent, group?: TerminalGroup): void {
        scroll.innerHTML = ''

        if (!group) {
            const empty = document.createElement('span')
            empty.className = 'qc-empty'
            empty.textContent = this.i18n.t('bar.empty')
            scroll.appendChild(empty)
            return
        }

        for (const cmd of group.cmds) {
            const btn = document.createElement('button')
            btn.className = 'qc-terminal-btn'
            btn.textContent = cmd.name || cmd.text
            if (cmd.color) {
                btn.classList.add('qc-colored')
                btn.style.setProperty('--qc-btn-color', cmd.color)
            }
            const tipText = cmd.note ? `${cmd.text}\n${cmd.note}` : cmd.text
            btn.addEventListener('mouseenter', () => this.scheduleTooltip(btn, tipText))
            btn.addEventListener('mouseleave', () => this.hideTooltip())
            btn.addEventListener('click', (event) => {
                event.stopPropagation()
                this.hideTooltip()
                this.executeCommand(terminal, cmd)
            })
            btn.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                event.stopPropagation()
                this.hideTooltip()
                this.openCommandMenu(event.clientX, event.clientY, cmd)
            })
            scroll.appendChild(btn)
        }

        // Trailing "add command" button
        const addBtn = document.createElement('button')
        addBtn.className = 'qc-terminal-btn qc-add-btn'
        addBtn.innerHTML = ICON_PLUS
        const addLabel = document.createElement('span')
        addLabel.textContent = this.i18n.t('bar.addCommand')
        addBtn.appendChild(addLabel)
        addBtn.addEventListener('mouseenter', () => this.scheduleTooltip(addBtn, this.i18n.t('bar.addCommandTooltip')))
        addBtn.addEventListener('mouseleave', () => this.hideTooltip())
        addBtn.addEventListener('click', (event) => {
            event.stopPropagation()
            this.hideTooltip()
            this.openAddCommand(group.name)
        })
        scroll.appendChild(addBtn)
    }

    private computeSignature (groups: TerminalGroup[]): string {
        // Structural data + enabled flag + UI language (NOT activeGroup) so switching
        // groups in the dropdown does not trigger a rebuild, but a language change does.
        const enabled = this.isEnabled() ? 1 : 0
        return enabled + ':' + this.i18n.locale + '::' + groups
            .map(g => `${g.name}|${g.defaultVisible ? 1 : 0}|${g.cmds.map(c => c.name + '\x00' + c.text + '\x00' + (c.color || '') + '\x00' + (c.note || '') + '\x00' + (c.confirmBeforeRun ? 1 : 0)).join('\x01')}`)
            .join('~~')
    }

    private buildGroups (): TerminalGroup[] {
        const cmds: QuickCmds[] = this.config.store.qc?.cmds ?? []
        const storedGroups: any[] = this.config.store.qc?.groups ?? []

        const groupMap = new Map<string, QuickCmds[]>()

        // Seed with stored (named) groups so empty groups still show
        for (const g of storedGroups) {
            if (g.name) {
                groupMap.set(g.name, [])
            }
        }

        // Add all commands to their groups (creates the Ungrouped '' bucket if needed)
        for (const cmd of cmds) {
            const name = cmd.group || ''
            if (!groupMap.has(name)) {
                groupMap.set(name, [])
            }
            groupMap.get(name)!.push(cmd)
        }

        return Array.from(groupMap.entries()).map(([name, groupCmds]) => {
            const stored = storedGroups.find((g: any) => g.name === name)
            return {
                name,
                label: name || this.i18n.t('group.ungrouped'),
                cmds: groupCmds,
                defaultVisible: stored?.defaultVisible ?? false,
            }
        })
    }

    private resolveActiveGroup (allGroups: TerminalGroup[]): string {
        const activeGroup = this.config.store.qc?.activeGroup
        if (typeof activeGroup === 'string' && allGroups.some(g => g.name === activeGroup)) {
            return activeGroup
        }
        const defaultGroup = allGroups.find(g => g.defaultVisible)
        if (defaultGroup) {
            return defaultGroup.name
        }
        return allGroups[0]?.name ?? ''
    }

    // ---------------------------------------------------------------- context menu

    private closeMenu (): void {
        const existing = document.getElementById(MENU_ID)
        if (existing) {
            existing.remove()
        }
    }

    private showMenu (x: number, y: number, items: MenuItem[]): void {
        this.closeMenu()

        const menu = document.createElement('div')
        menu.id = MENU_ID

        for (const item of items) {
            const btn = document.createElement('button')
            btn.className = 'qc-menu-item' + (item.danger ? ' danger' : '') + (item.active ? ' active' : '')
            btn.textContent = item.label
            btn.addEventListener('click', (event) => {
                event.stopPropagation()
                this.closeMenu()
                item.action()
            })
            menu.appendChild(btn)
        }

        document.body.appendChild(menu)

        // Position, keeping it inside the viewport
        const rect = menu.getBoundingClientRect()
        const left = Math.min(x, window.innerWidth - rect.width - 8)
        const top = Math.min(y, window.innerHeight - rect.height - 8)
        menu.style.left = `${Math.max(8, left)}px`
        menu.style.top = `${Math.max(8, top)}px`

        const dismiss = (event: Event) => {
            if (!menu.contains(event.target as Node)) {
                this.closeMenu()
                cleanup()
            }
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                this.closeMenu()
                cleanup()
            }
        }
        const cleanup = () => {
            document.removeEventListener('mousedown', dismiss, true)
            document.removeEventListener('keydown', onKey, true)
        }
        setTimeout(() => {
            document.addEventListener('mousedown', dismiss, true)
            document.addEventListener('keydown', onKey, true)
        })
    }

    private openCommandMenu (x: number, y: number, cmd: QuickCmds): void {
        this.showMenu(x, y, [
            { label: this.i18n.t('menu.editCommand'), action: () => this.openEditCommand(cmd) },
            { label: this.i18n.t('menu.deleteCommand'), danger: true, action: () => this.deleteCommand(cmd) },
        ])
    }

    private openGroupMenu (anchor: HTMLElement, activeGroupName: string | null): void {
        const rect = anchor.getBoundingClientRect()
        const hasGroup = activeGroupName !== null
        const items: MenuItem[] = [
            { label: this.i18n.t('menu.addGroup'), action: () => this.openAddGroup() },
        ]
        if (hasGroup) {
            items.push({ label: this.i18n.t('menu.editGroup'), action: () => this.openEditGroup(activeGroupName!) })
            items.push({ label: this.i18n.t('menu.deleteGroup'), danger: true, action: () => this.deleteGroup(activeGroupName!) })
        }
        this.showMenu(rect.left, rect.bottom + 4, items)
    }

    // ---------------------------------------------------------------- command CRUD

    private allGroupNames (): string[] {
        const cmds: QuickCmds[] = this.config.store.qc?.cmds ?? []
        const stored: any[] = this.config.store.qc?.groups ?? []
        const names = new Set<string>()
        cmds.forEach(c => { if (c.group) names.add(c.group) })
        stored.forEach(g => { if (g.name) names.add(g.name) })
        return Array.from(names)
    }

    private openAddCommand (groupName: string): void {
        this.zone.run(() => {
            const command: QuickCmds = { name: '', text: '', appendCR: true, group: groupName || '', note: '', color: '', confirmBeforeRun: false }
            const modal = this.ngbModal.open(EditCommandModalComponent)
            modal.componentInstance.command = command
            modal.componentInstance.allGroups = this.allGroupNames()
            modal.result.then((result: QuickCmds) => {
                this.config.store.qc.cmds = [...(this.config.store.qc.cmds ?? []), result]
                this.config.save()
            }, () => null)
        })
    }

    private openEditCommand (cmd: QuickCmds): void {
        this.zone.run(() => {
            // The "ungrouped" pseudo-group is shown by its localized label; map it
            // (and an emptied field) back to "no group" on save.
            const ungroupedLabel = this.i18n.t('group.ungrouped')
            const modal = this.ngbModal.open(EditCommandModalComponent)
            modal.componentInstance.command = { ...cmd, group: cmd.group || ungroupedLabel }
            modal.componentInstance.allGroups = this.allGroupNames()
            modal.result.then((result: QuickCmds) => {
                if (!result.group || result.group === ungroupedLabel) {
                    result.group = null as any
                }
                Object.assign(cmd, result)
                this.config.save()
            }, () => null)
        })
    }

    private deleteCommand (cmd: QuickCmds): void {
        if (!confirm(this.i18n.t('confirm.deleteCommand', { name: cmd.name || cmd.text }))) {
            return
        }
        this.config.store.qc.cmds = (this.config.store.qc.cmds ?? []).filter((c: QuickCmds) => c !== cmd)
        this.config.save()
    }

    // ---------------------------------------------------------------- group CRUD

    private openAddGroup (): void {
        this.zone.run(() => {
            const group = { name: '', cmds: [] }
            const modal = this.ngbModal.open(EditGroupModalComponent)
            modal.componentInstance.group = group
            modal.result.then((result: any) => {
                if (!result?.name) {
                    return
                }
                const groups = this.config.store.qc.groups ?? []
                if (!groups.find((g: any) => g.name === result.name)) {
                    groups.push({ name: result.name })
                }
                this.config.store.qc.groups = groups
                // Keep the current selection — do not auto-switch to the newly added group
                this.config.save()
            }, () => null)
        })
    }

    private openEditGroup (name: string): void {
        this.zone.run(() => {
            const groups = this.config.store.qc.groups ?? []
            const stored = groups.find((g: any) => g.name === name) ?? { name }
            const modal = this.ngbModal.open(EditGroupModalComponent)
            modal.componentInstance.group = { name: stored.name, cmds: [] }
            modal.result.then((result: any) => {
                if (!result?.name) {
                    return
                }
                const oldName = name
                // Rename member commands
                for (const cmd of (this.config.store.qc.cmds ?? []).filter((c: QuickCmds) => (c.group || '') === oldName)) {
                    cmd.group = result.name
                }
                // Upsert group entry, preserving defaultVisible
                const list = this.config.store.qc.groups ?? []
                const existing = list.find((g: any) => g.name === result.name)
                if (!existing) {
                    const prev = list.find((g: any) => g.name === oldName)
                    list.push({ name: result.name, defaultVisible: prev?.defaultVisible ?? false })
                }
                // Remove old entry if renamed
                this.config.store.qc.groups = list.filter((g: any) => g.name !== oldName || g.name === result.name)
                if (this.config.store.qc.activeGroup === oldName) {
                    this.config.store.qc.activeGroup = result.name
                }
                this.config.save()
            }, () => null)
        })
    }

    private deleteGroup (name: string): void {
        if (!confirm(this.i18n.t('confirm.deleteGroup', { name }))) {
            return
        }
        for (const cmd of (this.config.store.qc.cmds ?? []).filter((c: QuickCmds) => (c.group || '') === name)) {
            cmd.group = null as any
        }
        this.config.store.qc.groups = (this.config.store.qc.groups ?? []).filter((g: any) => g.name !== name)
        if (this.config.store.qc.activeGroup === name) {
            this.config.store.qc.activeGroup = null
        }
        this.config.save()
    }

    // ---------------------------------------------------------------- execution

    private async executeCommand (terminal: BaseTerminalTabComponent, cmd: QuickCmds): Promise<void> {
        if (!cmd.text) {
            return
        }

        // Optional confirmation before running (per-command, default off)
        if (cmd.confirmBeforeRun && !confirm(this.i18n.t('confirm.run', { name: cmd.name || cmd.text }))) {
            return
        }

        this.sendText(terminal, cmd)
    }

    private async sendText (terminal: BaseTerminalTabComponent, cmd: QuickCmds): Promise<void> {
        const text = cmd.text
        if (!text) {
            return
        }

        const lines = text.split(/\r?\n/)
        let terminator = '\n'

        const title = (terminal as any).title ?? ''
        if (title.includes('cmd.exe')) {
            terminator = '\r\n'
        } else if (title.includes('powershell')) {
            terminator = '\r\n'
        }

        for (const line of lines) {
            if (!line) continue
            await terminal.sendInput(line)
            if (cmd.appendCR !== false) {
                await new Promise(resolve => setTimeout(resolve, 30))
                await terminal.sendInput(terminator)
            }
        }

        this.focusTerminal(terminal)
    }

    private focusTerminal (terminal: BaseTerminalTabComponent): void {
        // Return focus to the terminal so the user can keep typing after a click
        try {
            (terminal as any).frontend?.focus()
        } catch {
            // ignore
        }
    }

    // ---------------------------------------------------------------- tooltip

    private scheduleTooltip (target: HTMLElement, text: string): void {
        if (!text) {
            return
        }
        clearTimeout(this.tooltipTimer)
        this.tooltipTimer = setTimeout(() => this.showTooltip(target, text), 220)
    }

    private showTooltip (target: HTMLElement, text: string): void {
        let tip = document.getElementById(TOOLTIP_ID)
        if (!tip) {
            tip = document.createElement('div')
            tip.id = TOOLTIP_ID
            document.body.appendChild(tip)
        }
        tip.textContent = text

        const rect = target.getBoundingClientRect()
        const tipRect = tip.getBoundingClientRect()
        // Prefer above the button; fall back to below if it would clip the top
        let top = rect.top - tipRect.height - 8
        if (top < 6) {
            top = rect.bottom + 8
        }
        let left = rect.left + rect.width / 2 - tipRect.width / 2
        left = Math.max(6, Math.min(left, window.innerWidth - tipRect.width - 6))
        tip.style.left = `${left}px`
        tip.style.top = `${top}px`
        tip.classList.add('show')
    }

    private hideTooltip (): void {
        clearTimeout(this.tooltipTimer)
        const tip = document.getElementById(TOOLTIP_ID)
        if (tip) {
            tip.classList.remove('show')
        }
    }
}
