import React from "react";
import { Button } from "../ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
interface Props {
    next: () => void;
    prev: () => void;
    totalPage: number;
    currentPage: number;
}

const PaginationController: React.FC<Props> = ({
    next,
    prev,
    currentPage,
    totalPage,
}) => {
    return (
        <div className="flex items-center gap-4">
            <Button variant={"ghost"} onClick={prev} size={"icon"}>
                <ChevronLeft />
            </Button>
            <div className="text-md font-bold">
                {currentPage} / {totalPage}
            </div>
            <Button variant={"ghost"} onClick={next} size={"icon"}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default PaginationController;
