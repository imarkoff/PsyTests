import ToolbarRoot from "./components/ToolbarRoot";
import ToolbarTitle from "./components/ToolbarTitle";
import ToolbarColumns from "./components/ToolbarColumns";
import ToolbarFilters from "./components/ToolbarFilters";
import ToolbarExport from "./components/ToolbarExport";
import ToolbarDivider from "./components/ToolbarDivider";
import ToolbarSearch from "./components/ToolbarSearch";
import ToolbarOptions from "./components/ToolbarOptions";

/**
 * Custom DataGrid toolbar with additional components.
 * Includes title, column selector, filter button, export button, and search field.
 *
 * @example
 * ```tsx
 * import { DataGrid } from '@mui/x-data-grid';
 *
 * <DataGrid
 *    showToolbar
 *    slots={{ toolbar: CustomToolbar }}
 *  />
 *
 *  const CustomToolbar = () => (
 *      <DataGridToolbar.Root>
 *          <DataGridToolbar.Title>
 *              My Data Grid
 *          </DataGridToolbar.Title>
 *          <DataGridToolbar.Options>
 *              <DataGridToolbar.Filters />
 *              <DataGridToolbar.Divider />
 *              <DataGridToolbar.Search />
 *          </DataGridToolbar.Options>
 *      </DataGridToolbar.Root>
 *  );
 *  ```
 *
 *  @see Original code - https://github.com/mui/mui-x/blob/v8.11.0/docs/data/data-grid/components/toolbar/GridToolbar.tsx
 */
const DataGridToolbar = {
    Root: ToolbarRoot,
    Title: ToolbarTitle,
    Options: ToolbarOptions,
    Columns: ToolbarColumns,
    Filters: ToolbarFilters,
    Export: ToolbarExport,
    Divider: ToolbarDivider,
    Search: ToolbarSearch,
}

export default DataGridToolbar;