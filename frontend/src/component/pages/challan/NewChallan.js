import React from "react";
import { useState } from "react";
import { Autocomplete, Grid, InputAdornment, MenuItem, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import "./challan.css";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import Swal from "sweetalert2";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";


const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight:'bold',
      fontSize: "1em",
      align: "center",
    },
  },
});

const type = {
  1: "OUTDOOR",
  2: "INDOOR",
};
const NewChallan = () => {
  const navigate= useNavigate()
  const classes = useStyles();
  const[redtqty,setReadyqty]=useState(0)
  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const userId = parsedUserData.id || ""; // Extract id or default to an empty string

  const [values, setValues] = useState({
    buyer: "",
    challan_no: "",
    chdate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    }).replace(/\//g, "-"),
    buyer_id: "",
    address: "",
    deliver_at: "",
    delivery_address: "",
    po_no: "",
    podate: "",
    costing_id: "",
    uid: userId,
    vehicle: "",
    orderacceptance_id: 0,
    modeoftransport:''
    
  });
  const [optionList, setOptionList] = useState([]);
  const [capacityList, setCapacityList] = useState([]);
  const [rows, setRows] = useState([
    {
      plan_id: "",
      capacity: "",
      desc: "",
      qty: "",
      rate: "",
      amt: "",
      readyqty:''
    },
  ]);
  const [custname, setCustname] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
 const fetchData = async () => {
  setIsLoading(true)
  try {
    const response = await fetch(`${APP_BASE_PATH}/getCapacityList/${values.buyer.custname}`);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    const jsonData = await response.json();
    console.log("jsonData",jsonData);
    setReadyqty(jsonData[0].readyqty)
    if (jsonData.message && jsonData.message === 'No costing related to this name') {
      // Show a sweet alert when no data is found
      Swal.fire({
        title: "No Data Found",
        text: "There is no costing related to this name.",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } else {
      const augmentedData = jsonData.map((item, index) => ({
        ...item,
        srno: index + 1 // Add srno based on index + 1
      }));
      setCapacityList(augmentedData);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }finally{
    setIsLoading(false)
  }
};


  useEffect(() => {
  if (values.buyer && values.buyer.custname) { // Check if values.buyer and custname are defined
    setCustname(values.buyer.custname);
    fetchData();
  } else {
    console.error("values.buyer or values.buyer.custname is undefined or null.");
  }
}, [values.buyer]);

  

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        plan_id: "",
        capacity: "",
        desc: "",
        qty: "",
        rate: "",
        amt: "",
      },
    ]);
  };

  const handleDateChange = (e) => {
    setValues((prev) => ({
      ...prev,
      chdate: e.$d.toLocaleDateString("en-GB"),
    }));
  };

  const handlePODateChange = (e) => {
    setValues((prev) => ({
      ...prev,
      po_date: e.$d.toLocaleDateString("en-GB"),
    }));
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
  console.log(value)
    // Find the selected capacity
    console.log("capacityList",capacityList)
    const selectedCapacity = capacityList.find((item) => item.srno === value);
  
    // Calculate the total readyqty
    const totalReadyQty = capacityList.reduce((total, item) => {
      if (item.capacity === value) {
        return total + (parseInt(item.readyqty, 10) || 0);
      }
      return total;
    }, 0);
  
    setValues((prev) => ({
      ...prev,
      [name]: value,
      ...(selectedCapacity
        ? {
          ...selectedCapacity,
          po_no: selectedCapacity.ponum || '',
          po_date: selectedCapacity.podate || '',
          buyer_address: selectedCapacity.address || '',
          delivery_address: selectedCapacity.consumer_address || '',
          deliver_at: selectedCapacity.consumer_address || '',
        }
        : {}),
    }));
  
    // Update the 'desc' in the rows
    if (selectedCapacity) {
      const newRows = rows.map((row) => ({
        ...row,
        plan_id: selectedCapacity.prod_plan_id || '',
        capacity: selectedCapacity.capacity || '',
        costing_id: selectedCapacity.cid || '',
        rate: selectedCapacity.basicrate || '',
        desc: `Capacity: ${selectedCapacity.capacity} KVA, Voltage Ratio: ${selectedCapacity.voltageratio}, Type Cooling: ${selectedCapacity.typecolling}`,
        qty: selectedCapacity.readyqty,
        readyqty:selectedCapacity.readyqty
      }));
  
      console.log("console.log(newRows)", newRows);
      console.log("console.log(rows)", rows);
  
      setRows(newRows);
    }
  };
  
  console.log("yoooo",capacityList)
  const handleBuyer = ({ target }) => {
    fetch(`${APP_BASE_PATH}/autoCustomer/${target.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setOptionList(data || []);
        
      });
  };

  const onDataChange = (e, index) => {
    const { name, value } = e.target;
    
    const list = [...rows];
    const selectedCapacity =
      name === "capacity"
        ? capacityList.find(({ capacity, cid }) => value === capacity) || {}
        : {};
  
    // Initialize costing_id to the current value or 0
    const costingId = name === "capacity" ? selectedCapacity.cid : list[index].costing_id;
  
    list[index] = {
      ...list[index],
      [name]: value,
      costing_id: costingId, // Set costing_id to the appropriate value
      ...(name === "capacity"
        ? {
         
            ...selectedCapacity,
             rate: selectedCapacity.cost || 0,
            amt: (selectedCapacity.cost || 0) * (list[index]?.qty || 0),
        
            capacity: selectedCapacity.capacity,
          desc: `Capacity: ${selectedCapacity.capacity} KVA, VoltageRtio: ${selectedCapacity.voltageratio}, TypeCooling: ${selectedCapacity.typecolling}`,
          }
        : {
            amt: (list[index].rate || 0) * (value || 0),
          }),
    };
  
   console.log("qty", selectedCapacity.readyqty);
    // console.log("costing_id:", list[index].costing_id);
  
    setRows(list);
  };
  
  
  

  const handleDelete = (id) => {
    const filterItems = rows.filter((row) => row.id !== id);
    setRows(filterItems);
  };

  const challan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log()
if(rows[0].qty > rows[0].readyqty ){
  Swal.fire({
    title: "Challan quantity should not be greater than ready stock quantity.",
    icon: "warning",
    iconHtml: "",
    confirmButtonText: "OK",
    animation: "true",
    confirmButtonColor: "warning",
  });
  setIsLoading(false);
  return
}
    try {
    const res = await fetch(`${APP_BASE_PATH}/challan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        orderacceptance_id: values.oa_id,
        detailList: rows,
      }),
    });
    const data = res.json();
    console.log("jiiiiiiiiiiiiiiiiiiiii",data)
    if (res.status === 400 || !data) {
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      setIsLoading(false);
    } else {
      Swal.fire({
        title: "Data Added Successfully",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });
      navigate("/challan")
    }
  } catch (error) {
    console.error("Error fetching data:");
  }finally{
    setIsLoading(false);
  }
  };
  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };
  const handleClear = () => {
    setValues((prev) => ({
      ...prev,
      capacity: '',
    }));
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
          <h4>New Challan</h4>
        </div>
        <Link to="/challan" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{  background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      },}} >
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={6} style={{ position: "relative", bottom: 20,padding:'14px',marginTop:'16px' }}>
        <div>
          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "80%",
              marginLeft: "10rem",
            }}
          >
            <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
  <Grid item xs={4}>
    <FormControl fullWidth>
   
                  <Autocomplete 
  value={values.buyer}
  onChange={(event, newValue) => {
    if (newValue !== null) {
      handleChange({
        target: { value: newValue, name: "buyer" },
      });
    }
  }}
  selectOnFocus
  clearOnBlur
  handleHomeEndKeys
  id="item-code"
  options={optionList}
  getOptionLabel={(option) => {
    return option?.custname || "";
  }}
  renderOption={(props, option) => (
    <li {...props}>{option?.custname || ""}</li>
  )}
  freeSolo
  renderInput={(params) => (
    <TextField
      fullWidth
      {...params}
      label="Customer"
      onChange={(e) => handleBuyer(e)}
    />
  )}
