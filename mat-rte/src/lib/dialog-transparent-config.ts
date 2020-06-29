import { MatDialogConfig } from "@angular/material/dialog";

const dialogTransparentConfig: MatDialogConfig = {
    backdropClass: "dialog-backdrop-transparent",
    hasBackdrop: true,
    panelClass: "dialog-container-transparent",
    autoFocus: false,
    disableClose: false,
    restoreFocus: false
}

export { dialogTransparentConfig }