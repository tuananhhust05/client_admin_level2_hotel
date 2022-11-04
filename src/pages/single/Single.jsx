import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Comment from "../../components/comment/Comment";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Single = () => {
  // chỉ hiển thị thông tin về khách sạn và loại phòng 
  const navigate = useNavigate();
  const location = useLocation(); 
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];  // id khách sạn 

  const [dataHotel,setDataHotel] = useState({});
  const [listComment,setListComment] = useState([]);
  useEffect(() => {
    const takeData= async()=>{ 
        if( String(location.pathname.split("/")[1]) === "hotels"){
          // dữ liệu veef khách sạn
          const res = await axios.get(`/hotels/find/${id}`); // gửi token để check 
          if(!res.data._id){
            navigate("/");
          }
          if(res.data._id){
            setDataHotel(res.data)
          }
          
          // dữ liệu về comment 
          const res2 = await axios.get(`/comments/TakeCommentByHotelId/${id}`); // gửi token để check 
          setListComment(res2.data.data)
        }
      }
    try{
      takeData();
    }
    catch(e){
      navigate("/");
      console.log(e);
    }
  },[])
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            {
              (path === "hotels") &&(
                  (dataHotel !== {}) && (
                      <div className="item">
                          <img
                            src={dataHotel.photos && dataHotel.photos.length>0 ? dataHotel.photos[0] : ""}
                            alt=""
                            className="itemImg"
                          />
                          <div className="details">
                            <h1 className="itemTitle">{dataHotel.name}</h1>
                            <div className="detailItem">
                              <span className="itemKey">City:</span>
                              <span className="itemValue">{dataHotel.city}</span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Address:</span>
                              <span className="itemValue">{dataHotel.address}</span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Title:</span>
                              <span className="itemValue">
                                  {dataHotel.title}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Type:</span>
                              <span className="itemValue">{dataHotel.type}</span>
                            </div>
                          </div>
                      </div>
                  )
              )
            }
          </div>
          {
            ( (path === "hotels") && (dataHotel !== {}) && (dataHotel.photos) && (dataHotel.photos.length>0) )
            && (
              <div className="right">
                  <div className="img1">
                     <img
                       src={dataHotel.photos && dataHotel.photos.length>0 ? dataHotel.photos[0] : ""}
                       alt=""
                       className="itemImg1"
                     />
                  </div>
                  <div className="img2">
                      <img
                          src={dataHotel.photos && dataHotel.photos.length>1 ? dataHotel.photos[1] : ""}
                          alt=""
                          className="itemImg2"
                        />
                      {
                        (dataHotel.photos.length>1) &&(
                          <div className="count">
                              <p>
                                 {dataHotel.photos.length -1}+
                              </p>
                         </div>
                        )
                      }
                  </div>
              </div>
            )
          }
        </div>
        <div className="comment">
              {
                listComment.map(comment=>
                  (
                    <Comment key={comment._id} nameuser={comment.username} imgsource={comment.imgUser} content={comment.content} time={comment.createAt} />
                  )
                )
              }
        </div>
      </div>
    </div>
  );
};

export default Single;
