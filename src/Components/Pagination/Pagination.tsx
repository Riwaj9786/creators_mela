import React from "react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  handleNext: () => void;
  handlePrevious: () => void;
  gotoButton?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
  handleNext,
  handlePrevious,
}) => {
  const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number(event.target.value);
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 text-white">
      <div className="flex gap-[10px]">
        <button
          className={`px-4 py-2 rounded-lg bg-[#454363] hover:bg-[#565676] text-sm font-medium ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 rounded-lg bg-[#454363] hover:bg-[#565676] text-sm font-medium ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <div className="flex gap-[50px]">
        <div className="flex items-center gap-2 text-sm">
          <span>Goto Page</span>
          <input
            type="number"
            value={currentPage}
            onChange={handlePageChange}
            className="w-12 px-2 py-1 text-center rounded-lg bg-[#303050] border border-[#FFFFFF1A]"
          />
        </div>
        {/* 
        {gotoButton && (
          <button
            className="px-4 py-2 ml-4 rounded-lg bg-[#65E8BF] hover:bg-[#52D9A9] text-sm font-medium"
            onClick={() => setCurrentPage(totalPages)}
          >
            Go to Last
          </button>
        )} */}
        <div className="flex items-center gap-2 text-sm font-[700]">
          <span>Page</span>
          {currentPage}
          <span>of</span>
          {totalPages}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
