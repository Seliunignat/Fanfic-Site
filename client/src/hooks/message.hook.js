import { useCallback } from 'react'
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.minimal.css';

export const useMessage = () => {
    return useCallback((text) => {
        toast.info(text, { autoClose: 2500} )
    }, [])
}