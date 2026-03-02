import { useLibertyCoreStore } from "@/hooks/useLibertyCore";
import { CreateContact } from "../CreateContact";


const MainScreen = () => {
    const { getStoreData } = useLibertyCoreStore()
    console.log('inside main screen', getStoreData())
    return (
        <>
            <h1>Main Screen</h1>

            <CreateContact />
        </>
    );
};

export default MainScreen;