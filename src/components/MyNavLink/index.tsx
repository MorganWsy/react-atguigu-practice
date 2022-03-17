import React from 'react'
import { NavLink } from 'react-router-dom'

export default function MyNavLink(props) {
  const activeStyle= {
    color: '#fff',
    backgroundColor: 'seagreen'
  }
  return (
    <NavLink className='list-item' style={({isActive}) => isActive ? activeStyle : undefined} {...props}/>
  )
}
