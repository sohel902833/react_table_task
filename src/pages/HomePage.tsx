import { useEffect, useRef, useState } from "react";
import {
    fetchBiomData,
    parseBiomDataInChunks,
    parserVersionTwo,
} from "../lib/parser";
import { IFormattedBiomData } from "../lib/types";
import BiomTable, { PER_PAGE } from "./components/Table";

const HomePage = () => {
    const [data, setData] = useState<IFormattedBiomData[]>([]);
    const [totalData, setTotalData] = useState<number>(0);
    const dataGenerator = useRef<Generator<
        IFormattedBiomData[],
        void,
        unknown
    > | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchBiomData();

            const dataIterators = parseBiomDataInChunks(
                data,
                PER_PAGE,
                parserVersionTwo
            );
            dataGenerator.current = dataIterators;
            const parsedData = dataGenerator.current.next();
            setData(parsedData.value as IFormattedBiomData[]);
            setTotalData(data.rows.length);
        };
        fetchData();
    }, []);

    const handleNextGeneration = () => {
        if (dataGenerator.current) {
            const parsedData = dataGenerator.current.next();
            if (!parsedData.done) {
                setData((prevData) => [
                    ...prevData,
                    ...(parsedData.value as IFormattedBiomData[]),
                ]);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-3 py-2 border-1 border-slate-300">
            <BiomTable
                data={data}
                nextGenerator={handleNextGeneration}
                totalData={totalData}
            />
        </div>
    );
};

export default HomePage;
