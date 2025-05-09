import Layout from "./components/layout";
import SideBar from "./components/sidebar";




export default function HomePage() {
    return(
        <Layout>
            <SideBar minWidth={65} maxWidth={250} defaultWidth={65} />
            <div>
                <p>Il y a un début à tout...</p>
            </div>
        </Layout>
    )
}