import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { initI18n, t } from '../i18n'

@Component({
    template: require('./quickCmdsSettingsTab.component.pug'),
    styles: [require('./quickCmdsSettingsTab.component.scss')],
})
export class QuickCmdsSettingsTabComponent {
    t = t

    constructor (
        public config: ConfigService,
    ) {
        initI18n(this.config)
        this.config.store.qc.groups = this.config.store.qc.groups ?? []
    }

    toggleEnabled (event: Event) {
        this.config.store.qc.enabled = (event.target as HTMLInputElement).checked
        this.config.save()
    }
}
