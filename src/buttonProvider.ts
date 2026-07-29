import { Injectable } from '@angular/core'
import { HotkeysService, ToolbarButtonProvider, IToolbarButton, ConfigService, AppService, BaseTabComponent, SplitTabComponent } from 'tabby-core'
import { BaseTerminalTabComponent as TerminalTabComponent } from 'tabby-terminal';
import { QuickCmds } from './api'

@Injectable()
export class ButtonProvider extends ToolbarButtonProvider {
    private usageCount: Record<string, number> = {}

    constructor (
        private hotkeys: HotkeysService,
        private config: ConfigService,
        private app: AppService,
    ) {
        super()

        // Listen for per-command shortcut hotkey matches
        this.hotkeys.matchedHotkey.subscribe(async (hotkey) => {
            this.executeCommandByShortcut(hotkey)
        })

        // Also listen for document keydown events to capture all shortcuts
        // Use capture phase to ensure we get the event before other handlers
        document.addEventListener('keydown', this.handleDocumentKeyDown.bind(this), true)
    }

    private handleDocumentKeyDown(event: KeyboardEvent) {
        // Skip if the key is being repeated (holding down a key)
        if (event.repeat) {
            return
        }

        // Build the shortcut string from the event
        let shortcut = ''
        const modifiers: string[] = []

        if (event.ctrlKey || event.metaKey) {
            modifiers.push('Ctrl')
        }
        if (event.altKey) {
            modifiers.push('Alt')
        }
        if (event.shiftKey) {
            modifiers.push('Shift')
        }

        // Sort modifiers to ensure consistent ordering
        modifiers.sort()

        // Add modifiers to shortcut string
        if (modifiers.length > 0) {
            shortcut = modifiers.join('+') + '+'
        }

        // Add the main key
        const mainKey = event.key

        // Only process if we have a valid main key (not just modifiers)
        if (mainKey && !['Control', 'Alt', 'Shift', 'Meta'].includes(mainKey)) {
            let processedKey = mainKey

            if (mainKey.length === 1) {
                processedKey = mainKey.toUpperCase()
            } else {
                processedKey = mainKey.charAt(0).toUpperCase() + mainKey.slice(1)
            }

            shortcut += processedKey

            const commands = this.config.store.qc.cmds
            const matchedCommand = commands.find(cmd => cmd.shortcut === shortcut)

            if (matchedCommand) {
                event.preventDefault()
                event.stopPropagation()
                this.executeCommandByShortcut(shortcut)
            }
        }
    }

    async executeCommandByShortcut(hotkey: string) {
        const commands = this.config.store.qc.cmds
        const matchedCommand = commands.find(cmd => cmd.shortcut === hotkey)

        if (matchedCommand) {
            this.usageCount[matchedCommand.text] = (this.usageCount[matchedCommand.text] || 0) + 1
            localStorage.setItem('qcUsageCount', JSON.stringify(this.usageCount))
            await this._send(this.app.activeTab, matchedCommand)
        }
    }

    async _send (tab: BaseTabComponent, quick_cmd: QuickCmds) {
        if (tab instanceof SplitTabComponent) {
            this._send((tab as SplitTabComponent).getFocusedTab(), quick_cmd)
            return
        }
        if (tab instanceof TerminalTabComponent) {
            const currentTab = tab as TerminalTabComponent

            let terminator = '\n'
            if (currentTab.title.includes('cmd.exe') || currentTab.title.includes('powershell')) {
                terminator = '\r\n'
            }

            const lines = quick_cmd.text.split(/\r?\n/)
            for (const line of lines) {
                if (!line) continue
                await currentTab.sendInput(line)
                if (quick_cmd.appendCR !== false) {
                    await this.sleep(30)
                    await currentTab.sendInput(terminator)
                }
            }
        }
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    provide (): IToolbarButton[] {
        return []
    }
}
