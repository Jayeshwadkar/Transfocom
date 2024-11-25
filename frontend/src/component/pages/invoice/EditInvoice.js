import { Grid, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./invoice.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";

const EditInvoice = () => {
  const [data, setData] = useState({
    coustomeraddress: "",
     buyername:"",
    consignee_cat: "",
    transport_mode: "",
    po_no: "",
    po_date: "",
    vehicle_no: "",
    grand_total: "",
    advance: "",
    date_issue: "",
    time_issue: "",
    date_removal: "",
    time_removal: "",
    by_road: "",
    buyer_addr: "",
    consign_addr: "",
   
    consigneename: "",
   
  
    
    hsn: "",
    rate: "",
  });
  const navigate= useNavigate()
  const { id } = useParams();
  const [editableFields, setEditableFields] = useState({
   
 
  
    coustomeraddress: "",
     buyername:"",
    consignee_cat: "",
    transport_mode: "",
    po_no: "",
    po_date: "",
    vehicle_no: "",
    grand_total: "",
    advance: "",
    date_issue: "",
    time_issue: "",
    date_removal: "",
    time_removal: "",
    by_road: "",
    buyer_addr: "",
    consign_addr: "",
   
    consigneename: "",
   
  
    
    hsn: "",
    rate: "",
    
    // ... add other fields
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editInvoice/+${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
        setData(resData);
        console.log(resData)
        setEditableFields({
          buyername: resData.buyername,
          consigneename: resData.consigneename,
          buyer_addr: resData.buyer_addr,
         consignee_cat: resData.consignee_cat,
         transport_mode: resData.transport_mode,
         po_no: resData.po_no,
         po_date: resData.po_date,
         vehicle_no: resData.vehicle_no,
         grand_total: resData.grand_total,
         advance: resData.advance,
         date_issue: resData.date_issue,
         time_issue: resData.time_issue,
         date_removal: resData.date_removal,
         time_removal: resData.time_removal,
         by_road: resData.by_road,
         
         consign_addr: resData.consign_addr,
        
         consigneename: resData.consigneename,
         hsn: resData.hsn,
         rate: resData.rate,
          // ... initialize other fields
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = (field, value) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

   
 
    try {
      const res = await fetch(`${APP_BASE_PATH}/editInvoiceInfo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableFields),

      });

      const resjson = await res.json();
      if (resjson) {
        Swal.fire({
          title: "Data Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });
      navigate(-1)
      }
    } catch {
      Swal.fire({
        title: "SomeThing Went Wrong!!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    }
  };
  


  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Edit Invoice</h4>
        </div>
        <Link to="/newinvoice" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      },}} >
            Back
          </Button>
        </Link>
      </div>
      <Paper elevation={6} style={{ position: "relative", bottom: 20 }}>
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
                  id="invoice_no"
                  label="Invoice Number"
                  labelprope
                  name="invoice_no"
                  value={data.invoice_no}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
              </Grid>
             
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="vehicle_no"
                  label="Invoice Date"
                  name="inv_date"
                  autoComplete="Date"
                  value={data.inv_date}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
              </Grid>
              
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Buyer Name"
                  name="custname"
                  autoComplete="Date"
                  value={data.buyername}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="consignname"
                  label="Consignee Name"
                  name="consigneename"
                  autoComplete="Date"
                  
                  value={editableFields.consigneename}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("consigneename", e.target.value)}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="buyer_addr"
                  label="Buyer Address (Optional)"
                  name="buyer_addr"
                  value={data.buyer_addr}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="consign_addr"
                  label="Consignee Address (Optional)"
                  name="consign_addr"
                  
                  value={editableFields.consign_addr}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("consign_addr", e.target.value)}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
  <TextField
                  fullWidth
                  id="consignee_cat"
                  label="Challan NO "
                  name="consignee_cat"
                  value={data.challan_no}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
  </Grid>
  <Grid item xs={7} sm={3.5}>
  <TextField
                  fullWidth
                  id="consignee_cat"
                  label="Challan Date "
                  name="consignee_cat"
                  value={data.chdate}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
  </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="po_no"
                  label="PO Number (Optional)"
                  name="po_no"
                  value={data.po_no}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="transport_mode"
                  label="Mode of Transport"
                  name="transport_mode"
                  
                  value={editableFields.transport_mode}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("transport_mode", e.target.value)}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="vehicle_no"
                  label="PO_Date"
                  name="po_date"
                  autoComplete="Date"
                  value={data.po_date}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="by_road"
                  label="By Road"
                  name="by_road"
                  
                  value={editableFields.by_road}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("by_road", e.target.value)}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="vehicle_no"
                  label="Vehicle Registration Number"
                  name="vehicalNo"
                  autoComplete="Date"
                  value={data.vehicle_no}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true, // Add the readOnly attribute
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                
                <TextField
                  fullWidth
                  id="vehicle_no"
                  label="Date Of issue"
                  name="date_issue"
                  autoComplete="Date"
                  
                  value={editableFields.date_issue}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("date_issue", e.target.value)}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="vehicle_no"
                  label="Time Of Issue"
                  name="time_issue"
                  autoComplete="Date"

                  value={editableFields.time_issue}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("time_issue", e.target.value)}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="vehicle_no"
                  label="Date Of Removal"
                  name="date_removal"
                  autoComplete="Date"
                 
                  value={editableFields.date_removal}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("date_removal", e.target.value)}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="vehicle_no"
                  label="Time Of Removal"
                  name="time_removal"
                  autoComplete="Date"
                 
                  value={editableFields.time_removal}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleEdit("time_removal", e.target.value)}
                />
              </Grid>
            </Grid>
            <br />
            <div class="form-group row">
              <table
                id="myTable"
                className="table table-responsive-sm table-bordered table-sm inventory"
                style={{ width: "89%" }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Sr No</th>
                    <th style={{ width: "30%" }}>Description</th>
                    <th style={{ width: "20%" }}>HSN</th>
                    <th style={{ width: "10%" }}>Quantity</th>
                    <th style={{ width: "15%" }}>Rate/Unit</th>
                    <th style={{ width: "25%" }}>Amount(Rs)</th>
                  </tr>
                </thead>

                <tbody>
                  <tr id="details" name="details1" class="table-striped detls ">
                    <td>
                      <input
                        type="hidden"
                        id="planid<%=j %>"
                        value="<%=r1.getPlanid()%>"
                        name="planid"
                      />{" "}
                      <input type="hidden" id="costtype2" name="casttype" />
                    </td>

                    <td> {data.desc}
                        </td>
                    <td name="">
                      <input type="text" id="hsn<%=j %>" name="hsn" value={editableFields.hsn} nChange={(e) => handleEdit("hsn", e.target.value)}/>{" "}
                    </td>
                    <td id="qty<%=j %>" name="qty">
                     {data.qty}
                    </td>
                    <td>
                      {data.rate}
                      
                    </td>

                    <td id="amt<%=j %>" name="amt"value={data.amt} class="amount">
                    {data.amt}
                    
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                className="table table-responsive-sm table-bordered table-sm"
                style={{ width: "89%" }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}></td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td style={{ width: "25%" }}></td>
                  </tr>

                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>
                      Total Basic
                    </td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td >{data.basic_total}
                       
                      </td>
                  </tr>
                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>
                      C.GST 9%
                    </td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td > {data.cgst}
                       
                      </td>
                  </tr>
                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>
                      S.GST 9%
                    </td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td>{data.sgst}
                       
                      </td>
                  </tr>
                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>I.GST</td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td
                      >{data.igst}
                     
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>
                      Round Off
                    </td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td
                      >{data.roundoff}
                     
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>
                      Grand Total
                    </td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td
                       >{data.grand_total}
                      
                     </td>
                  </tr>
                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>
                      Advance
                    </td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td
                     >
                    {editableFields.advance}
                    
                   </td>
                  </tr>

                  <tr>
                    <td style={{ width: "5%" }}></td>
                    <td style={{ width: "30%", textAlign: "right" }}>
                      Net Total
                    </td>
                    <td style={{ width: "20%" }}></td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "15%" }}></td>
                    <td style={{ width: "25%" }}> 
                        {data.net_total}
                       
                      </td>
                  </tr>
                </tbody>
              </table>

              <table
                class="table table-responsive-sm table-bordered table-striped table-sm"
                style={{ width: "90%" }}
              >
                <tr>
                  <td>
                    <p style={{ fontSize: 15 }}>
                      {" "}
                      1) The item which is despatched to you directly or through
                      a third party, the company reserves the right to take back
                      the item against any delay/non payment.
                    </p>
                    <p style={{ fontSize: 17, position: "absolute" }}>
                      <b>Subject to Pune Jurisdiction Only</b>
                      <br />
                      Received the above items in good condition.
                    </p>
                    <br />
                    <br />
                    <br />
                    <p style={{ fontSize: 17, position: "absolute" }}>
                      Receivers Signature And Stamp :
                      __________________________________
                    </p>
                  </td>

                  <td colspan="2">
                    <center>
                      <p style={{ fontSize: 27 }}>
                        For <b>Static Electricals Pune</b>
                      </p>
                      <br />
                      <br />
                      <br />
                      <br /> <br />
                      <br />
                      <p style={{ fontSize: 20 }}>Authorised Signatory</p>
                    </center>{" "}
                  </td>
                </tr>{" "}
              </table>
            </div>

            <br />
            <br />
            <Grid
              container
              spacing={-101}
              sx={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginLeft: "21rem",
              }}
            >
              <Grid item xs={9} sm={3}>
                <Button variant="contained" sx={{ background: "#00d284",
             "&:hover": {
               background: "#00d284", // Set the same color as the default background
             },}} type="submit" onClick={handleSubmit}>
                  Update
                </Button>
              </Grid>
              <Grid item xs={9} sm={3}>
                <Button variant="contained" style={{ position: "relative", right: 10 , background: "#ff0854",
              "&:hover": {
                background: "#ff0854", // Set the same color as the default background
              },}}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
            <br />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default EditInvoice;
