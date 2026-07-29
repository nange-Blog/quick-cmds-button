import { Component } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { QuickCmds } from '../api'

@Component({
    template: require('./editCommandModal.component.pug'),
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
        .modal-body .form-group {
            margin-bottom: 16px;
        }
        .modal-body label {
            font-size: 12.5px;
            font-weight: 600;
            margin-bottom: 5px;
            opacity: 0.85;
        }
        .qc-cmd-text {
            font-family: "Cascadia Code", "JetBrains Mono", Consolas, monospace;
            font-size: 12.5px;
            line-height: 1.5;
            resize: vertical;
        }
        .form-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 10px 0;
            border-top: 1px solid color-mix(in srgb, var(--bs-body-color) 10%, transparent);
        }
        .form-line .title {
            font-size: 13px;
            font-weight: 600;
        }
        .form-line .description {
            font-size: 11px;
            opacity: 0.65;
            margin-top: 2px;
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
        .qc-color-swatches {
            display: flex;
            align-items: center;
            gap: 9px;
            flex-wrap: wrap;
        }
        .qc-swatch {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid transparent;
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--bs-body-color) 20%, transparent) inset;
            transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .qc-swatch:hover {
            transform: scale(1.15);
        }
        .qc-swatch.selected {
            box-shadow: 0 0 0 2px var(--bs-body-bg), 0 0 0 4px currentColor;
        }
        .qc-swatch.none {
            position: relative;
            background: transparent !important;
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--bs-body-color) 32%, transparent) inset;
        }
        .qc-swatch.none::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 2px;
            right: 2px;
            height: 2px;
            background: var(--bs-danger, #e5534b);
            transform: rotate(-45deg);
        }
        .qc-swatch.none.selected {
            box-shadow: 0 0 0 2px var(--bs-body-bg), 0 0 0 4px var(--bs-primary, #3b82f6);
        }
    `],
})
export class EditCommandModalComponent {
    allGroups: string[] = []
    command: QuickCmds = undefined!
    private _groupSavedValue: string = ''

    readonly colors = [
        { name: '无', value: '' },
        { name: '红', value: '#e5534b' },
        { name: '橙', value: '#e0823d' },
        { name: '黄', value: '#d9a441' },
        { name: '绿', value: '#4caf7d' },
        { name: '蓝', value: '#3b82f6' },
        { name: '紫', value: '#8b5cf6' },
        { name: '灰', value: '#6b7280' },
    ]

    constructor (
        private modalInstance: NgbActiveModal,
    ) {
    }

    selectColor (value: string) {
        this.command.color = value
    }

    isColorSelected (value: string): boolean {
        return (this.command.color || '') === value
    }

    onGroupFocus () {
        this._groupSavedValue = this.command.group || ''
        this.command.group = ''
    }

    onGroupBlur () {
        if (!this.command.group) {
            this.command.group = this._groupSavedValue
        }
    }

    save () {
        this.modalInstance.close(this.command)
    }

    cancel () {
        this.modalInstance.dismiss()
    }
}
