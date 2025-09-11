import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const {role_name,name,email,password} = useContext(AuthContext);
  return (
    <div>Your Details: role-{role_name},name-{name?.value},email-{email?.value},password-{password?.value}</div>
  )
}

export default Home