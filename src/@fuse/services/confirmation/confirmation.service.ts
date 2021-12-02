import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';

@Injectable()
export class FuseConfirmationService
{
    private _defaultConfig: FuseConfirmationConfig = {
        title      : 'Confirmar accion',
        message    : 'Esta seguro de confirmar esta accion?',
        icon       : {
            show : true,
            name : 'heroicons_outline:exclamation',
            color: 'warn'
        },
        actions    : {
            confirm: {
                show : true,
                label: 'Confirmar',
                color: 'warn'
            },
            cancel : {
                show : true,
                label: 'Cancelar'
            }
        },
        dismissible: false
    };

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(config: FuseConfirmationConfig = {}): MatDialogRef<FuseConfirmationDialogComponent>
    {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        // Open the dialog
        return this._matDialog.open(FuseConfirmationDialogComponent, {
            autoFocus   : false,
            disableClose: !userConfig.dismissible,
            data        : userConfig,
            panelClass  : 'fuse-confirmation-dialog-panel'
        });
    }
}