/>

                  </FormControl>
  </Grid>
  <Grid item xs={8}>
  <TextField
  fullWidth
  id="challan_no"
  label="Costing Name"
  name="challan_no"
  select
  value={values.srno} // Set the selected capacity value
  onChange={handleChange}
  
>
  {capacityList.filter(({ readyqty }) => readyqty !== null).map(({ srno,id, capacity,voltageratio,typecolling,podate}) => (
    <MenuItem key={id} value={srno}>
      {`${srno}:-Capacity: ${capacity} KVA, VoltageRtio:${voltageratio},TypeCooling:${typecolling} `}
      {formatDate(podate)}
    </MenuItem>
  ))}
</TextField>
  </Grid>
  <Grid item xs={4}>
    <TextField
                    fullWidth
                    id="buyer_address"
                    label="Customer Address"
                    name="buyer_address"
                    value={values.address}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true, // Add the readOnly attribute
                    }}
                  />
  </Grid>
  <Grid item xs={4}>
   
                   <TextField
                    fullWidth
                    id="podate"
                     label="podate"
                    name="podate"
                    value={values.podate ? formatDate(values.podate) : ""}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true, // Add the readOnly attribute
                    }}
                  />
  </Grid>
   <Grid item xs={4}>
     <TextField
                    
                    fullWidth
                    id="po_no"
                    label="PO NO."
                    name="po_no"
                    value={values.ponum}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true, // Add the readOnly attribute
                    }}
                  />
  </Grid>
  <Grid item xs={4}>
    <TextField
                    fullWidth
                    id="deliver_at"
                    label="Consumer Address(Deliver At)"
                    name="deliver_at"
                    onChange={handleChange}
                    value={values.deliver_at}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true, // Add the readOnly attribute
                    }}
                  />
  </Grid>
  <Grid item xs={4}>
    <TextField
                    fullWidth
                    id="delivery_address"
                    label="Delivery Address"
                    name="delivery_address"
                    value={values.consumer_address}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true, // Add the readOnly attribute
                    }}
                  />
  </Grid>
  <Grid item xs={4}>
    <TextField
                    fullWidth
                    id="modeoftransport"
                    label="Mode of Transport"
                    name="modeoftransport"
                    value={values.modeoftransport}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                  />
  </Grid>
