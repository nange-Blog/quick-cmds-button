import { ConfigProvider } from 'tabby-core'

export class QuickCmdsConfigProvider extends ConfigProvider {
    defaults = {
        qc: {
            enabled: true,
            cmds: [],
            groups: [],
            activeGroup: null,
            // 'auto' = follow Tabby's language setting (and the system language when
            // Tabby is on "Automatic"); or a supported locale code ('en', 'zh-CN',
            // 'hu') to use a language different from Tabby's / the system's.
            language: 'auto',
        },
    }

    platformDefaults = { }
}
