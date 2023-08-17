import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Icon from './icon';
import { GoogleLogin } from 'react-google-login';
import useStyles from './styles'
import Input from './Input'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {signup,signin} from '../../actions/auth'


const Auth = () => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const [showPassword,setShowPassword] = useState(false)
    const [formData,setFormData] = useState();
    const [isSignup,setisSignup] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if(isSignup){
            console.log(formData)
            dispatch(signup(formData,history))
        }
        else{
            console.log(formData)
            dispatch(signin(formData,history))
           
        }
    }

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !showPassword)
    }

    const switchMode = () => {
        setisSignup((prevIsSignup) => !prevIsSignup)
        handleShowPassword(false)
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj; // ?. is an operator that's not gonna show an error if we don't have an access to res object 
        const token = res?.tokenId;
        console.log(res)
        try {
            dispatch({ type:'AUTH',data:{result,token}})
            history.push('/')
        } catch (error) {
             console.log(error)
        }
        console.log("Success")
    }

    const googleError = () => {
        console.log("Error")
    }
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                   <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                   <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                         <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                         <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />    
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    { isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                        clientId="355384912670-sqgnm09nrijoi6ftlc3u5np21u50uo89.apps.googleusercontent.com"
                        render={(renderProps) => (
                        <Button className={classes.googleButton} 
                                color="primary"
                                fullWidth 
                                onClick={renderProps.onClick} 
                                disabled={renderProps.disabled} 
                                startIcon={<Icon />} 
                                variant="contained">
                            Google Sign In
                        </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleError}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an account ? Sign In' : "Don't have an account ? Sign Up" }
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth
