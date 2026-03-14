import React from 'react'

export default function NoPageFound() {
    return (
            <>
                {/*Page Not Found*/}
                <section className="notfound-page-section">
                    <div className="nf-container flex flex-col justify-center items-center text-center h-dvh">
                        <p className="text-6xl font-bold text-cyan-900"> 404 </p>
                        <p className=" text-cyan-900"> Sorry! This Page is Not Found </p>
                    </div>
                </section>
            </>
    )
}
