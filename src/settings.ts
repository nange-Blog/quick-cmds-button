import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'

import { QuickCmdsSettingsTabComponent } from './components/quickCmdsSettingsTab.component'
import { I18nService } from './i18n'

@Injectable()
export class QuickCmdsSettingsTabProvider extends SettingsTabProvider {
    id = 'qc'

    constructor (i18n: I18nService) {
        super()
        // The base class declares `title` as a plain property, so a TS accessor
        // override is not allowed — define a live getter on the instance instead,
        // so the settings tab title follows language changes without a restart.
        Object.defineProperty(this, 'title', {
            get: () => i18n.t('settings.title'),
            configurable: true,
            enumerable: true,
        })
    }

    getComponentType (): any {
        return QuickCmdsSettingsTabComponent
    }
}
