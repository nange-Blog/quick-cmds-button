import { Component, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ICmdGroup } from '../api'

@Component({
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{ group.name ? '编辑分组' : '新建分组' }}</h4>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>分组名称</label>
                <input class="form-control" type="text" autofocus placeholder="输入分组名" [(ngModel)]="group.name">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline-secondary" (click)="cancel()">取消</button>
            <button class="btn btn-primary" (click)="save()">保存</button>
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
export class EditGroupModalComponent {
    @Input() group: ICmdGroup

    constructor (
        private modalInstance: NgbActiveModal,
    ) {
    }

    save () {
        this.modalInstance.close(this.group)
    }

    cancel () {
        this.modalInstance.dismiss()
    }
}
