import { useEffect, useState } from "react";
import { fetchBiomData, parseData } from "../lib/parser";
import { IFormattedBiomData } from "../lib/types";
import BiomTable from "./components/Table";

const HomePage = () => {
    const [data, setData] = useState<IFormattedBiomData[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchBiomData();
            const parsedData = parseData(data);
            setData(parsedData);
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-3 py-2 border-1 border-slate-300">
            <BiomTable data={data} />
        </div>
    );
};

export default HomePage;
