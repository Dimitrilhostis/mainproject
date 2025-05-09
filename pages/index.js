import Layout from "./components/layout";
import SideBar from "./components/sidebar";
import { FaHome } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { LuCrown } from "react-icons/lu";
import { IoSettingsSharp } from "react-icons/io5";




export default function HomePage() {
    const itemsTop = [
          { label: 'Accueil', href: '/', icon: <FaHome /> },
          { label: 'Discover', href: '/discover', icon: <IoIosSearch /> },
          { label: 'Mes programmes', href: '/programs', icon: <LuCrown /> },

        ];
    
    const itemsBottom = [
        { label: 'Paramètres', href: '/parameters', icon: <IoSettingsSharp /> },

        ];

    return(
        <Layout>
            <SideBar itemsTop={itemsTop} itemsBottom={itemsBottom} minWidth={65} maxWidth={250} defaultWidth={65} />
            <div>
                <p>Il y a un début à tout...</p>
            </div>
        </Layout>
    )
}