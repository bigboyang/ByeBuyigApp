import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'
import { addBasket } from "../redux/basket/actions"
import Page from "../components/Base/main/Page";
import { Form, Button, Table } from "react-bootstrap";
import _ from 'lodash'
import {addOrderList} from "../redux/OrderItems/actions"



const ShoppingBasket = () => {


    const location = useLocation();
    const locationState = location.state;
    const userid = sessionStorage.getItem("id");
    const dispatch = useDispatch();
    const histroy = useHistory();

    // ShoppingBasket에서 사용할 state
    let [pageNo, setPathNo] = useState(1);
    let [totalPageNo, setTotalPageNo] = useState();
    const [basketItem, setBasketItem] = useState([]);
    const [checkBaskets, setCheckBaskets] = useState([]);
    const [checkItems, setCheckItems] = useState([]);
    const [AllBasketNum, setAllBasketNum] = useState(0);
    // 업데이트로 보내기 위해 조작할 배열
    const [updateItem, setUpdateItem] = useState([]);
    // 주문할떄 보낼 배열들
    const [orderItems, setOrderItems] = useState([]);



    // 장바구니 받아오는 axios
    const GetBasketItem = async (userid, pageNo) => {
        await axios.get('http://127.0.0.1:8081/basket/byUsername', {
            params: {
                username: userid,
                page: pageNo
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('access_token')
            }
        }).then(res => {
            const data = res.data
            console.log(data);
            // data.content[0].bcount = 3;
            setTotalPageNo(data.totalPages);
            setBasketItem(data.content)
            setUpdateItem(data.content)
            setAllBasketNum(data.content.length)
            dispatch(addBasket(res.data.content))
        }).catch(error => {
            console.log(error, ' GetBasketItem 에러');
        })
    }

    // 수정하는 axios
    const update = async (idx)=>{
        const data = updateItem[idx] 
        await axios.put('http://127.0.0.1:8081/basket/update',{
            id : data.id,
            username : data.username,
            bcount : data.bcount,
            itemid : data.itemid
            
        },{
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('access_token')
            }
        }).then(res => {
            console.log(res);
            window.location.reload()
        }).catch(error => {
            console.log(error, ' updateBasket 에러');
        })
    }

    useEffect(() => {
        GetBasketItem(userid, pageNo)
    }, [pageNo])

    // 페이징함수
    const handlePage = (value) => {
        // GetBasketItem(userid, value)
        setPathNo(value);
    }

    // 체크박스 체크하면
    const reviewCheck = (checked, basketid, itemid, data) => {
        if (checked) {
            setCheckBaskets([...checkBaskets, basketid]);
            setCheckItems([...checkItems, itemid]);
            setOrderItems([...orderItems, data]);
        } else {
            // 체크 해제
            setCheckBaskets(checkBaskets.filter((x) => x !== basketid));
            setCheckItems(checkItems.filter((x) => x != itemid));
            setOrderItems(orderItems.filter((x) => x.itemid != itemid));
        }
    }

    // 모두 체크하는 함수
    const allBasketCheck = (checked) => {
        if (checked) {
            const basketid = []; // `checkbox-${reviewid}`
            const itemid = [];
            const orderid = [];
            basketItem.forEach((res) => {
                basketid.push(res.id);
                itemid.push(res.itemid);
                orderid.push(res)
            });
            setCheckBaskets(basketid);
            setCheckItems(itemid);
            setOrderItems(orderid)
        } else {
            // 전체 체크 박스 제거
            setCheckBaskets([]);
            setCheckItems([]);
            setOrderItems([]);
        }
    }

    // 장바구니에서 삭제
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(checkBaskets, "checkBaskets")
        await axios.delete("http://127.0.0.1:8081/basket/delete", {
            params: {
                basketid: checkBaskets
            }
        }).then(res => {
            setCheckItems([])
            window.location.reload()
        }).catch(err => {
            console.log(err)
        })
    }

    // 구매요청 계속 오류나는 곳
    const makeOrder = async ()=>{
        // 필요없는 리뷰아이디 삭제
        for (let i =0; i< orderItems.length; i++){
            delete orderItems[i].id
        }
        console.log(orderItems, "makeOrder로 보내는 값")
        console.log([{1:"하나",2:"둘"}])
        dispatch(addOrderList(orderItems))


        //주소
        await axios.post("http://127.0.0.1:8081/orderHistory/add",{
            // body ,2번째 괄호
            orderItems
        },{
            // header ,3번째 괄호
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('access_token')
            },
        }).then(res => {
            const data = res.data
            console.log(data);
            
        }).catch(error => {
            console.log(error, ' makeOrder 에러');
        })
    }

   

    // update axios 로 보낼 배열들을 조작하는 함수들
    const decreaseNum = (idx)=>{
        const temp = [...updateItem]
        temp[idx].bcount = temp[idx].bcount -1 
        if (temp[idx].bcount < 1){
            temp[idx].bcount = 0
        }
        setUpdateItem(
            temp
        )
    }
    const increaseNum = (idx)=>{
        const temp = [...updateItem]
        temp[idx].bcount = temp[idx].bcount + 1 
        setUpdateItem(
            temp
        )
    }   



    return (
        <Container>
            <Form className='review' onSubmit={onSubmit} >
                <div className='title'>장바구니</div>

                <div>
                    {/* <Button type="button" className="remove" variant="secondary" size="sm" onClick={update}>수정 </Button> */}
                    <Button type="submit" className="remove" variant="secondary" size="sm" style={{position:"relative", right:"5px"}} >삭제</Button>
                    <Button type="button" className="remove" variant="secondary" size="sm" onClick={()=> {makeOrder() }}>구매 </Button>
                </div>
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th className="checkBox">
                                    <div>
                                        <Form.Check
                                            type='checkbox' id='checkbox'
                                            onChange={(e) => allBasketCheck(e.target.checked)}
                                            checked={checkBaskets.length === AllBasketNum ? (AllBasketNum === 0 ? false : true) : false}
                                        />
                                    </div>
                                </th>
                                <th></th>
                                <th>상품정보</th>
                                <th>가격</th>
                                <th colSpan={2}>수량</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {   

                                (updateItem.length != 0) ? basketItem.map((data, idx) => {
                                    
                                    let bcount = data.bcount
                                    let showBcount = _.cloneDeep(bcount)
                                    let id = data.id
                                    let itemid = data.itemid
                                    let itemimg = data.itemimg
                                    let itemname = data.itemname
                                    let itemprice = data.itemprice
                                    let reviewData =
                                        <tr key={id}>
                                            <td className="checkBox">
                                                <Form>
                                                    <div className="checkBox">
                                                        <Form.Check
                                                            type='checkbox' className={`checkbox-${id}`}
                                                            onChange={(e) => reviewCheck(e.target.checked, id, itemid, data)}
                                                            checked={checkBaskets.includes(id) ? true : false}
                                                        />
                                                    </div>
                                                </Form>
                                            </td>
                                            <td>
                                                <img src={itemimg} width="80" height="96" style={{ marginRight: "5px" }} />
                                            </td>
                                            <td>
                                                {itemname}
                                            </td>
                                            <td>{itemprice*bcount}</td>
                                            <td colSpan={2} style={{paddingLeft:"20px"}}>
                                                {showBcount}
                                            </td>
                                            <td>
                                            <form>
                                                <div className="value-button" id="decrease" onClick={()=>{decreaseNum(idx); }} value="Decrease Value"><div className="plusminus">-</div></div>
                                                <div className="value-button" id="increase" onClick={()=>{increaseNum(idx); }} value="Increase Value"> <div className="plusminus">+</div></div>
                                                <Button type="button" className="remove" variant="secondary" size="sm" onClick={()=> {update(idx); }}>수정 </Button>
                                            </form>
                                            </td>
                                        </tr>
                                    return (reviewData)
                                }) : ""
                            }
                        </tbody>
                    </Table>
                </div>
            </Form>
            <div className="centered">
                {
                    totalPageNo != 0 ? <Page
                        setPage={handlePage}
                        totalPage={totalPageNo}
                        selected={pageNo}
                    /> : ""
                }
            </div>
        </Container>
    )
}

export default ShoppingBasket