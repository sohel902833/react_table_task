interface ILineageRank {
    rank: string;
    name: string;
    tax_id: number;
}

interface IMetadata {
    taxonomy: string[];
    tax_id: number;
    title: string;
    lineage: ILineageRank[];
    id: string;
    assembly?: string;
}

interface IMetadataLineage {
    rank: string;
    name: string;
    tax_id: number;
}

interface IRowMetaDataMetadata {
    taxonomy: string[];
    tax_id: number;
    title: string;
    lineage: IMetadataLineage[];
    id: string;
}

interface IRow {
    id: string;
    metadata: IRowMetaDataMetadata;
}

interface IColumn {
    id: string;
    metadata: IMetadata;
}

export interface IBiomJson {
    id: string;
    format: string;
    format_url: string;
    matrix_type: string;
    generated_by: string;
    date: string;
    type: string;
    matrix_element_type: string;
    shape: number[];
    data: number[][];
    rows: IRow[];
    columns: IColumn[];
    metadata: {
        analysis_id: string;
        name: string;
        database: string;
        created: string;
        database_feature: string;
        biom_version: number;
        filterset_name: string;
        filterset_id: string;
    };
}

interface FormattedValue {
    [key: string]: number;
    // relative_abundance: number;
    // abundance_score: number;
    // hit_frequency: number;
}

export interface IFormattedBiomData {
    key: number | string;
    name: string;
    taxId: number;
    value: FormattedValue;
}
