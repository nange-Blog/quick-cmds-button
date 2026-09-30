import { Injectable } from '@angular/core'
import { ConfigService } from 'tabby-core'

/**
 * Minimal, dependency-free i18n for the plugin.
 *
 * Language resolution (`qc.language` in the Tabby config):
 *   - 'auto' (default): follow Tabby's own UI language (Settings → Appearance →
 *     Language); if that is "Automatic" too, fall back to the OS/browser language
 *     list (navigator.languages), exactly like Tabby itself does.
 *   - any supported code ('en', 'zh-CN', 'hu'): force that language for this plugin
 *     regardless of Tabby's / the system's language.
 *
 * Unsupported languages fall back to English.
 */

export type Locale = 'en' | 'zh-CN' | 'hu'

export const DEFAULT_LOCALE: Locale = 'en'

export const SUPPORTED_LANGUAGES: { code: Locale, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'hu', name: 'Magyar' },
]

type Dictionary = Record<string, string>

const en: Dictionary = {
    // settings tab
    'settings.title': 'Quick Commands',
    'settings.enable': 'Enable quick commands',
    'settings.enableTitle': 'Enable or disable the Quick Commands terminal bar',
    'settings.enableHint': 'Once enabled, add, edit and delete groups and commands in the quick command bar at the bottom of the terminal window.',
    'settings.language': 'Language',
    'settings.languageHint': 'Language of the Quick Commands plugin. "Automatic" follows Tabby\'s language setting (and the system language when that is automatic too).',
    'settings.languageAuto': 'Automatic',

    // terminal bar
    'bar.switchGroup': 'Switch command group',
    'bar.manageGroups': 'Manage groups',
    'bar.empty': 'No groups yet - click the gear on the right to add one',
    'bar.addCommand': 'Command',
    'bar.addCommandTooltip': 'Add a command to the current group',
    'group.ungrouped': 'Ungrouped',

    // menus
    'menu.editCommand': 'Edit command',
    'menu.deleteCommand': 'Delete command',
    'menu.addGroup': 'Add group',
    'menu.editGroup': 'Edit current group',
    'menu.deleteGroup': 'Delete current group',

    // confirmations
    'confirm.deleteCommand': 'Delete command "{name}"?',
    'confirm.deleteGroup': 'Delete group "{name}"? Its commands will become ungrouped.',
    'confirm.run': 'Run "{name}"?',

    // command modal
    'command.editTitle': 'Edit command',
    'command.newTitle': 'New command',
    'command.name': 'Name',
    'command.namePlaceholder': 'Give the command a name',
    'command.text': 'Command',
    'command.textPlaceholder': 'Command to send to the terminal',
    'command.group': 'Group',
    'command.groupPlaceholder': 'Select or type a group name',
    'command.note': 'Note',
    'command.notePlaceholder': 'Optional, shown when hovering the button',
    'command.color': 'Color',
    'command.confirm': 'Confirm before running',
    'command.confirmHint': 'Ask for confirmation before running this command, to prevent accidental clicks',
    'command.appendCR': 'Auto Enter',
    'command.appendCRHint': 'Append a newline after sending, so the command runs immediately',

    // group modal
    'group.editTitle': 'Edit group',
    'group.newTitle': 'New group',
    'group.name': 'Group name',
    'group.namePlaceholder': 'Enter group name',

    // buttons
    'button.cancel': 'Cancel',
    'button.save': 'Save',

    // colors
    'color.none': 'None',
    'color.red': 'Red',
    'color.orange': 'Orange',
    'color.yellow': 'Yellow',
    'color.green': 'Green',
    'color.blue': 'Blue',
    'color.purple': 'Purple',
    'color.gray': 'Gray',
}

