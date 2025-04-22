import React, { useContext } from 'react'
import articleContext from '../context/articles/articleContext'

const Alert = () => {
    const context = useContext(articleContext);
    const { alertObj } = context;
    return (

        alertObj && (
            alertObj.type === "Note" ?
                <div className=" alert alert-primary alert-dismissible fade show mb-0 sticky-top" role="alert">
                    Note has been <strong>{alertObj.operation}</strong></div>
                :
                <div className=" alert alert-primary alert-dismissible fade show mb-0 sticky-top" role="alert">
                    User <strong>{alertObj.operation}</strong> successfull</div>
        )
    )
}

export default Alert