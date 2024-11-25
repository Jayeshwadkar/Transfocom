import React from "react";
import { FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup } from "@mui/material";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import "./enquiry.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';

import { APP_BASE_PATH } from "Host/endpoint";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { ClearIcon, DatePicker } from "@mui/x-date-pickers";
import LoadingSpinner from "component/commen/LoadingSpinner";
const EditEnquiry = () => {
  const [optionlist, setOptionlist] = useState([]);
  const [selectedCostingName, setSelectedCostingName] = useState('');
  const [costingIDs, setCostingIDs] = useState([]);
  const navigate = useNavigate();
  const [typetaping, setTypetaping] = useState('');
  const [tapingSwitch, setTapingSwitch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [otherTypetaping, setOtherTypetaping] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    custname: "",
    contactperson: "",
    desg: "",
    email: "",
    contactno: "",
    altcontactno: "",
    address: "",
    currency: "",
    edate: "",
    capacity: "",
    type: "",
    hvvoltage: "",
    consumertype: "",
    lvvoltage: "",
    areaofdispatch: "",
    vectorgroup: "",
    matofwind: "",
    typecolling: "",
    typetaping: "",
    tapingSwitch: "",
    comment: "",
    voltageratio: "",
    core: "",
    secratio: "",
    priratio: "",
    frequency:"50",
    phase:"3Phase",
  });

  const { id } = useParams();
  const [finalcosting,setFinalcosting]=useState(null)
  useEffect(() => {
    const fetchCostingIDs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getcostingmaster`); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
         
          setCostingIDs(data);
          console.log("data ",data)
          
        } else {
          console.error('Failed to fetch costing IDs');
        }
      } catch (error) {
        console.error('Error fetching costing IDs:', error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchCostingIDs();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editenq/${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
      console.log("resData",resData)
      setFinalcosting(resData.final_costing)
        setData(resData);
        setTapingSwitch(resData.tapingSwitch);
      
        setTypetaping(resData.typetaping);
       
        setShowDropdown(resData.tapingSwitch === 'oltc' || resData.tapingSwitch === 'octc');
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
   
    fetchData();
  }, [id]);
  console.log("Current typetaping:", typetaping);
  useEffect(() => {
    setShowDropdown(tapingSwitch === 'oltc' || tapingSwitch === 'octc');
  }, [tapingSwitch]);

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setTapingSwitch(value);
    setTypetaping('');
    setShowDropdown(value === 'oltc' || value === 'octc');
    setData((prevData) => ({
      ...prevData,
      tapingSwitch: value,
      typetaping: '',
    }));
  };

  const handleDropdownChange = (value) => {
    setTypetaping(value);
    setData((prevData) => ({
      ...prevData,
      typetaping: value,
    }));
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    
    setShowDropdown(true);
    setData((prevData) => ({
      ...prevData,
      typetaping: '',
    }));
  };

  const handleEdit = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleDateChange = (date) => {
    // Ensure date is a valid Dayjs object
    const dayjsDate = dayjs(date);
    setData({ ...data, edate: dayjsDate });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
setIsLoading(true)
    const editInputvalue = {
      custname: data.custname,
      contactperson: data.contactperson,
      desg: data.desg,
      email: data.email,
      contactno: data.contactno,
      altcontactno: data.altcontactno,
      address: data.address,
      currency: data.currency,
      edate: data.edate,
      capacity: data.capacity,
      type: data.type,
      hvvoltage: data.hvvoltage,
      consumertype: data.consumertype,
      lvvoltage: data.lvvoltage,
      areaofdispatch: data.areaofdispatch,
      vectorgroup: data.vectorgroup,
      matofwind: data.matofwind,
      typecolling: data.typecolling,
      typetaping: data.typetaping,
      comment: data.comment,
      voltageratio: data.voltageratio,
      core: data.core,
      secratio: data.secratio,
      priratio: data.priratio,
      costingName: selectedCostingName,
      otherTypetaping,
      tapingSwitch,
      frequency: data.frequency,
      phase: data.phase,

    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateEnquiry/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editInputvalue),
      });

      const resjson = await res.json();
      if (res.status === 400 || !resjson) {
        Swal.fire({
          title: "Please Fill Data!!!!",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }
    } catch {
      Swal.fire({
        title: "Data Updated Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      }).then(()=>{
        navigate("/enquiry");
      })

    }finally{
      setIsLoading(false)
    }
  }; 
  console.log("data",data)
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
          <h4>Edit Enquiry</h4>
        </div>
        <Link to="/enquiry" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ background: "#17a2b8"}}>
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={6} style={{ position: "relative", bottom: 15 }}>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "95%",
            marginLeft: "5rem",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="custname"
                  label="Customer Name"
                  labelprope
                  name="custname"
                  autoComplete="custname"
                  value={data.custname}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="contactperson"
                  label="Contact Person"
                  name="contactperson"
                  autoComplete="contactperson"
                  value={data.contactperson}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="desg"
                  label="Designation (Optional)"
                  name="desg"
                  autoComplete="desg"
                  value={data.desg}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email (Optional)"
                  name="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="contactno"
                  label="Contact No."
                  name="contactno"
                  autoComplete="contactno"
                  value={data.contactno}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
              <TextField
  fullWidth
  id="altcontactno"
  label="Alt.Contact No. (Optional)"
  autoComplete="altcontactno"
  name="altcontactno"
  value={data.altcontactno}
  onChange={handleEdit}
  InputLabelProps={{
    shrink: true,
  }}
/>
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  value={data.address}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">Currency</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="currency"
                    required
                    label="Currency"
                    name="currency"
                    autoComplete="currency"
                    value={data.currency}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value={"INR"}>INR(Indian Rupee)</MenuItem>
                    <MenuItem value={"USD"}>USD (US Doller)</MenuItem>
                    <MenuItem value={"IDR"}>IDR(Indonesian Rupiah)</MenuItem>
                    <MenuItem value={"EUR"}>EUR (Euro)</MenuItem>
                    <MenuItem value={"AUD"}>AUD(Australian Doller)</MenuItem>
                    <MenuItem value={"IRR"}>IRR (Iranian rial)</MenuItem>
                    <MenuItem value={"CAD"}>CAD(Canadian Dollar)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl style={{ width: "25vw" }}>
          <DatePicker
          fullWidth
            label="Date of Enquiry"
            format="DD-MM-YYYY"
            required
            name="edate"
            value={data.edate ? dayjs(data.edate, 'DD-MM-YYYY') : null}
            onChange={(date) => handleDateChange(date)}
            renderInput={(params) => <TextField {...params} />}
          />
          </FormControl>
        </LocalizationProvider>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="capacity"
                  label="Capacity"
                  
                  name="capacity"
                  autoComplete="capacity"
                  value={data.capacity}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">Type</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="type"
                    name="type"
                    required
                    label="Type"
                    autoComplete="type"
                    value={data.type}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value={"1"}>OUTDOOR</MenuItem>
                    <MenuItem value={"2"}>INDOOR</MenuItem>
                    <MenuItem value={"3"}>OUTDOOR/INDOOR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="hvvoltage"
                  label="HV"
                  name="hvvoltage"
                  autoComplete="hvvoltage"
                  value={data.hvvoltage}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel label="Consumer Type">
                    Consumer Type
                  </InputLabel>
                  <Select
                    labelId="demo-select-small"
                    required
                    id="consumertype"
                    label="Consumer Type"
                    name="consumertype"
                    autoComplete="consumertype"
                    value={data.consumertype}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value={"HT"}>HT</MenuItem>
                    <MenuItem value={"LT"}>LT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  style={{ width: "26vw" }}
                  fullWidth
                  required
                  id="lvvoltage"
                  label="LV"
                  name="lvvoltage"
                  autoComplete="lvvoltage"
                  value={data.lvvoltage}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="areaofdispatch"
                  label="Area of Dispatch (optional)"
                  name="areaofdispatch"
                  autoComplete="areaofdispatch"
                  value={data.areaofdispatch}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="vectorgroup"
                  label="Vector Group"
                  name="vectorgroup"
                  autoComplete="vectorgroup"
                  value={data.vectorgroup}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">
                    Material of Winding
                  </InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="matofwind"
                    required
                    label="Material of Winding"
                    name="matofwind"
                    autoComplete="matofwind"
                    value={data.matofwind}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value={"Copper"}>Copper</MenuItem>
                    <MenuItem value={"Aluminium"}>Aluminium</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="typecolling"
                  required
                  label="Type of Colling"
                  name="typecolling"
                  autoComplete="typecolling"
                  value={data.typecolling}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

             
              <Grid item xs={7} sm={3.5}>
                <TextField
                  style={{ width: "26vw" }}
                  fullWidth
                  required
                  id="priratio"
                  label="Primary Voltage"
                  name="priratio"
                  autoComplete="priratio"
                  value={data.priratio}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="core"
                  label="Core"
                  name="core"
                  autoComplete="core"
                  value={data.core}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  id="secratio"
                  label="Secondary Voltage"
                  name="secratio"
                  autoComplete="secratio"
                  value={data.secratio}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
           
              <Grid item xs={7} sm={3.5}>
              <TextField
                  fullWidth
                  id="comment"
                  label="Comment (optional)"
                  name="comment"
                  autoComplete="comment"
                  value={data.comment}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

              </Grid>
              {/* <Grid item xs={7} sm={3.5}>
  <TextField
    fullWidth
    required
    label="Type of Taping Switch"
    id="typetaping"
    name="typetaping"
    autoComplete="off"
    value={tapingSwitch === 'notaping' ? 'No Taping' : data.typetaping}
    select={showDropdown && (tapingSwitch === 'oltc' || tapingSwitch === 'octc')}
    disabled={tapingSwitch === 'notaping'}
    InputProps={{
      endAdornment: typetaping && (tapingSwitch === 'oltc' || tapingSwitch === 'octc') && (
        <IconButton onClick={handleClearSelection} edge="end">
          <ClearIcon />
        </IconButton>
      ),
    }}
    onChange={(e) => setTypetaping(e.target.value)}
  >
    {showDropdown && (tapingSwitch === 'oltc' || tapingSwitch === 'octc') && (
      <>
        {tapingSwitch === 'oltc' && (
          <>
            <MenuItem value="type1" onClick={() => handleDropdownChange("℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer")}>℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer</MenuItem>
            <MenuItem value="type2" onClick={() => handleDropdownChange("℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer")}>℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer</MenuItem>
            <MenuItem value="other" onClick={() => handleDropdownChange("other")}>Other OLTC</MenuItem>
          
          </>
        )}
        {tapingSwitch === 'octc' && (
          <>
            <MenuItem value="option3" onClick={() => handleDropdownChange("℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer")}>℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer</MenuItem>
            <MenuItem value="option4" onClick={() => handleDropdownChange("℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer")}>℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer</MenuItem>
            <MenuItem value="others" onClick={() => handleDropdownChange("others")}>Other OCTC</MenuItem>
            
          </>
        )}
      </>
    )}
  </TextField>

  

  <FormControl component="fieldset">
    <RadioGroup aria-label="taping-switch" name="taping-switch" value={tapingSwitch} onChange={handleRadioChange} row>
    <FormControlLabel value="octc" control={<Radio />} label="OCTC" />
      <FormControlLabel value="oltc" control={<Radio />} label="OLTC" />
      
      <FormControlLabel value="notaping" control={<Radio />} label="No Taping" />
    </RadioGroup>
  </FormControl>
</Grid> */}
<Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="frequency"
                  label="Frequency"
                  name="frequency"
                  autoComplete="frequency"
                  value={data.frequency}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "25vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">
                  Phase
                  </InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="phase"
                    
                    label="Number of Phase"
                    name="phase"
                    autoComplete="phase"
                    value={data.phase}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  >
                     <MenuItem value={"1Phase"}>1Phase</MenuItem>
                     <MenuItem value={"3Phase"}>3Phase</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

<Grid item xs={7} sm={3.5}>
        <TextField
          fullWidth
          required
          label="Type of Taping Switch"
          id="typetaping"
          name="typetaping"
          autoComplete="off"
          value={tapingSwitch === 'nottaping' ? 'No taping' : typetaping}
          select={showDropdown && (tapingSwitch == 'oltc' || tapingSwitch == 'octc')}
          disabled={tapingSwitch === 'nottaping'}
          InputProps={{
            endAdornment: typetaping && (tapingSwitch === 'oltc' || tapingSwitch === 'octc') && (
              <IconButton onClick={handleClearSelection} edge="end">
                <ClearIcon />
              </IconButton>
            ),
          }}
          onChange={(e) => setTypetaping(e.target.value)}
        >
          {showDropdown && (tapingSwitch == 'oltc' || tapingSwitch == 'octc') && (
            <>
              {tapingSwitch == 'oltc' && (
                <>
                  <MenuItem value="℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer" onClick={() => handleDropdownChange("℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer")}>℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer</MenuItem>
                  <MenuItem value="℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer" onClick={() => handleDropdownChange("℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer")}>℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer</MenuItem>
                  <MenuItem value="Other OLTC" onClick={() => handleDropdownChange("other")}>Other OLTC</MenuItem>
                  {/* Add other dropdown options here */}
                </>
              )}
              {tapingSwitch == 'octc' && (
                <>
                  <MenuItem value="℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer" onClick={() => handleDropdownChange("℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer")}>℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer</MenuItem>
                  <MenuItem value="℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer" onClick={() => handleDropdownChange("℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer")}>℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer</MenuItem>
                  <MenuItem value="Other OCTC" onClick={() => handleDropdownChange("others")}>Other OCTC</MenuItem>
                  {/* Add other dropdown options here */}
                </>
              )}
            </>
          )}
        </TextField>

        <FormControl component="fieldset">
          <RadioGroup aria-label="taping-switch" name="taping-switch" value={tapingSwitch} onChange={handleRadioChange} row>
            <FormControlLabel value="octc" control={<Radio />} label="OCTC" />
            <FormControlLabel value="oltc" control={<Radio />} label="OLTC" />
            <FormControlLabel value="nottaping" control={<Radio />} label="No Taping" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={8} sm={7}>
                
  
                <TextField
          fullWidth
          required
          label="Type of Taping Switch"
          id="typetaping"
          name="typetaping"
          
          value={ typetaping || tapingSwitch}
          disabled
        >
          
        </TextField>

              </Grid>
             
              <Grid item xs={8} sm={7}>
                
                <FormControl style={{ width: "51.2vw" }} disabled={data.enqstatus >= 1}>
  <InputLabel id="demo-select-small">
    Select a Costing 
  </InputLabel>
  <Select
    fullWidth
    label="Select a Costing 1"
    id="selectcosting"
    name="selectcosting"
    value={selectedCostingName || data.selectedcosting || finalcosting}
    onChange={(e) => {
      const selectedName = e.target.value;
      setSelectedCostingName(selectedName);
    }}
    
  >
    <MenuItem value=" ">Select a Costing 1</MenuItem>
    {costingIDs.map((item) => (
      <MenuItem  key={item.id} value={item.costingname}>
        {item.costingname}
      </MenuItem>
    ))}
  </Select>
</FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
   {(tapingSwitch === 'octc' && typetaping === 'others') && (
    <TextField
    
      fullWidth
      label="Other Type of Taping Switch"
      value={otherTypetaping}
      onChange={(e) => setOtherTypetaping(e.target.value)}
    />
  )}
   {(tapingSwitch === 'oltc' && typetaping === 'other') && (
    <TextField
    
      fullWidth
      label="Other Type of Taping Switch"
      value={otherTypetaping}
      onChange={(e) => setOtherTypetaping(e.target.value)}
    />
  )}
   </Grid>
   
   
            </Grid>
            <br />
            <br />
            <Grid
              sx={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                sx={{background:"#007bff"}}
                onClick={handleSubmit}
                type="submit"
              >
                Update
              </Button>

            

             <NavLink to="/enquiry"> <Button variant="contained" color="error">
                Cancel
              </Button></NavLink>
            </Grid>
            <br />
          </Box>
        </Box>
      </Paper>
      </>
      )}
    </>
  );
};

export default EditEnquiry;
