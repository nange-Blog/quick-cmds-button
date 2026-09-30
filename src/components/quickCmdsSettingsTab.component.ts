import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { I18nService, SUPPORTED_LANGUAGES } from '../i18n'

@Component({
    template: require('./quickCmdsSettingsTab.component.pug'),
    styles: [require('./quickCmdsSettingsTab.component.scss')],
})
export class QuickCmdsSettingsTabComponent {
    readonly languages = SUPPORTED_LANGUAGES

    constructor (
        public config: ConfigService,
        private i18n: I18nService,
    ) {
        this.config.store.qc.groups = this.config.store.qc.groups ?? []
    }

    t (key: string, params?: Record<string, string>): string {
        return this.i18n.t(key, params)
    }

    toggleEnabled (event: Event) {
        this.config.store.qc.enabled = (event.target as HTMLInputElement).checked
        this.config.save()
    }

    setLanguage (code: string) {
        this.config.store.qc.language = code || 'auto'
        this.config.save()
    }
}
