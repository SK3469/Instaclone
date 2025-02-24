import React, { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Login = () => {
  //create useState
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  //setup loding useState to trun off if account created or not 
  const [loading, setLoading] = useState(false); // this must be false otherwise this directly move to action thats means this cant apply conditions.
  //setup react-route dom navigation feature to navigate to home page 
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  const signupHandler = async (e) => {
    e.preventDefault();  // this term use to rejecting refreshing of page , if refreshing fill data might gone....
    // console.log(input)
    try {
      setLoading(true); // setloding stating if server api responding corretly ..
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, { //make sure api have a corrected http path..
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
        setInput({                       // if getting response success then setInput data must be empty.
          email: "",
          password: ""
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);   //this turn off if work done.
    }
  }
  return (
    <div className='flex mx-auto my-20 justify-center items-center '>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-3 '>
          <h1 className='text-xl font-bold text-center '>LOGO</h1>
          <p className='font-semibold text-sm text-center'>Login your Account, to see all posts from your Friends  & Family</p>
        </div>
        <div className='flex flex-col gap-3'>
          <Label className="font-semibold">Email</Label>
          <Input
            className="focus-visible:ring-transparent"
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="babli@gmail.com"
          />
          <Label className="font-semibold">Password</Label>
          <Input
            className="focus-visible:ring-transparent "
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="********"
          />
        </div>
        {
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'
              />
              Please wait 
            </Button>
          ):(<Button type='submit'>Login</Button>)
        }
        
        <span className='text-center'>don't have any account? <Link to ="/signup" className='text-blue-600'>Signup</Link></span>
      </form>
    </div>
  )
}

export default Login