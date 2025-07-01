import React, { useState,useEffect } from 'react'
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux"

const Tag = ({
    label,
    name,
    placeholder,
    register,
    errors,
    setValue,
    getValues,
}) => {

    const [tag,setTag] = useState([]);
    const { editCourse, course } = useSelector((state) => state.course)

    useEffect(() => {
        if (editCourse) {
          // console.log(course)
          setTag(course?.tag)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
      useEffect(() => {
        setValue(name, tag)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [tag])

    const handleEnter = (event) => {

        if(event.key === "Enter" && event.target.value !== ""){
            event.preventDefault()
            const tagValue = event.target.value.trim();

            if(tagValue && !tag.includes(tagValue)){

                setTag([...tag,tagValue])
                event.target.value = ""
            }
        }
    }

    const removeEleTag = (indexToRemove) => {
        setTag(tag.filter((_,index) => index !== indexToRemove))
    };
 
  return (
    <div className="flex flex-col space-y-2">       
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>

            <div className='flex flex-row flex-wrap gap-y-'>
                {
                    tag.map((ele,index) => {
                        return(
                            <div key={index} 
                                className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
                                <span>{ele}</span>
                                <button type="button"
                                        className="ml-2 focus:outline-none"
                                        onClick={ () => removeEleTag(index)}
                                >
                                    <MdClose className="text-sm" />

                                </button>
                            </div>
                        )
                    })
                }
            </div>

            <input
                id={name}
                name={name}
                type="text"
                placeholder={placeholder}
                onKeyDown={handleEnter}
                className="form-style w-full"
            />
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                {label} is required
                </span>
            )}
    </div>
  )
}

export default Tag