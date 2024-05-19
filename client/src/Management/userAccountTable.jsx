//this file is where the react-table component is created with filtering and sorting. 
import React, {useMemo, useState} from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "./filterTable";
import { useNavigate } from 'react-router-dom';

const Table = ({data})=>{
    const columns = [
      {
        name: "Username",
        selector: (row)=>row.account_username,
        sortable: true
      },
      {
        name: "Email",
        selector: (row)=>row.account_user_email,
        sortable: true
      },
      {
        name: "Account Number",
        selector: (row)=>row.account_number,
        sortable: true
      },
      {
        name: "Register Date",
        selector: (row)=>row.register_date,
        sortable: true
      },
      {
        name: "Actions",
        cell: (row) => <button onClick={() => handleButtonClick(row.account_number)}>Run Report</button> 
      },
    ]; 

    const navigate = useNavigate();
    const handleButtonClick = (account_number) =>{
      navigate(`/user-account/${account_number}`);
    };
    
    const[filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(true);

    let filteredItems = [];
    if (Array.isArray(data)) {
      filteredItems = data.filter(
        (item) =>
          JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
      );
    }
    
      const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
          if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText("");
          }
        };
    
        return (
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        );
      }, [filterText, resetPaginationToggle]);


      return(
        <DataTable
            columns = {columns}
            data = {filteredItems}
            defaultSortField = {["account_id", "asc"]}
            striped
            pagination
            subHeader
            subHeaderComponent = {subHeaderComponent}
        />
      );

};
export default Table;