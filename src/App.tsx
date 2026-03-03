

import './App.css'
import { Header } from './components/ui/Header'
import ScreenController from './components/ui/ScreenController/ScreenController'
import { Toaster } from './components/ui/sonner'

function App() {

    return (
        <>
            <Header />
            <ScreenController />
            <Toaster position="top-right" duration={1000} />
        </>
    )
}

export default App
