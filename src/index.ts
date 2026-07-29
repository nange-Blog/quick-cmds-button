import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ToolbarButtonProvider, ConfigProvider } from 'tabby-core'
import TabbyCoreModule from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'
import { TerminalDecorator } from 'tabby-terminal'

import { EditCommandModalComponent } from './components/editCommandModal.component'
import { QuickCmdsSettingsTabComponent } from './components/quickCmdsSettingsTab.component'
import { EditGroupModalComponent } from './components/editGroupModal.component'

import { ButtonProvider } from './buttonProvider'
import { QuickCmdsConfigProvider } from './config'
import { QuickCmdsSettingsTabProvider } from './settings'
import { TerminalButtonDecorator } from './terminalDecorator'

@NgModule({
    imports: [
        NgbModule,
        CommonModule,
        FormsModule,
        TabbyCoreModule,
    ],
    providers: [
        { provide: ToolbarButtonProvider, useClass: ButtonProvider, multi: true },
        { provide: ConfigProvider, useClass: QuickCmdsConfigProvider, multi: true },
        { provide: SettingsTabProvider, useClass: QuickCmdsSettingsTabProvider, multi: true },
        { provide: TerminalDecorator, useClass: TerminalButtonDecorator, multi: true },
    ],
    declarations: [
        EditCommandModalComponent,
        QuickCmdsSettingsTabComponent,
        EditGroupModalComponent,
    ],
    entryComponents: [
        EditCommandModalComponent,
        QuickCmdsSettingsTabComponent,
        EditGroupModalComponent,
    ],
})
export default class QuickCmdsModule { }
