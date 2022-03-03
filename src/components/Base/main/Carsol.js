import React from "react";
import {Carousel} from "react-bootstrap"


const Carsol = ({images})=>{

    // console.log(images, "imgs")
    // 배열안에 .imgid .imgpath

    
    {/* 댓글들 받아와서 반복문 돌림*/}
    const render = images.map((img,index)  =>{
        return(
                <Carousel.Item key={"imgItem"+img.imgid} >
                    <img
                        className="d-block w-100 main_img"
                        src={img.imgpath}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                    <h3  key={"itemTitle"+img.imgid}></h3>
                    </Carousel.Caption>
                </Carousel.Item>
        )
    })
    
    return(
    <Carousel fade>
        {render}
    </Carousel>
    )
}

export default Carsol