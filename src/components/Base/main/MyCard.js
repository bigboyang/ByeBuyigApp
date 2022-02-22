import React from "react";
import { Card } from "react-bootstrap";
import { Carousel } from "bootstrap";
import Carsol from "./Carsol";
import cardComponent from "../../../css/mycard.css"
import { Link, NavLink, Route } from 'react-router-dom';

const MyCard = ({categories, itemid, itemname, description, price, purchasecnt, images, reviewmean})=>{

    // result.push(<MyCard key={BasicItem[i]['itemid']} 
    // categories = {BasicItem[i]['categories']} 
    // itemid = {BasicItem[i]['itemid']} 
    // itemname = {BasicItem[i]['itemname']} 
    // description = {BasicItem[i]['description']} 
    // price = {BasicItem[i]['price']} 
    // purchasecnt = {BasicItem[i]['purchasecnt']} 
    // images = {BasicItem[i]['images']} 
    // reviewmean = {BasicItem[i]['reviewmean']} 
    // />);

    return(
        <div className="cardComponent">
        <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Carsol images = {images}/>
                    <Card.Title>
                    <Link to={{ pathname:"/detail", search : "?itemid="+itemid,
                    state : {
                        categories:categories,
                        itemid : itemid,
                        itemname : itemname,
                        description : description,
                        price : price,
                        purchasecnt : purchasecnt,
                        images : images,
                        reviewmean : reviewmean
                    },
                    }}>
                    {itemname}
                    </Link>
                    </Card.Title>
                        <br/>
                        <Card.Subtitle className="mb-2 text-muted">가격 : {price}</Card.Subtitle>
                        <Card.Text>
                           {description}
                        </Card.Text>
                        <Card.Text>
                           
                        </Card.Text>
                        <Card.Text>
                           평점 : {reviewmean}
                        </Card.Text>
                </Card.Body>
        </Card>
        </div>
    )
}

export default MyCard;