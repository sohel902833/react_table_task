import { IBiomJson, IFormattedBiomData } from "./types";

export const fetchBiomData = async (): Promise<IBiomJson> => {
    const response = await fetch("biom.json");
    const data = await response.json();
    return data;
};

export const parseData = (biomData: IBiomJson): IFormattedBiomData[] => {
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

        const rowValues = mappedDataViaKeyValue[index];
        type FormattedValue = {
            [key: string]: number;
        };
        const formattedValue: FormattedValue = {};
        Object.keys(valueFormate).forEach((key) => {
            formattedValue[valueFormate[key].key] = rowValues[key];
        });
        return {
            key: index,
            name,
            taxId,
            value: formattedValue,
        };
    });
    return data;
};
