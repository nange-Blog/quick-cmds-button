import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { HotkeysService } from 'tabby-core'
import { ICmdGroup } from '../api'
import { I18nService } from '../i18n'

@Component({
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{ group.name ? t('group.editTitle') : t('group.newTitle') }}</h4>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>{{ t('group.name') }}</label>
                <input class="form-control" type="text" autofocus [placeholder]="t('group.namePlaceholder')" [(ngModel)]="group.name">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline-secondary" (click)="cancel()">{{ t('button.cancel') }}</button>
            <button class="btn btn-primary" (click)="save()">{{ t('button.save') }}</button>
        </div>
    `,
    styles: [`
        .modal-header {
            padding: 16px 20px 0;
            border: 0;
        }
        .modal-title {
            font-size: 17px;
            font-weight: 650;
        }
        .modal-body {
            padding: 16px 20px;
        }
        .modal-body label {
            font-size: 12.5px;
            font-weight: 600;
            margin-bottom: 5px;
            opacity: 0.85;
        }
        .modal-footer {
            padding: 12px 20px 16px;
            border: 0;
        }
        .modal-footer .btn {
            border-radius: 8px;
            padding: 6px 18px;
            font-weight: 500;
        }
    `],
})
export class EditGroupModalComponent implements OnInit, OnDestroy {
    @Input() group: ICmdGroup

    constructor (
        private modalInstance: NgbActiveModal,
        private hotkeys: HotkeysService,
        private i18n: I18nService,
    ) {
    }

    t (key: string, params?: Record<string, string>): string {
        return this.i18n.t(key, params)
    }

    // While the modal is open, Tabby's global hotkeys (e.g. Cmd/Ctrl-V → terminal
    // paste) must not fire, otherwise pasting into the input also pastes into
    // the terminal behind the modal.
    ngOnInit () {
        this.hotkeys.disable()
    }

    ngOnDestroy () {
        this.hotkeys.enable()
    }

    save () {
        this.modalInstance.close(this.group)
    }

    cancel () {
        this.modalInstance.dismiss()
    }
}