const zhCN: Dictionary = {
    'settings.title': '快速命令',
    'settings.enable': '启用快速命令',
    'settings.enableTitle': '启用或禁用终端底部的快捷命令栏',
    'settings.enableHint': '启用后，请在终端窗口底部的快捷命令栏进行分组与命令的添加、编辑和删除。',
    'settings.language': '语言',
    'settings.languageHint': '快速命令插件的界面语言。“自动”跟随 Tabby 的语言设置（若 Tabby 也为自动，则跟随系统语言）。',
    'settings.languageAuto': '自动',

    'bar.switchGroup': '切换命令分组',
    'bar.manageGroups': '管理分组',
    'bar.empty': '还没有分组，点击右侧齿轮添加分组',
    'bar.addCommand': '命令',
    'bar.addCommandTooltip': '向当前分组添加命令',
    'group.ungrouped': '未分组',

    'menu.editCommand': '编辑命令',
    'menu.deleteCommand': '删除命令',
    'menu.addGroup': '添加分组',
    'menu.editGroup': '编辑当前分组',
    'menu.deleteGroup': '删除当前分组',

    'confirm.deleteCommand': '删除命令 "{name}"？',
    'confirm.deleteGroup': '删除分组 "{name}"？组内命令将变为未分组。',
    'confirm.run': '执行 "{name}"？',

    'command.editTitle': '编辑命令',
    'command.newTitle': '新建命令',
    'command.name': '名称',
    'command.namePlaceholder': '给命令起个名字',
    'command.text': '命令内容',
    'command.textPlaceholder': '要发送到终端的命令',
    'command.group': '分组',
    'command.groupPlaceholder': '选择或输入分组名',
    'command.note': '备注',
    'command.notePlaceholder': '可选，悬停按钮时显示',
    'command.color': '颜色',
    'command.confirm': '执行前二次确认',
    'command.confirmHint': '开启后点击此命令会先弹出确认框，防止误触',
    'command.appendCR': '自动回车',
    'command.appendCRHint': '发送后自动追加换行符执行',

    'group.editTitle': '编辑分组',
    'group.newTitle': '新建分组',
    'group.name': '分组名称',
    'group.namePlaceholder': '输入分组名',

    'button.cancel': '取消',
    'button.save': '保存',

    'color.none': '无',
    'color.red': '红',
    'color.orange': '橙',
    'color.yellow': '黄',
    'color.green': '绿',
    'color.blue': '蓝',
    'color.purple': '紫',
    'color.gray': '灰',
}

const hu: Dictionary = {
    'settings.title': 'Gyorsparancsok',
    'settings.enable': 'Gyorsparancsok engedélyezése',
    'settings.enableTitle': 'A terminál alján lévő gyorsparancs-sáv be- és kikapcsolása',
    'settings.enableHint': 'Engedélyezés után a csoportokat és parancsokat a terminálablak alján lévő gyorsparancs-sávban hozhatod létre, szerkesztheted és törölheted.',
    'settings.language': 'Nyelv',
    'settings.languageHint': 'A Gyorsparancsok bővítmény nyelve. Az „Automatikus” a Tabby nyelvi beállítását követi (ha az is automatikus, akkor a rendszer nyelvét).',
    'settings.languageAuto': 'Automatikus',

    'bar.switchGroup': 'Parancscsoport váltása',
    'bar.manageGroups': 'Csoportok kezelése',
    'bar.empty': 'Még nincs csoport - a jobb oldali fogaskerékkel adhatsz hozzá',
    'bar.addCommand': 'Parancs',
    'bar.addCommandTooltip': 'Parancs hozzáadása az aktuális csoporthoz',
    'group.ungrouped': 'Csoport nélkül',

    'menu.editCommand': 'Parancs szerkesztése',
    'menu.deleteCommand': 'Parancs törlése',
    'menu.addGroup': 'Csoport hozzáadása',
    'menu.editGroup': 'Aktuális csoport szerkesztése',
    'menu.deleteGroup': 'Aktuális csoport törlése',

    'confirm.deleteCommand': 'Törlöd a(z) „{name}” parancsot?',
    'confirm.deleteGroup': 'Törlöd a(z) „{name}” csoportot? A benne lévő parancsok csoport nélküliek lesznek.',
    'confirm.run': 'Futtatod: „{name}”?',

    'command.editTitle': 'Parancs szerkesztése',
    'command.newTitle': 'Új parancs',
    'command.name': 'Név',
    'command.namePlaceholder': 'Adj nevet a parancsnak',
    'command.text': 'Parancs',
    'command.textPlaceholder': 'A terminálnak küldendő parancs',
    'command.group': 'Csoport',
    'command.groupPlaceholder': 'Válassz vagy írj be egy csoportnevet',
    'command.note': 'Megjegyzés',
    'command.notePlaceholder': 'Nem kötelező, a gomb fölé húzva jelenik meg',
    'command.color': 'Szín',
    'command.confirm': 'Megerősítés futtatás előtt',
    'command.confirmHint': 'Futtatás előtt megerősítést kér, így elkerülhető a véletlen kattintás',
    'command.appendCR': 'Automatikus Enter',
    'command.appendCRHint': 'Küldés után sortörést fűz hozzá, így a parancs azonnal lefut',

    'group.editTitle': 'Csoport szerkesztése',
    'group.newTitle': 'Új csoport',
    'group.name': 'Csoport neve',
    'group.namePlaceholder': 'Add meg a csoport nevét',

    'button.cancel': 'Mégse',
    'button.save': 'Mentés',

    'color.none': 'Nincs',
    'color.red': 'Piros',
    'color.orange': 'Narancs',
    'color.yellow': 'Sárga',
    'color.green': 'Zöld',
    'color.blue': 'Kék',
    'color.purple': 'Lila',
    'color.gray': 'Szürke',
}

