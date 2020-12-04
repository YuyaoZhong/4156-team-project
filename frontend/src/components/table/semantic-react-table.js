import React from "react";
import { useTable, useSortBy, useFlexLayout, useMountedLayoutEffect, useResizeColumns, usePagination, useExpanded, useRowSelect} from "react-table";
import { Table, Button, Dropdown,  Grid, Label} from "semantic-ui-react";


const ReactSemanticTable = ({columns,  data, selectedRows, onSelectedRowsChange})=>{
    const defaultColumn = React.useMemo(
        () => ({
          minWidth: 45,
          width: 50,
          maxWidth: 400,
        }),
        []
      )

      const hiddenColumns = columns.reduce((res, item)=>{
        if(item.show === false){
          res.push(item.accessor);
        }
        return res;
      }, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        // rows,
        prepareRow,
        // rows, -> we change 'rows' to 'page'
        page,
        // visibleColumns,
        // below new props related to 'usePagination' hook
        canPreviousPage,
        canNextPage,
        pageOptions,
        selectedFlatRows,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // selectedFlatRows,
        state: { selectedRowIds, pageIndex, pageSize }
    } = useTable(
        {
            columns, 
            data,
            defaultColumn,
            initialState: { 
              hiddenColumns: hiddenColumns,
              selectedRowIds: selectedRows, 
              pageIndex: 0, 
              pageSize: 10 }
        },
        useSortBy,
        useFlexLayout,
        useResizeColumns,
        useExpanded,
        usePagination,
        useRowSelect,

        )


        useMountedLayoutEffect(() => {
          // console.log("SELECTED ROWS CHANGED", selectedFlatRows);
          const selectedTimerIds = selectedFlatRows.map(d=>({
            timerId: d.values.id,
            isCreator: d.values.isCreator,
            timerToUserId: d.values.timerToUserId,
          }));
          onSelectedRowsChange && onSelectedRowsChange(selectedTimerIds);
        }, [onSelectedRowsChange, selectedRowIds]);

        const onChangeInSelect = (e, {value}) => {
            setPageSize(Number(value))
            }
        
        // const onChangeInInput = pageSize => {
        //     const page =pageSize? Number(pageSize) - 1 : 0
        //     gotoPage(page)
        // }

    return( 
    <>
    <Table size = 'large' {...getTableProps()}>
        <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
                 <th {...column.getHeaderProps(column.getSortByToggleProps())} >
                    {column.render('Header')}

                    {column.sortable?
                        <span className="sort-icon">
                        {column.isSorted ? (column.isSortedDesc ? <i class="fa fa-sort-desc"/> : <i class="fa fa-sort-asc"/>) : <i class="fa fa-sort" />}
                    </span>
                    :<span></span>

                    }
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                    />
                 </th>
             ))}
           </tr>
         ))}
       </thead>
        <tbody {...getTableBodyProps()}>
            {page.map(row => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps({
                        className: cell.column.className
                      })}
            
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            )
            })}
      </tbody>
    </Table>
       <Grid columns = 'equal'>
               <Grid.Column>
                <Button
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                    >
                        {"<"}
                    </Button>
               </Grid.Column>
               <Grid.Column >
                <Label size = 'large' style = {{"height": "100%"}}> Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong></Label>
               </Grid.Column>

               <Grid.Column>
               <Dropdown
                value={pageSize} 
                onChange={onChangeInSelect}
                options = {[10, 20, 30, 40, 50].map(pageSize=> { return {key: pageSize, text: pageSize, value: pageSize} })}
                selection
               />
               </Grid.Column>
               <Grid.Column>
               <Button onClick={nextPage} disabled={!canNextPage}>
                    {">"}
                </Button>
               </Grid.Column>
       
       </Grid>
   
</>
    )
}

export default ReactSemanticTable;