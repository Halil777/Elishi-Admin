import { Grid } from '@mui/material'
import React,{useState} from 'react'
import Stack from '@mui/material/Stack';
import './login.css'
import LoadingButton from '@mui/lab/LoadingButton';
import Logo from "../../assets/images/transparent_logo.png"
import { AxiosInstance } from '../Axios/AxiosInstance.js';
import { loginRoute } from '../API/API.mjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showError } from '../Alert/Alert.mjs';



const Login = () => {
    const[isLoading,setIsLoading]=useState(false);
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const handleClick=()=>{
        setIsLoading(true);
        const data = {
            username: username,
            password: password
        }
        AxiosInstance.post("/sign-in",data)
        .then(response=>{
            setIsLoading(false);
            if(!response.data.error){
                
                localStorage.setItem('my_token',response.data.body.token);
                localStorage.setItem('userID',response.data.body.userId);
                localStorage.setItem('user_type',response.data.body.user_type);
                window.location.href="/";
            } else {
                showError("Username or password is incorrect!");
            }
        })
        .catch(err=>{
            setIsLoading(false);
            showError(err+"");
            
        })
        
    }
  return (
      <div>
          
           <div className="loginContainer">
      
            </div>
            <Grid container spacing={2} className="login">

                <Grid item xs={1} lg={3}></Grid>
                <Grid item xs={10} lg={6} className="box-login">
                    <Stack direction={"column"} className="loginForm" spacing={3}>
                        <div>
                            <center><img className="imgLogin" src={Logo}/></center>
                        </div>
                        <h2>Elishi admin</h2>
                        <label>Please enter your username and password</label>

                        <input placeholder="Enter your username" value={username} onChange={e=>setUsername(e.target.value)} type="text" className="input"/>
                        <input placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} type="password" className="input"/>
                        <LoadingButton loading={isLoading} variant="contained" fullWidth onClick={handleClick}>
                            Login
                        </LoadingButton>
                    </Stack>
                </Grid>
                <Grid item xs={1} lg={3}></Grid>

            </Grid>
            <ToastContainer />
      </div>
   
  )
}

export default Login
