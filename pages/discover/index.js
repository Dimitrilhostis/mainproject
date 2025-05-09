import Layout from "../components/layout"
import SideBar from "../components/sidebar";
import { FaHome } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { LuCrown } from "react-icons/lu";
import { IoSettingsSharp } from "react-icons/io5";




export default function DiscoveryPage() {
   
    return(
        <Layout>
            <SideBar minWidth={65} maxWidth={250} defaultWidth={65} />
            <div>
                <p>Pour découvrir les programmes prédéfinis</p>
            </div>
        </Layout>
    )
}