import { ArrowLeft } from "lucide-react"
import { CreateContact } from "../CreateContact"
import { Button } from "../button"
import useScreenStore from "@/stores/screenStore"

const CreateContactScreen = () => {
    const { setScreen } = useScreenStore()
    return (
        <section>
            <h2 className="text-2xl font-bold md:pt-4 md:pl-4 pt-2 pl-2 flex gap-2">
                <Button size='icon' variant='ghost' aria-label='go main screen' onClick={() => setScreen('main')
                }><ArrowLeft />
                </Button>
                CreateContact
            </h2>
            <CreateContact />
        </section>
    )
}

export default CreateContactScreen