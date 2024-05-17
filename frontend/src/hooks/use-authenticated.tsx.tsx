import { useState } from "react"

export const useAuthenticated = ()=>{
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isAuthenticated = fetch('http://localhost:8000/')
}