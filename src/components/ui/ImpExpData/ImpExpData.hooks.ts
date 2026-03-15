import { clipBoard } from '@/lib/ClipBoard';
import { ls } from '@/lib/localstorage';
import { normalizeStr } from '@/lib/normalizeStr';
import { toast } from 'sonner';

const useImpExpDataHook = () => {
    const handleImportData = async () => {
        const pasteData = await clipBoard.paste(false)
        if (!pasteData) return
        const normalizedPasteData = normalizeStr(pasteData)
        const [salt, resetPassHash, LibertyStore] = normalizedPasteData.split(';')
        if (!salt || !resetPassHash || !LibertyStore) {
            toast.error('Valid data not found(');
            return
        }
        ls.setData('salt', salt)
        ls.setData('resetPassHash', resetPassHash)
        ls.setData('LibertyStore', LibertyStore)
        toast.success('Imported successfully!');
        return
    }
    const handleExportData = () => {
        const salt = ls.getData('salt')
        const resetPassHash = ls.getData('resetPassHash')
        const LibertyStore = ls.getData('LibertyStore')
        const result = salt + ";" + resetPassHash + ";" + LibertyStore
        if (!salt || !resetPassHash || !LibertyStore) {
            toast.error('Valid data not found(');
            return
        }
        clipBoard.copy(result, false)
        toast.success('Exported successfully and copied to clipboard!');
        return
    }
    return {
        handleExportData,
        handleImportData
    }
}

export { useImpExpDataHook };