</Grid>

            </Box>
          </Box>
        </div>
        <br />
        <div
          class="d-flex justify-content-center"
          style={{
            marginLeft: 150,
            border: "1px solid gray",
            marginRight: 40,
            width: "75%",
          }}
        >
          <TableContainer>
            <div className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="MuiTableHead-root">Sr No</TableCell>
                    <TableCell className="MuiTableHead-root">
                      Capacity
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      Description
                    </TableCell>

                    <TableCell className="MuiTableHead-root">
                      Quantity
                    </TableCell>
                    <TableCell className="MuiTableHead-root">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div class="input-group mb-3">
                          <select
                            class="custom-select"
                            id="inputGroupSelect01"
                            style={{
                              width: 150,
                              height: 28,
                              position: "relative",
                              top: "10",
                            }}
                            name="capacity"
                            value={values.capacity}
                            onChange={(e) => onDataChange(e, index)}
                          >
                            <option selected>Choose...</option>
                            {capacityList.map(({ id, capacity }) => {
                              return (
                                <option key={id} value={capacity}>
                                  {capacity} KVA
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </TableCell>
                      <TableCell>{`Capacity: ${values.capacity} KVA, VoltageRtio:${values.voltageratio},TypeCooling:${values.typecolling} `}</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="qty"
                          value={row.qty}
                          onChange={(e) => onDataChange(e, index)}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          title="Delete"
                          sx={{color:'#ff0854'}}
                          onClick={() => handleDelete(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <br />
              {/* <Button
                variant="contained"
              
                onClick={handleAddRow}
                sx={{
                  float: "right",
                  marginRight: "15px",
                  marginBottom: "10px",
                  backgroundColor: "#28a745"
                }}
              >
                Add Row
              </Button> */}
              <br />
              <br />
            </div>
          </TableContainer>
        </div>
        <br />
        <div>
          <table
            class="table table-responsive-sm table-bordered table-striped table-sm"
            style={{ width: "75%", marginLeft: 150, border: "1px solid gray" }}
          >
            <tr style={{ borderRight: "1px solid gray" }}>
              <td style={{ width: 55, borderLeft: "1px solid gray" }}>
                Vehicle No :{" "}
                <input
                  style={{ marginLeft: 30 }}
                  type="text"
                  id="vehicle"
                  onChange={handleChange}
                  name="vehicle"
                />
              </td>

              <td style={{ width: "25%" }} align="right">
               
              </td>
              <td id="totals" style={{ width: "20%" }}>
                
                </td>
            </tr>
            <tr>
              <td>
                <p style={{ fontSize: 17 }}>
                  1) The item which is despatched to you directly or through a
                  third party, the company reserves the right to take back the
                  item against any delay/non payment.
                </p>
                <p style={{ fontSize: 15 }}>
                  <b>Subject to Pune Jurisdiction Only</b>
                  <br />
                  Received the above items in good condition.
                </p>
                <br />
                <br />
                <p style={{ fontSize: 17 }}>
                  Receivers Signature And Stamp :
                  __________________________________
                </p>
              </td>

              <td align="" colspan="2">
                <center>
                  <p style={{ fontSize: 27 }}>
                    For <b>Static Electricals Pune</b>
                  </p>
                  <br />
                  <br />
                  <br />
                  <br /> <br />
                  <br />
                  <p style={{ fontSize: 22 }}>Authorised Signatory</p>
                </center>{" "}
              </td>
            </tr>{" "}
          </table>
        </div>
        <br />

        <Grid
          container
          spacing={-100}
          sx={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginLeft: "21rem",
          }}
        >
          <Grid item xs={8} sm={4}>
            <Button
              style={{ position: "relative", left: 20, background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              }, }}
              variant="contained"
             
              onClick={challan}
              type="submit"
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={8} sm={4}>
            <Button
              variant="contained"
              
              style={{ position: "relative", right: 10, background: "#ff0854",
              "&:hover": {
                background: "#ff0854", // Set the same color as the default background
              }, }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
        <br />
      </Paper>
      </>
      )}
    </>
  );
};

export default NewChallan;
