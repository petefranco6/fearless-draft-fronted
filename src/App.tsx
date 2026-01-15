import {Routes, Route} from "react-router-dom";
import DraftPage from "./components/DraftPage.tsx";
import CreateDraftPage from "./components/CreateDraftPage.tsx";
import {Toaster} from "sonner";

export default function App() {
    return (
        <>
            {/* ✅ Global toaster (persists across navigation) */}
            <Toaster position="bottom-right" richColors/>

            <Routes>
                <Route path="/" element={<CreateDraftPage/>}/>
                <Route path="/draft/:draftId" element={<DraftPage/>}/>
            </Routes>
        </>
    );
}
