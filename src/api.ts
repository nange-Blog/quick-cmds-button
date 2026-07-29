export interface QuickCmds {
    name: string
    text: string
    appendCR: boolean
    group?: string
    shortcut?: string
    note?: string
    color?: string
    confirmBeforeRun?: boolean
}

export interface ICmdGroup {
    name: string
    cmds: QuickCmds[]
    defaultVisible?: boolean
}
