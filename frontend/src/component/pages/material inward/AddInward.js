import * as React from "react";
import { useState } from "react";
import { Button, IconButton, Grid, TextField, Box } from "@mui/material";
import "./materialinward.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from '@mui/icons-material/Clear';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import ReorderIcon from '@mui/icons-material/Reorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "../../commen/LoadingSpinner";
import { DatePicker } from "@mui/x-date-pickers";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      width: 220,
      fontWeight: "bold",
    },
  },
});

export default function AddStock() {
  const classes = useStyles();
  const { state } = useLocation();
  const [rows, setRows] = useState([
    {
      SrNo: "",
      code: "",
      description: "",
      unit: "",
      quantity: "",
      action: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [custname, setCustname] = useState("");
  const [date, setPoDate] = useState(dayjs(new Date()).format("DD/MM/YYYY"));
  const [optionList, setOptionList] = useState([]);
  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const miid = new URLSearchParams(search).get("miid");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Debugging - id:', id);
      console.log('Debugging - miid:', miid);
      
      // Append miid to the URL, it's okay if it's undefined
      const response = await fetch(`${APP_BASE_PATH}/getPoDetail/${id}${miid ? `?miid=${miid}` : ''}`);

console.log(response)
     
        const jsonData = await response.json();
        setRows(jsonData);
        console.log("hiii",jsonData)
        setCustname(jsonData[0]?.custname || "");
        
      } catch (error) {
        console.error("Error fetching data:", error);
        
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (index) => {
    const filterItems = rows.splice(index, 1);
    setRows([...filterItems]);
  };

  const handleItemCode = ({ target }) => {
    fetch(`${APP_BASE_PATH}/autoItemCode/${target.value}`)
      .then((response) => response.json())
      .then((data) => {
        setOptionList(data || []);
      });
  };
  
 
  const onDataChange = (value, key, index) => {
    let dataList = [...rows];
    let data = {
      ...dataList[index],
      [key]: value,
    };
    const curdate = new Date();
    const formattedDate = curdate.toLocaleDateString("en-GB");
    dataList[index] = {
      ...data,
      ...(key === "code"
        ? {
            itemCode: value?.item_code || "",
            itemid: value?.id,
            description: value?.material_description || "",
            unit: value?.unit || "",
            date: formattedDate,
          }
        : key === "quantity" || key === "rate"
        ? { amount: (data.quantity || 0) * (data.rate || 0) }
        : {}),
    };
  
    // Debugging statements
    // console.log('Debugging - accqty:', dataList[index].accqty);
    // console.log('Debugging - qty:', dataList[index].qty);
  
    // Check if accqty is equal to qty, set status to 2, otherwise set it to 1
    dataList[index].status = dataList[index].materialaccqty - dataList[index].accqty == 0  ? 2 : 1;
  
    // Automatically generate rejqty
    dataList[index].rejqty = dataList[index].materialaccqty - dataList[index].accqty;
  
    // Debugging statement
    // console.log('Debugging - status:', dataList[index].status);
  
    setRows(dataList);
  };
   
  

// ... (previous code)

const addStock = async (e) => {
  e.preventDefault();

  // Disable items where accqty is equal to qty
  const updatedRows = rows.map((row) => ({
    ...row,
    qtyleft:row.rejqty,
    disabled: row.materialaccqty == 0,
  }));

  let status = 2;
 
  // Check if all items have materialaccqty - accqty equal to 0
  if (updatedRows.every((row) => row.materialaccqty - row.accqty == 0)) {
    status = 2; // Set status to 2 if all items meet the condition
  } else {
    // Loop through each item
    for (const row of updatedRows) {
      // Check if accqty is not equal to qty
      if (parseInt(row.materialaccqty) != 0) {
        // If not equal, set status to 1 and break the loop
        status = 1;

        // Show an alert for accqty greater than materialinwardqty
        if (parseInt(row.accqty, 10) > parseInt(row.materialaccqty, 10)) {
          Swal.fire({
            title: "Error",
            text: "Accqty should be less than or equal to PO Remaining QTY",
            icon: "error",
          });
          return; // Exit the function, don't proceed to the backend request
        }

        break;
      }
    }

    // Check if the sum of MID accqty and current accqty is greater than materialinwardqty
    if (
      updatedRows.some(
        (row) =>
           parseInt(row.accqty, 10) >
          parseInt(row.materialaccqty, 10)
      )
    ) {
      Swal.fire({
        title: "Error",
        text: "Material Inward Accepted QTY Should Be Less Than PO QTY",
        icon: "error",
      });
      return; // Exit the function, don't proceed to the backend request
    }
  }

  // The 'status' variable now contains the correct status value
  console.log('Status:', status);

  const params = {
    date,
    supplierid: updatedRows[0]?.supplierid,
    poid: id,
    uid: rows[0].uid,
    qltflag: 0,
    materialList: updatedRows, // Use updatedRows instead of rows
    status: status, // Set the status based on the condition
  };
  console.log("params.materialList",params.materialList)
  setIsLoading(true);
  try {
    const res = await fetch(`${APP_BASE_PATH}/addPOInward`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const resText = await res.text(); // Use text() instead of json()
console.log("resText",res)
    // Handle the response based on its content
    if (resText === "POSTED") {
      // Handle the "POSTED" response
      console.log("Data Added Successfully!");

      // Swal notification for success
      Swal.fire({
        title: "Data Added Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });

      // Navigate to the desired location
      navigate("/materialInward");
    } else if(res.status === 400){
      Swal.fire({
        title: "Warning",
        text: "Accqty should be greater than 0!",
        icon: "error",
      });
    }
    
    else {
      // Handle other responses or errors
      console.log("Something went wrong!");

      // Swal notification for error
      Swal.fire({
        title: "Error",
        text: "Something went wrong!",
        icon: "error",
      });
    }
    setIsLoading(false);
  } catch (error) {
    console.error("Error adding data:", error);

    // Swal notification for error
    Swal.fire({
      title: "Error",
      text: "Something went wrong!",
      icon: "error",
    });
  }finally{
    setIsLoading(false);
  }
};

// ... (remaining code)

// ... (remaining code)


const handleDateChange = (date) => {
  setPoDate(dayjs(date).format("DD/MM/YYYY"));
};
  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Add Purchase Order</h4>
        </div>
      </div>
      <Paper elevation={6} style={{ position: "relative", marginTop: 0 ,padding:'14px'}}>
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "95%",
          
            marginLeft: "2rem",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 3 }}>
            {/* <Grid container spacing={2}> */}
              {/* <Grid item xs={4}> */}
                <FormControl style={{ width: 300 }}>
                  <TextField
                    label="Supplier"
                    autoFocus
                    value={custname}
                    sx={{marginRight:'10%'}}
                    disabled
                  />
                </FormControl>
              {/* </Grid> */}
              {/* <Grid item xs={4}> */}
                <FormControl style={{ width: 300 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Inward Date"
                      format="DD-MM-YYYY"
                      name="edate"
                      onChange={(e) => handleDateChange(e.$d)}
                      id="edate"
                      defaultValue={dayjs(new Date())}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
              {/* </Grid> */}
            {/* </Grid> */}
          </Box>
        </Box>
        <TableContainer style={{marginTop:'8px'}}>
          
          <div>
            <div className={classes.root}>
            <Table className="tabel">
                    <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px"}} />Sr <br/><span style={{ marginLeft:'10px' }}>No</span></TableCell>
                    <TableCell className="MuiTableHead-root">
                    <DynamicFormIcon style={{ fontSize: "16px",marginRight:'2px' }} />Item Code
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                    <DescriptionIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Description
                    </TableCell>
                    <TableCell className="MuiTableHead-root"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                    <TableCell className="MuiTableHead-root"><ReorderIcon style={{ fontSize: "16px" }} />PO <br/><span style={{ marginLeft:'10px' }}>QTY</span></TableCell>
                    <TableCell className="MuiTableHead-root">
                    <ReorderIcon style={{ fontSize: "16px" }} /> PO Remaining <br/><span style={{ marginLeft:'30px' }}>QTY</span>
                    </TableCell>
                    {/* <TableCell className="MuiTableHead-root">
                    <DoneAllIcon style={{ fontSize: "16px" }} />Material Accepted QTY
                    </TableCell> */}
                    <TableCell className="MuiTableHead-root">
                    <DoneAllIcon style={{ fontSize: "16px" }} />GRN Accepted <br/><span style={{ marginLeft:'30px' }}>QTY</span>
                    </TableCell>
                    {/* <TableCell className="MuiTableHead-root">
                   
                    <RemoveDoneIcon style={{ fontSize: "16px" }} />
                    Material Rejected QTY
                    </TableCell> */}
                    <TableCell className="MuiTableHead-root">
                   
                   <RemoveDoneIcon style={{ fontSize: "16px" }} />
                   GRN Rejected <br/><span style={{ marginLeft:'30px' }}>QTY</span>
                   </TableCell>
                    
                    <TableCell className="MuiTableHead-root"><AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow   className="tabelrow" key={index}>
                      <TableCell style={{width:'10px'}}>{index + 1}</TableCell>
                      <TableCell>
                      <Autocomplete
                        
                         value={row.code} // Make sure 'row.code' is set correctly
                         onChange={(event, newValue) => {
                           onDataChange(newValue, "code", index);
                         }}
                          selectOnFocus
                          clearOnBlur
                          handleHomeEndKeys
                          id="item-code"
                          options={optionList}
                          getOptionLabel={(option) => {
                            return option.item_code;
                          }}
                          renderOption={(props, option) => (
                            <li {...props}>{option.item_code}</li>
                          )}
                          sx={{ width: 150 }}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label=""
                              onChange={(e) => handleItemCode(e)}
                            />
                          )}
                          disabled={ row.materialaccqty == 0}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="description"
                          
                          value={row.description}
                          disabled={ row.materialaccqty == 0}
                        />
                      </TableCell>

                      <TableCell>
                        <input type="text" style={{width:'50px'}} name="unit" value={row.unit}   disabled={ row.materialaccqty == 0} />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="qty"
                          value={row.qty}
                          style={{width:'60px'}}
                          onChange={({ target }) =>
                            onDataChange(target.value, "qty", index)
                          }
                          disabled={ row.materialaccqty == 0}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          style={{width:'120px'}}
                          name="accqty"
                          value={row.materialaccqty}

                                                    disabled
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="accqty"
                          style={{width:'120px'}}
                          value={row.accqty}
                          onChange={({ target }) =>
                            onDataChange(target.value, "accqty", index)
                          }
                          disabled={ row.materialaccqty == 0}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="rejqty"
                          style={{width:'120px'}}
                          value={row.rejqty}
                          onChange={({ target }) =>
                            onDataChange(target.value, "rejqty", index)
                          }
                          disabled
                        />
                      </TableCell>
                      
                      <TableCell>
                        <IconButton
                          size="small"
                          title="Delete"
                         sx={{color:'#ff0854',marginLeft:'10px'}}
                          onClick={() => handleDelete(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <br />
          <Grid
            container
            spacing={-108}
            sx={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginLeft: "26rem",
              marginBottom: "9px",
            }}
          >
            <Grid item xs={8} sm={4}>
              <Button
                variant="contained"
                sx={{ background: "#00d284",
                "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },}}
                onClick={addStock}
                type="submit"
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={8} sm={4}>
              <Button
                onClick={() => navigate(-1)}
                variant="contained"
              sx={{ background: "#ff0854",
              "&:hover": {
                background: "#ff0854", // Set the same color as the default background
              },}}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </TableContainer>
      </Paper>
      </>
      )}
    </>
  );
}
