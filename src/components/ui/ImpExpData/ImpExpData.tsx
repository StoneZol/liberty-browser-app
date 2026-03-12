import { AlertDialogComponent } from "../alert-dialog";
import { Button } from "../button";
import { useImpExpDataHook } from "./ImpExpData.hooks";

const ImportData = () => {
    const { handleImportData } = useImpExpDataHook()
    return (
        <AlertDialogComponent
            title="Import Data"
            description="If u import data, it'll override the current data."
            actionText="Import"
            cancelText="Cancel"
            onContinue={handleImportData}
        >
            <Button variant="outline" size="sm">
                Import Data
            </Button>
        </AlertDialogComponent>
    );
};

const ExportData = () => {
    const { handleExportData } = useImpExpDataHook()
    return (
        <Button variant="outline" size="sm" onClick={handleExportData}>
            Export Data
        </Button>
    );
};

export { ImportData, ExportData };