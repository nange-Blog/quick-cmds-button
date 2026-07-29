import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'

@Component({
    template: require('./quickCmdsSettingsTab.component.pug'),
    styles: [require('./quickCmdsSettingsTab.component.scss')],
})
export class QuickCmdsSettingsTabComponent {
    constructor (
        public config: ConfigService,
    ) {
        this.config.store.qc.groups = this.config.store.qc.groups ?? []
    }

    toggleEnabled (event: Event) {
        this.config.store.qc.enabled = (event.target as HTMLInputElement).checked
        this.config.save()
    }
}
