enum PaginationFilterOperator {
    EQ = "eq",
    NE = "ne",
    LT = "lt",
    GT = "gt",
    LE = "le",
    GE = "ge",
    LIKE = "like",
    CONTAINS = "contains",
    DOES_NOT_CONTAIN = "doesNotContain",
    EQUALS = "equals",
    DOES_NOT_EQUAL = "doesNotEqual",
    STARTS_WITH = "startsWith",
    ENDS_WITH = "endsWith",
    IS_EMPTY = "isEmpty",
    IS_NOT_EMPTY = "isNotEmpty",
    IS_ANY_OF = "isAnyOf"
}

export default PaginationFilterOperator;