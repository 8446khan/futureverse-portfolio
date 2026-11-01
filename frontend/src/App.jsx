
import { Route, Routes } from "react-router-dom";
import PublicSite from "./PublicSite";
import Admin from "./Admin";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicSite />} />
            <Route path="/admin/*" element={<Admin />} />
        </Routes>
    );
}
