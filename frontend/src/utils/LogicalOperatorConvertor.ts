import PaginationLogicalOperator from "@/types/enums/PaginationLogicalOperator";
import { GridLogicOperator } from "@mui/x-data-grid";

export default class LogicalOperatorConvertor {
    static toGrid(operator: PaginationLogicalOperator): GridLogicOperator {
        return operator === PaginationLogicalOperator.AND
            ? GridLogicOperator.And : GridLogicOperator.Or;
    }

    static fromGrid(operator: GridLogicOperator): PaginationLogicalOperator {
        return operator === GridLogicOperator.And
            ? PaginationLogicalOperator.AND : PaginationLogicalOperator.OR;
    }
}