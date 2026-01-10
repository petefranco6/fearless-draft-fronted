import { Routes, Route} from "react-router-dom";
import DraftPage from "./components/DraftPage.tsx";
import CreateDraftPage from "./components/CreateDraftPage.tsx";

export default function App() {
    return (
        <Routes>
            <Route path={"/"} element={<CreateDraftPage />} />
            <Route path="/draft/:draftId" element={<DraftPage />} />
        </Routes>
    );
}
