import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { IFormattedBiomData } from "../../lib/types";
import usePaginationInfo from "../../hooks/usePagination";
import PaginationController from "../../components/common/PaginationController";

interface Props {
    data: IFormattedBiomData[];
}
const PER_PAGE = 6;
const BiomTable: React.FC<Props> = ({ data }) => {
    const { handleNext, handlePrev, currentPage, totalPage } =
        usePaginationInfo(data.length, PER_PAGE);
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[260px]">Name</TableHead>
                        <TableHead>Tax ID</TableHead>
                        <TableHead>Abundance score</TableHead>
                        <TableHead>Relative abundance</TableHead>
                        <TableHead>Unique matches frequency</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data
                        ?.slice(
                            (currentPage - 1) * PER_PAGE,
                            (currentPage - 1) * PER_PAGE + PER_PAGE
                        )
                        ?.map((dataItem) => {
                            let relativeAbundance: string | number =
                                dataItem.value.relative_abundance * 100;
                            if (relativeAbundance < 0.01) {
                                relativeAbundance = "< 0.01%";
                            } else {
                                relativeAbundance = `${relativeAbundance.toFixed(
                                    2
                                )}%`;
                            }
                            return (
                                <TableRow key={dataItem.key}>
                                    <TableCell className="font-medium">
                                        {dataItem.name}
                                    </TableCell>
                                    <TableCell>{dataItem.taxId}</TableCell>
                                    <TableCell>
                                        {dataItem.value.abundance_score.toFixed(
                                            2
                                        )}
                                    </TableCell>
                                    <TableCell>{relativeAbundance}</TableCell>
                                    <TableCell>
                                        {parseInt(
                                            dataItem.value.hit_frequency.toString()
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end mt-4 mr-4">
                <PaginationController
                    prev={handlePrev}
                    next={handleNext}
                    currentPage={currentPage}
                    totalPage={totalPage}
                />
            </div>
        </>
    );
};

export default BiomTable;
