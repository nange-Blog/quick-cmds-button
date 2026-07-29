import { ConfigProvider } from 'tabby-core'

export class QuickCmdsConfigProvider extends ConfigProvider {
    defaults = {
        qc: {
            enabled: true,
            cmds: [],
            groups: [],
            activeGroup: null,
        },
        hotkeys: {
            'qc': [
                'Alt-Q',
            ],
        },
    }

    platformDefaults = { }
}
