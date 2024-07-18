import { IBiomJson, IFormattedBiomData } from "./types";

export const fetchBiomData = async (): Promise<IBiomJson> => {
    const response = await fetch("biom.json");
    const data = await response.json();
    return data;
};

export function* parseBiomDataInChunks(
    biomData: IBiomJson,
    valuePerChunk: number,
    processor: (biomData: IBiomJson, rowStart?: number) => IFormattedBiomData[]
) {
    const chunkSize = valuePerChunk;
    let chunkStart = 0;
    while (chunkStart < biomData.rows.length) {
        const end = chunkStart + chunkSize;
        const chunk = biomData.rows.slice(chunkStart, end);
        const newData: IBiomJson = {
            ...biomData,
            rows: chunk,
        };
        const data = processor(newData, chunkStart);
        yield data;
        chunkStart += chunkSize;
    }
}

//if data formate is in sorted order based on the row then this parser will work slightly much faster
export const parserVersionOne = (
    biomData: IBiomJson,
    rowStart?: number
): IFormattedBiomData[] => {
    type IValueFormate = {
        [key: string]: string;
    };
    const valueFormate = biomData.columns.reduce<IValueFormate>(
        (accm, current, index) => {
            accm[index] = current.id;
            return accm;
        },
        {}
    );
    const dataLength = biomData.shape[1];
    const data: IFormattedBiomData[] = biomData.rows.map((row, index) => {
        const lineageLevel = 7;
        const name = row.metadata.lineage[lineageLevel].name;
        const taxId = row.metadata.lineage[lineageLevel].tax_id;
        let startIndex = index * dataLength;
        if (rowStart) {
            startIndex = (rowStart + index) * dataLength;
        }
        const endIndex = startIndex + dataLength;
        type FormattedValue = {
            [key: string]: number;
        };
        const formattedValue: FormattedValue = {};
        for (let i = startIndex; i < endIndex; i++) {
            const rowData = biomData.data[i];
            formattedValue[valueFormate[rowData[1]]] = rowData[2];
        }

        return {
            key: row.id,
            name,
            taxId,
            value: formattedValue,
        };
    });
    return data;
};

export const parserVersionTwo = (
    biomData: IBiomJson,
    rowStart?: number
): IFormattedBiomData[] => {
    type IParsedData = {
        [key: string]: {
            //row key
            [key: string]: number; //column key and value
        };
    };
    //create a separate array for
    const mappedDataViaKeyValue = biomData.data.reduce<IParsedData>(
        (accm, current) => {
            const rowKey = current[0];
            const columnKey = current[1];
            const columnValue = current[2];
            if (!accm[rowKey]) {
                accm[rowKey] = {};
            }
            accm[rowKey][columnKey] = columnValue;
            return accm;
        },
        {}
    );

    type IValueFormate = {
        [key: string]: {
            key: string;
            index: number;
            value: number | null;
        };
    };
    const valueFormate = biomData.columns.reduce<IValueFormate>(
        (accm, current, index) => {
            accm[index] = {
                key: current.id,
                index: index,
                value: null,
            };
            return accm;
        },
        {}
    );

    const data: IFormattedBiomData[] = biomData.rows.map((row, index) => {
        const lineageLevel = 7;
        const name = row.metadata.lineage[lineageLevel].name;
        const taxId = row.metadata.lineage[lineageLevel].tax_id;

        let mappedIndex = index;

        if (rowStart) {
            mappedIndex = rowStart + index;
        }
        const rowValues = mappedDataViaKeyValue[mappedIndex];
        type FormattedValue = {
            [key: string]: number;
        };
        const formattedValue: FormattedValue = {};
        Object.keys(valueFormate).forEach((key) => {
            formattedValue[valueFormate[key].key] = rowValues[key];
        });
        return {
            key: row.id,
            name,
            taxId,
            value: formattedValue,
        };
    });
    return data;
};
