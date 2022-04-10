import loading from "../assets/loading.png";
import Layout from "./Layout";

export default function Loader() {
  return (
    <Layout>
      <div className="w-full h-full flex justify-center items-center ">
        <img src={loading} alt="loading" className="w-24" />
      </div>
    </Layout>
  );
}
