import React from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import './index.scss';

export default function MyNavLink(props: NavLinkProps) {
  return (
    <NavLink className={(isActive) => isActive ? 'myActive list-item' : 'list-item'} {...props}/>
  )
}
