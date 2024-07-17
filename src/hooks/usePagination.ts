import { useState } from "react";
const usePaginationInfo = (dataLength: number, perPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);
    const handleNext = () => {
        const totalRow = dataLength;
        if (currentPage < Math.ceil(totalRow / perPage)) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return {
        handleNext,
        handlePrev,
        currentPage,
        totalPage: Math.ceil(dataLength / perPage),
    };
};

export default usePaginationInfo;
