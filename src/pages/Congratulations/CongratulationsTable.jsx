import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { confirm } from "react-confirm-box";
import './congratulations.css';
import { Modal, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { OutlinedInput, TextField } from '@mui/material'
import Pagination from '@mui/material/Pagination';
import { AxiosInstance } from '../Axios/AxiosInstance';
import { checkStatus, ProductLimit } from '../Constants/Constant.mjs';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'white',
    border: '2px solid transparent',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

function CongratulationsTable({page_count,isEmptyPage,congratulations,getCongratulations,usersList,holidays}) {
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => setOpen(false);
    const [isRequesting,setIsRequesting] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = React.useState(1);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    // Field variables
    const [title,setTitle] = useState('');
    const [holiday, setHoliday] = useState('');
    const [selectedUser,setSelectedUser] = useState('');
    const [status,setStatus] = useState('');
    const [text,setText] = useState('');
    const [id,setId] = useState('');
    // Field variables

    const handleOpen = (element) => {
        setOpen(true);
        setTitle(element.title);
        setHoliday(element.holiday_id);
        setSelectedUser(element.user_id);
        setStatus(element.status);
        setText(element.text);
        setId(element.id);
    }


    const handleClick = () => {
        updateCongratulation();
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete?")) {
            deleteFun(element.id);
        }
    };

    const handleChange = (event, value) => {
        setPage(value);
        getCongratulations(value);
    };

    const clearInput=()=>{
        setTitle('');
        setHoliday('');
        setSelectedUser('');
        setStatus('');
        setText('');
        setId('');
      }

    const deleteFun=(id)=>{
        AxiosInstance.delete('/congratulation/delete-congratulation/'+id)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully deleted!");
                getCongratulations(page);
            } else {
                showError("Something went wrong!");
            }
        })
        .catch(err => {
            showError(err + "");
        })
    }

   
    const updateCongratulation=()=>{
        if(title=='' || text=='') {
          showWarning('Please enter all required information');
          return;
        }
        setLoading(true);
        const body = {
          title:title,
          holiday:holiday,
          user:selectedUser,
          status:status,
          text:text,
          id:id
        };
        AxiosInstance.put('/congratulation/update-congratulation',body)
        .then(response => {
          if (!response.data.error) {
              showSuccess("Successfully updated!");
              setLoading(false);
              clearInput();
              handleClose();
              getCongratulations(1);
          } else {
              showError("Something went wrong!");
              setLoading(false);
          }
        })
        .catch(error => {
            showError(error + "");
            setLoading(false);
        })
      }
  


    return (
        <div>
        {((typeof congratulations === 'undefined' || congratulations.length <= 0) && !isEmptyPage) ? <Loading /> : ((typeof congratulations === 'undefined' || congratulations.length <= 0) && isEmptyPage) ? <Empty /> :
            <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Holiday</TableCell>
                            <TableCell align="left">User</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">DELETE</TableCell>
                            <TableCell align="left">EDIT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            congratulations.map((element, i) => {
                                    return (
                                        <TableRow
                                            key={`keey${element.id}`}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{element.id}</TableCell>
                                            <TableCell align="left">{element.title}</TableCell>
                                            <TableCell align="left">{element.holiday_name_tm}</TableCell>
                                            <TableCell align="left">{element.fullname   }</TableCell>
                                            <TableCell align="left">{checkStatus(element.status).label}</TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={()=>confirmDialog(element)}><DeleteIcon /></IconButton></TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="success" onClick={()=>handleOpen(element)}><EditIcon /></IconButton></TableCell>
                                        </TableRow>
                                    )
                            })
                        }



                    </TableBody>
                </Table>
            </TableContainer>
             <br />
             <Stack direction={"row"} justifyContent={"center"}>
                 <Pagination count={page_count} 
                 page={page}
                 onChange={handleChange}
                 color="primary" />
             </Stack>
             </div>

            }


            {/* Modal for edit */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack
                        direction={"column"}
                        spacing={3}
                    >
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-end'}
                        >
                            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                        </Stack>
                        <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Title"
                  defaultValue=""
                  value={title}
                  onChange={e=>setTitle(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Holiday</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={holiday}
                    onChange={e=>setHoliday(e.target.value)}
                    input={<OutlinedInput label="Holiday" />}
                  >
                    {
                      holidays?.map((holiday) => {
                        return (
                          <MenuItem key={`keyy${holiday.id}`} value={holiday.id}>
                            {holiday.holiday_name_tm}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">User</InputLabel>
                  <Select
                    value={selectedUser}
                    onChange={e=>setSelectedUser(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label="User" />}
                  >
                    {
                      usersList.map((user) => {
                        return (
                          <MenuItem
                            key={`keeey${user.id}`}
                            value={user.id}
                          >
                            {user.fullname}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                  <Select
                    value={status}
                    onChange={e=>setStatus(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label="Status" />}
                  >
                    <MenuItem
                      key="Active"
                      value="1"
                    >
                      Active
                    </MenuItem>

                    <MenuItem
                      key="Passive"
                      value="0"
                    >
                      Passive
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={12}>
                <TextField
                  fullWidth
                  id="filled-textarea"
                  label="Text"
                  placeholder="Enter Text..."
                  multiline
                  rows={6}
                  variant="filled"
                  value={text}
                  onChange={e=>setText(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={12}>
                {
                  <LoadingButton
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<EditIcon />}
                    variant="contained"
                    fullWidth={true}
                    onClick={handleClick}
                  >
                    {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Edit</p>}
                  </LoadingButton>

                }

              </Grid>
            </Grid>
                    </Stack>
                </Box>
            </Modal>
            {/* End of modal edit */}
        </div>
    )
}

export default CongratulationsTable