const DICTIONARIES: Record<Locale, Dictionary> = {
    en,
    'zh-CN': zhCN,
    hu,
}

/** Map an arbitrary BCP-47-ish code (e.g. 'zh-TW', 'hu-HU', 'en_GB') to a supported locale. */
export function matchLocale (code: string | null | undefined): Locale | null {
    if (!code) {
        return null
    }
    const normalized = code.replace('_', '-').toLowerCase()
    const exact = SUPPORTED_LANGUAGES.find(l => l.code.toLowerCase() === normalized)
    if (exact) {
        return exact.code
    }
    const base = normalized.split('-')[0]
    const byBase = SUPPORTED_LANGUAGES.find(l => l.code.toLowerCase().split('-')[0] === base)
    return byBase?.code ?? null
}

@Injectable()
export class I18nService {
    constructor (private config: ConfigService) { }

    /** The effective locale, re-evaluated on every call so config changes apply immediately. */
    get locale (): Locale {
        const override = this.config.store?.qc?.language
        if (override && override !== 'auto') {
            const forced = matchLocale(override)
            if (forced) {
                return forced
            }
        }
        // Follow Tabby's configured UI language (null/empty = "Automatic").
        // An explicit Tabby language the plugin doesn't support means English,
        // not the system language — the user deliberately chose a Tabby language.
        const tabbySetting = this.config.store?.language
        if (tabbySetting) {
            return matchLocale(tabbySetting) ?? DEFAULT_LOCALE
        }
        // Tabby is on "Automatic": use the system/browser language list
        const systemLangs: readonly string[] = typeof navigator !== 'undefined'
            ? (navigator.languages?.length ? navigator.languages : [navigator.language])
            : []
        for (const lang of systemLangs) {
            const matched = matchLocale(lang)
            if (matched) {
                return matched
            }
        }
        return DEFAULT_LOCALE
    }

    /** Translate `key`, substituting `{param}` placeholders. Falls back to English, then to the key. */
    t (key: string, params?: Record<string, string>): string {
        const dict = DICTIONARIES[this.locale] ?? en
        let text = dict[key] ?? en[key] ?? key
        if (params) {
            for (const [name, value] of Object.entries(params)) {
                text = text.split(`{${name}}`).join(value)
            }
        }
        return text
    }
}
