import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./payment.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold",
      align: "center",
    },
  },
});

export default function DetailedPayments() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const handleRoute = () => {
    navigate("/newPayments");
  };
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  // get method//
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(data.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); 
  };
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getDetailedPayments/` + id); // Replace with your API endpoint
      const jsonData = await response.json();
      
      setData(jsonData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    fetch(`${APP_BASE_PATH}/deletePayment/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title: "Item Deleted Successfully!!!!",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        fetchData();
      })
      .catch((error) => {
        Swal.fire({
          title: "Error !!!!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      });
  };
  const { total = 0, paid = 0, payments } = data || {};
  return (
    <>
      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                UPDATE PAYMENT
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="d-flex justify-content-center">
                <div style={{ position: "relative", right: 100 }}>
                  <h4>Total: </h4>
                </div>
                <div style={{ position: "relative", right: 15 }}>
                  <h4>Paid: </h4>
                </div>
                <div style={{ position: "relative", left: 50 }}>
                  <h4>Pending: </h4>
                </div>
              </div>
              <Box style={{ marginLeft: 25 }}>
                <Grid container spacing={3}>
                  <Grid item xs={7}>
                    <TextField
                      style={{ width: 400 }}
                      fullWidth
                      id="empId"
                      label="Emp ID"
                      labelprope
                      name="empId"
                      autoComplete="Date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        sx={{ width: 400 }}
                        label="Payment Date"
                        inputFormat="DD/MM/YYYY"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={3}>
                  <Grid item xs={7}>
                    <FormControl style={{ width: 400 }}>
                      <InputLabel id="demo-select-small">
                        Payment Mode
                      </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        label="Payment Mode"
                        name="Payment Mode"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        <MenuItem>Select Payment Mode</MenuItem>
                        <MenuItem value={"Cash"}>Cash</MenuItem>
                        <MenuItem value={"Cheque"}>Cheque</MenuItem>
                        <MenuItem value={"NEFT/RTGS "}>NEFT/RTGS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      style={{ width: 400 }}
                      id="contactNo"
                      label="CHEQUE/NEFT/RTGS REF No"
                      name="contactNo"
                      autoComplete="Date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
            
            <div class="modal-footer" >
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
               
              >
                Save
              </button>
              <button type="button" data-dismiss="modal" class="btn btn-danger">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Payment History</h4>
        </div>
        <Button variant="contained" sx={{background: "#00d284",
          "&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} onClick={handleRoute}>
          New Payment
        </Button>
        <Link to="/payments" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{background: "#00d284",
          "&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}}>
            Back
          </Button>
        </Link>
      </div>

      
       
      
        <div className={classes.root}>
          <div class="container text-center" style={{marginBottom:'5px'}}>
            <div class="row">
              <div class="col" id="datePicker">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="From Date"
                    inputFormat="DD/MM/YYYY"
                    sx={{ marginRight: "40%",background:'#e4e9f0' }}
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div class="col" id="enddate">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="To Date"
                    inputFormat="DD/MM/YYYY"
                    sx={{ marginRight: "25%",background:'#e4e9f0' }}
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

          <div style={{ height: 400, width: "100%", marginTop: "-80px" }}>
            <TextField
            className="Search"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
               
              size="small"
              sx={{
                marginLeft: "42rem",
                marginTop: "35px",
                marginBottom: "4px",
                width: 300,
              }}
            />
            <br />

            

            <TableContainer>
              {isLoading && (
                <div id="spinner">
                  <CircularProgress color="warning" loading={isLoading} />
                </div>
              )}
              <div className={classes.root}>
              <Table className="tabel">
                    <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root">Sr No</TableCell>
                      <TableCell className="MuiTableHead-root">
                        Customer
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        Amount
                      </TableCell>
                      <TableCell className="MuiTableHead-root">Date</TableCell>

                      <TableCell className="MuiTableHead-root">
                        Payment Mode
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  {payments?.map((item) => (
                    <TableBody>
                      <TableRow className="tabelrow">
                        <TableCell key={item.id}>{item.id}</TableCell>
                        <TableCell key={item.id}>{item.customer}</TableCell>
                        <TableCell key={item.id}>₹{item.amount}</TableCell>
                        <TableCell key={item.id}>{item.payment_date}</TableCell>
                        <TableCell key={item.id}>{item.paymode}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            title="Print"
                            data-toggle="modal"
                            data-target="#exampleModalCenter"
                            variant="contained"
                            sx={{ padding: "5px",background: "#00d284",
                            "&:hover": {
                              background: "#00d284", // Set the same color as the default background
                            },}}
                          >
                            Edit

                          </Button>
                          <Button
                            size="small"
                            title="Delete"
                            onClick={() => handleDelete(item.id)}
                            variant="contained"
                            sx={{ marginLeft: "5px", padding: "5px", background: "#ff0854",
                            "&:hover": {
                              background: "#ff0854", // Set the same color as the default background
                            }, }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
               
              </div>
              <div class="container">
  <div class="row">
    <div class="col-sm">
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">
                      Paid
                    </InputLabel>
                    <Input
                      id="standard-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">₹{paid}</InputAdornment>
                      }
                    />
                  </FormControl>
    </div>
    <div class="col-sm">
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">
                      Total
                    </InputLabel>
                    <Input
                      id="standard-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">
                          {total}
                        </InputAdornment>
                      }
                    />
                  </FormControl>
    </div>
    <div class="col-sm">
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">
                      PENDING
                    </InputLabel>
                    <Input
                      id="standard-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">
                          {total - paid}
                        </InputAdornment>
                      }
                    />
                  </FormControl>
    </div>
  </div>
</div>
            
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            
          </div>
          
        </div>
         
      
    </>
  );
}
